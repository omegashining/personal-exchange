import ethers, {BigNumber} from "ethers"

export default class EthereumRpc {
    constructor( config ) {
        this.acronym = 'ETH'
        this.provider = new ethers.providers.JsonRpcProvider(`http://${config.host}:${config.port}`, config.network)
        this.etherscanProvider = new ethers.providers.EtherscanProvider(config.network)
    }

    async getBalance(address) {
        return await this.provider.getBalance(address)
            .then((result) => {
                return ethers.utils.formatEther(result)
            }, error => {
                return error
            }).catch(error => {
                throw new Error(`getBalance - ${error.message}`)
            })
    }

    async getTransactionInfo(txId) {
        return await this.provider.getTransaction(txId)
            .then((result) => {
                return {
                    hash: result.hash,
                    from: result.from,
                    to: result.to,
                    value: ethers.utils.formatEther(result.value),
                    fee: ethers.utils.formatEther(result.gasLimit),
                    confirmations: result.confirmations,
                    timestamp: 0,
                    type: ''
                }
            }, error => {
                return error
            }).catch(error => {
                throw new Error(`getTransactionInfo - ${error.message}`)
            })
    }

    async getTransactionsOf(address) {
        return await this.etherscanProvider.getHistory(address)
            .then((result) => {
                let txs = result
                    .filter(tx => (tx.value.toString() !== '0'))
                    .map(tx => ({
                        hash: tx.hash,
                        from: tx.from,
                        to: tx.to,
                        value: ethers.utils.formatEther(tx.value),
                        fee: ethers.utils.formatEther(tx.gasLimit),
                        confirmations: tx.confirmations,
                        timestamp: tx.timestamp,
                        type: tx.to.toLowerCase() === address.toLowerCase() ? 'deposit' : 'withdrawal'
                    }))
                return result
            }, error => {
                return error
            }).catch(error => {
                throw new Error(`getTransactionsOf - ${error.message}`)
            })
    }

    async getBlockByHeight(height) {
        return await this.provider.getBlockWithTransactions(parseInt(height))
            .then((result) => {
                return result
            }, error => {
                return error
            }).catch(error => {
                throw new Error(`getBlockByHeight - ${error.message}`)
            })
    }
}