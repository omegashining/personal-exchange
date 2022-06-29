import {TransactionBuilder, ECPair} from "bitcoinjs-lib"
import {accountFromSeed} from "../../../util/hdwalllet.js"
import axios from "axios"
import querystring from "querystring"
import coinselect from "coinselect"

export default class TetherExplorer {
    constructor(config) {
        this.config = config
        this.explorer = config.explorer
        this.broadcast = config.broadcast
        this.fee = config.fee
        this.master = config.master
        this.minimum = config.minimum
    }

    createWallet(seed, index) {
        const seedBytes = Buffer.from(seed, 'hex')
        const tether = accountFromSeed(seedBytes, index, 'bitcoin')

        return {
            address: tether[1],
            privateKey: tether[2],
            publicKey: tether[3].toString('hex')
        }
    }

    async getBalance(address) {
        // console.log("-->" + `${this.explorer}/address/${address}` )
        return axios.post(`${this.explorer}/address/addr`, `addr=${address}`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(result => {
            const data = result.data
            if (!data.balance) {
                return 0
            }

            const t = data.balance.find(d => d.symbol === 'SP31')
            return parseFloat(t.value) / 1e8
        }).catch(error => {
            throw new Error(error)
        })
    }

    async getTransactionInfo(txId) {
        // console.log("-->" + `${this.explorer}/transaction/tx/${txId}` )
        return axios.get(`${this.explorer}/transaction/tx/${txId}`)
            .then(result => result.data)
            .then(tx => {
                return {
                    hash: tx.txid,
                    from: tx.sendingaddress,
                    to: tx.referenceaddress,
                    value: parseFloat(tx.amount),
                    fee: parseFloat(tx.fee),
                    confirmations: tx.confirmations,
                    timestamp: tx.blocktime,
                    type: tx.type
                }
            })
    }

    async getTransactionsOf(address) {
        // console.log("-->" + `${this.explorer}/transaction/address`, `addr=${address}` )
        return axios.post(`${this.explorer}/transaction/address`, `addr=${address}`, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then(result => result.data)
            .then(result => result ? result.transactions : [])
            .then(async result => {
                if (!result) return []

                let txs = []
                for (const tx of result) {
                    txs.push({
                        hash: tx.txid,
                        from: tx.sendingaddress,
                        to: tx.referenceaddress,
                        value: parseFloat(tx.amount),
                        fee: parseFloat(tx.fee),
                        confirmations: tx.confirmations,
                        timestamp: tx.blocktime,
                        type: tx.type === 'Simple Send' ? 'deposit' : 'withdrawal'
                    })
                }

                return txs
            }).catch((error) => {
                if (error.response) {
                    console.log('USDT - Request made and server responded:')
                    //console.log(error.response)
                } else if (error.request) {
                    console.log('USDT - The request was made but no response was received:')
                    //console.log(error.request)
                } else {
                    console.log('USDT - Something happened in setting up the request that triggered an Error:')
                    //console.log('Error', error.message)
                }
            })
    }

    async sendTransaction(wallet, to, amount) {
        let res = await axios.get(`${this.explorer}/address/${wallet.address}/unspent`)
            .then(result => ({
                unspent_outputs: result.data ? result.data.data.list : [],
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

        if( utxos.length === 0 ) throw new Error( "Insufficient funds." );

        const commission = Math.floor(this.fee / 2.0)
        const total = Math.round(await this.getBalance(wallet.address) * 1e8)
        const sent = Math.round(parseFloat(amount) * 1e8 - this.fee - commission)
        const change = Math.round(total - (sent + this.fee + commission))

        if (sent < this.minimum) throw new Error("The minimum amount to sent is " + this.minimum + ".")
        if (change < 0) throw new Error("Insufficient funds (change).")

        let { inputs } = coinselect( utxos, [
            { address: to, value: sent},
            { address: this.master, value: commission },
            { address: wallet.address, value: change }
        ], 40 )

        if ( !Array.isArray( inputs ) ) inputs = utxos

        let tx = new TransactionBuilder()
        inputs.forEach( input => tx.addInput( input.txId, input.vout ) )
        tx.addOutput(to, sent)
        tx.addOutput(this.master, commission)
        if (change > 0) {
            tx.addOutput(wallet.address, change)
        }

        inputs.forEach( ( input, index ) => {
            if (wallet.address === input.address) {
                const keyPair = ECPair.fromPrivateKey(wallet.privateKey.substr(2))
                tx.sign(index, keyPair)
            }
        } )

        const rawHex = tx.build().toHex()
        return this.broadcastTransaction(rawHex)
    }

    async broadcastTransaction(rawHex) {
        return axios.post(this.broadcast, querystring.stringify({rawHex}), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(result => {
            const data = result.data
            if (data.err_msg) throw new Error(data.err_msg)

            return {
                hash: data.data,
                fee: this.fee
            }
        }).catch(error => {
            throw new Error(error)
        })
    }
}