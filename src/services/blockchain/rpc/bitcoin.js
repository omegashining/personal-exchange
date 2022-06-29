import RpcClient from "../../../util/bitcoind-rpc.js"

export default class BitcoinRpc {
    constructor( config) {
        this.acronym = 'BTC'

        this.rpc = new RpcClient({
            protocol: 'http',
            user: config.username,
            pass: config.password,
            host: config.host,
            port: config.port,
        })
    }

    async getTransactionInfo(txId) {
        return new Promise( ( resolve, reject ) => {
            this.rpc.getTransaction(txId, true, true, (error, data) => {
                if (error) {
                    reject( new Error(`getTransaction - ${error.message}`) )
                }

                const tx = data.result
                const inputValue = tx.decoded.vin.reduce((total, i) => {
                    return total + (i.value ? i.value : 0)
                }, 0)
                const outputValue = tx.decoded.vout.reduce((total, i) => {
                    return total + (i.value ? i.value : 0)
                }, 0)
                const value = outputValue > 0 ? outputValue : inputValue

                resolve({
                    hash: tx.txid,
                    from: tx.decoded.vin.map(i => (i.scriptPubKey ? i.scriptPubKey.addresses.join(",") : "")),
                    to: tx.decoded.vout.map(o => (o.scriptPubKey ? o.scriptPubKey.addresses.join(",") : "")),
                    value: Math.abs(parseFloat(value)) / 1e8,
                    fee: tx.fee ? Math.abs(parseFloat(tx.fee)) / 1e8 : 0,
                    confirmations: tx.confirmations,
                    timestamp: tx.time,
                    type: outputValue > 0 ? 'deposit' : 'withdrawal'
                })
            })
        } )
    }

    async getRawTransactionInfo(txId, hash) {
        return new Promise( ( resolve, reject ) => {
            this.rpc.getRawTransaction(txId, true, hash, (error, data) => {
                if (error) {
                    reject( new Error(`getRawTransaction - ${error.message}`) )
                }

                const tx = data.result
                const inputValue = tx.vin.reduce((total, i) => {
                    return total + (i.value ? i.value : 0)
                }, 0)
                const outputValue = tx.vout.reduce((total, i) => {
                    return total + (i.value ? i.value : 0)
                }, 0)
                const value = outputValue > 0 ? outputValue : inputValue

                resolve( {
                    hash: tx.txid,
                    from: tx.vin.map(i => (i.scriptPubKey ? i.scriptPubKey.addresses.join(",") : "")),
                    to: tx.vout.map(o => (o.scriptPubKey ? o.scriptPubKey.addresses.join(",") : "")),
                    value: Math.abs(parseFloat(value)) / 1e8,
                    fee: tx.fee ? Math.abs(parseFloat(tx.fee)) / 1e8 : 0,
                    confirmations: tx.confirmations,
                    timestamp: tx.time,
                    type: outputValue > 0 ? 'deposit' : 'withdrawal'
                } )
            })
        } )
    }

    async getTransactionsOf(address) {
        return new Promise( ( resolve, reject ) => {
            this.rpc.listReceivedByAddress(1, false, true, address, async (error, data) => {
                if (error) {
                    reject(new Error(`listReceivedByAddress - ${error.message}`))
                }

                const txs = await Promise.all(
                    data.result[0].txids.map(async txid => await this.getTransactionInfo(txid))
                )

                resolve(txs)
            })
        } )
    }

    async getBlockHashByHeight(height) {
        return new Promise( ( resolve, reject ) => {
            this.rpc.getBlockHash(height, (error, data) => {
                if (error) {
                    reject( new Error(`getBlockHashByHeight - ${error.message}`) )
                }

                resolve( { hash: data.result } )
            })
        } )
    }

    async getBlockByHash(hash) {
        return new Promise( ( resolve, reject ) => {
            this.rpc.getBlock(hash, 2, (error, data) => {
                if (error) {
                    reject( new Error(`getBlockByHash - ${error.message}`) )
                }

                resolve( data.result )
            })
        } )
    }

    async listUnspent(address) {
        return new Promise( ( resolve, reject ) => {
            this.rpc.listUnspent(1, 9999999, [address], (error, data) => {
                if (error) {
                    reject( new Error(`listUnspent - ${error.message}`) )
                }

                resolve( data.result )
            })
        } )
    }

    async importAddress(address) {
        return new Promise( ( resolve, reject ) => {
            this.rpc.importAddress(address, 'importAddress', true, (error, data) => {
                if (error) {
                    reject( new Error(`importAddress - ${error.message}`) )
                }

                resolve( data.result )
            })
        } )
    }
}