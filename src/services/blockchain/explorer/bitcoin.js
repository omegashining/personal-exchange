import {TransactionBuilder, ECPair, networks} from "bitcoinjs-lib"
import {accountFromSeed} from "../../../util/hdwalllet.js"
import axios from "axios"
import querystring from "querystring"
import coinselect from "coinselect"

export default class BitcoinExplorer {
    constructor(config) {
        this.config = config
        this.network = this.config.network
        this.explorer = config.explorer
        this.unspent = config.unspent
        this.broadcast = config.broadcast
        this.fee = config.fee
        this.master = config.master
        this.minimum = config.minimum
    }

    createWallet(seed, index) {
        const seedBytes = Buffer.from(seed, 'hex')
        const bitcoin = accountFromSeed(seedBytes, index, this.network)

        return {
            address: bitcoin[1],
            privateKey: bitcoin[2],
            publicKey: bitcoin[3].toString('hex')
        }
    }

    async getBalance(address) {
        // console.log("-->" + `${this.explorer}/addresses/balances?addresses=${address}` )
        return axios.get(`${this.explorer}/addresses/balances?addresses=${address}`)
            .then(result => {
                const data = result.data
                if (!data.data || !data.data[address]) {
                    return 0
                }

                return parseFloat(data.data[address]) / 1e8
            }).catch(error => {
                throw new Error(error)
            })
    }

    async getTransactionInfo(txId, address = null) {
        // console.log("-->" + `${this.explorer}/dashboards/transaction/${txId}` )
        return axios.get(`${this.explorer}/dashboards/transaction/${txId}`)
            .then(result => result.data)
            .then(tx => {
                const data = tx.data[txId]
                const inputTotal = data.transaction.input_total
                const outputTotal = data.transaction.output_total

                let value
                let type
                if (address) {
                    const inputAddress = data.inputs
                        .filter(input => input.recipient === address)
                        .reduce((sum, input) => sum + input.value, 0)
                    const outputAddress = data.outputs
                        .filter(output => output.recipient === address)
                        .reduce((sum, input) => sum + input.value, 0)

                    if (inputAddress > 0 && outputAddress > 0) {
                        if (inputAddress > outputAddress) {
                            value = inputAddress - outputAddress
                            type = 'withdrawal'
                        } else {
                            value = outputAddress - inputAddress
                            type = 'deposit'
                        }
                    } else if (inputAddress > 0 ) {
                        value = inputAddress
                        type = 'withdrawal'
                    } else if (outputAddress > 0) {
                        value = outputAddress
                        type = 'deposit'
                    }
                } else {
                    value = outputTotal > 0 ? outputTotal : inputTotal
                    type = outputTotal > 0 ? 'deposit' : 'withdrawal'
                }

                return {
                    hash: data.transaction.hash,
                    from: data.inputs.map(input => input.recipient),
                    to: data.outputs.map(output => output.recipient),
                    value: Math.abs(parseFloat(value)) / 1e8,
                    fee: Math.abs(parseFloat(data.transaction.fee)) / 1e8,
                    confirmations: tx.context.state - data.transaction.block_id + 1,
                    timestamp: data.transaction.time,
                    type
                }
            })
    }

    async getTransactionsInfo(txsId = []) {
        // console.log("-->" + `${this.explorer}/dashboards/transactions/${txsId}` )
        return axios.get(`${this.explorer}/dashboards/transactions/${txsId.join(',')}`)
            .then(result => result.data)
            .then(async result => {
                if (!result) return []

                let txs = []

                await Promise.all(txsId.map(async (txId) => {
                    const data = result.data[txId]
                    const inputValue = data.transaction.input_total
                    const outputValue = data.transaction.output_total
                    const value = outputValue > 0 ? outputValue : inputValue

                    txs.push({
                        hash: data.transaction.hash,
                        from: data.inputs.map(input => input.recipient),
                        to: data.outputs.map(output => output.recipient),
                        value: Math.abs(parseFloat(value)) / 1e8,
                        fee: Math.abs(parseFloat(data.transaction.fee)) / 1e8,
                        confirmations: result.context.state - data.transaction.block_id + 1,
                        timestamp: data.transaction.time,
                        type: outputValue > 0 ? 'deposit' : 'withdrawal'
                    })
                }))

                return txs
            })
    }

