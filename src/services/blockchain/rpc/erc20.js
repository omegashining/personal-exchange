import ethers, {BigNumber} from "ethers"
import erc20Abi from "../../../abi/ERC20.json"

export default class Erc20Rpc {
    constructor( config ) {
        this.acronym = 'ETH'
        this.token = config.token
        this.provider = new ethers.providers.JsonRpcProvider(`http://${config.host}:${config.port}`, config.network)
        this.etherscanProvider = new ethers.providers.EtherscanProvider(config.network)
        this.contract = new ethers.Contract(config.token, erc20Abi, this.provider)
        this.inter = new ethers.utils.Interface(erc20Abi)
    }

    async getBalance(address) {
        return await this.contract.balanceOf(address)
            .then((result) => {
                return result
            }, error => {
                return error
            }).catch(error => {
                throw new Error(`getBalance - ${error.message}`)
            })
    }

    async getTransactionInfo(txId) {
        return await this.provider.getTransaction(txId)
            .then((result) => {
                if (this.token.toLowerCase() === result.to.toLowerCase()) {
                    const decodedInput = this.inter.parseTransaction({ data: result.data })

                    return {
                        hash: result.hash,
                        from: result.from,
                        to: decodedInput.args[0],
                        value: ethers.utils.formatUnits(decodedInput.args[1], 8),
                        fee: ethers.utils.formatEther(result.gasLimit),
                        confirmations: result.confirmations,
                        timestamp: 0,
                        type: ''
                    }
                } else {
                    throw new Error(`Transacción ERC20 no válida.`)
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
                    .filter(tx => (tx.to && this.token.toLowerCase() === tx.to.toLowerCase()))
                    .reduce((result, tx) => {
                        const decodedInput = this.inter.parseTransaction({ data: tx.data })

                        if (decodedInput.name === 'transfer') {
                            result.push({
                                hash: tx.hash,
                                from: tx.from,
                                to: decodedInput.args[0],
                                value: ethers.utils.formatUnits(decodedInput.args[1], 8),
                                fee: ethers.utils.formatEther(tx.gasLimit),
                                confirmations: tx.confirmations,
                                timestamp: tx.timestamp,
                                type: decodedInput.args[0].toLowerCase() === address.toLowerCase() ? 'deposit' : 'withdrawal'
                            })
                        }

                        return result
                    }, [])
                return txs
            }, error => {
                return error
            }).catch(error => {
                throw new Error(`getBalance - ${error.message}`)
            })
    }

    async getBlockByHeight(height) {
        return await this.provider.getBlock(parseInt(height))
            .then((result) => {
                return result
            }, error => {
                return error
            }).catch(error => {
                throw new Error(`getBlockByHeight - ${error.message}`)
            })
    }
}