    async getTransactionsOf(address) {
        // console.log("-->" + `${this.explorer}/dashboards/address/${address}?limit=100,100&?offset=0,1000000&transaction_details=true` )
        return await axios.get(`${this.explorer}/dashboards/address/${address}?limit=100,100&?offset=0,1000000&transaction_details=true`)
            .then(result => result.data)
            .then(result => result.data[address] ? result.data[address].transactions : [])
            .then(async result => !result || !Array.isArray(result) ? [] : await Promise.all(result.map(async tx => {
                const txInfo = await this.getTransactionInfo(tx.hash, address)

                return {
                    hash: tx.hash,
                    from: txInfo.from,
                    to: txInfo.to,
                    value: txInfo.value,
                    fee: txInfo.fee,
                    confirmations: txInfo.confirmations,
                    timestamp: tx.time,
                    type: txInfo.type
                }
            }))).catch((error) => {
                if (error.response) {
                    console.log('BTC - Request made and server responded:')
                    //console.log(error.response)
                } else if (error.request) {
                    console.log('BTC - The request was made but no response was received:')
                    //console.log(error.request)
                } else {
                    console.log('BTC - Something happened in setting up the request that triggered an Error:')
                    //console.log('Error', error.message)
                }
            })
    }

    async getBlockByHeight(height) {
        // console.log("-->" + `${this.explorer}/dashboards/block/${height}?limit=10000&offset=0` )
        return await axios.get(`${this.explorer}/dashboards/block/${height}?limit=10000&offset=0`)
            .then(result => result.data)
            .then(result => result.data[height] ? result.data[height].transactions : [])
            .then(async result => {
                if (!result) return []

                const size = 10
                let txsIdsArray = []
                for (let i = 0; i < result.length; i += size) {
                    txsIdsArray.push(result.slice(i, i + size))
                }

                let txs = []

                await Promise.all(txsIdsArray.map(async (txsId) => {
                    const data = await this.getTransactionsInfo(txsId)

                    txs = txs.concat(data)
                }))

                return txs
            })
    }

    async sendTransaction(wallet, to, amount) {
        // console.log("-->" + `${this.unspent}/addrs/${wallet.address}` )
        let res = await axios.get(`${this.unspent}/addrs/${wallet.address}`)
            .then(result => ({
                unspent_outputs: result.data ? result.data.txrefs.filter( txref => txref.tx_input_n === -1 ) : [],
                address: wallet.address
            })).catch(error => null)

        let utxos = res.unspent_outputs.map(data => ({
            ...data,
            address: res.address
        })).map(data => ({
            txId: data.tx_hash,
            address: data.address,
            vout: data.tx_output_n,
            value: data.value
        }))

        if( utxos.length === 0 ) throw new Error( "Insufficient funds." + wallet.id + " - " + wallet.address + ".")

        const commission = Math.floor(this.fee / 2.0)
        const total = Math.round(await this.getBalance(wallet.address) * 1e8)
        const sent = Math.round(parseFloat(amount) * 1e8 - this.fee - commission)
        const change = Math.round(total - (sent + this.fee + commission))

        if (sent < this.minimum) throw new Error("The minimum amount to sent is " + (this.minimum / 1e8) + ".")
        if (change < 0) throw new Error("Insufficient funds (change)." + wallet.id + " - " + wallet.address + ".")

        let { inputs } = coinselect( utxos, [
            { address: to, value: sent},
            { address: this.master, value: commission },
            { address: wallet.address, value: change }
        ], 40 )

        if ( !Array.isArray( inputs ) ) inputs = utxos

        let tx = new TransactionBuilder(this.network === 'bitcoin' ? networks.bitcoin : networks.testnet)
        inputs.forEach( input => tx.addInput( input.txId, input.vout ) )
        tx.addOutput(to, sent)
        tx.addOutput(this.master, commission)
        if (change > 0) {
            tx.addOutput(wallet.address, change)
        }

        inputs.forEach( ( input, index ) => {
            const keyPair = ECPair.fromWIF(wallet.privateKey, this.network === 'bitcoin' ? networks.bitcoin : networks.testnet)
            tx.sign(index, keyPair)
        } )

        const rawHex = tx.build().toHex()
        return this.broadcastTransaction(rawHex)
    }

    async broadcastTransaction(rawHex) {
        return axios.post(this.broadcast, querystring.stringify({data:rawHex}), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(result => {
            const data = result.data
            if (data.context.error) throw new Error(data.context.error)

            return {
                hash: data.data.transaction_hash,
                fee: this.fee / 1e18
            }
        }).catch(error => {
            throw new Error(error)
        })
    }
}