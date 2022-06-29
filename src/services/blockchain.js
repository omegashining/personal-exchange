import BlockchainExplorer from "./blockchain/explorer/index.js"
import BlockchainRpc from "./blockchain/rpc/index.js"

export default class BlockchainService {
    BITCOIN = 'BTC'
    ETHEREUM = 'ETH'
    TETHER = 'USDT'
    //XOYCOIN = 'XOY'
    XOYCOINCONTRACT = 'XOY'

    constructor() {
    }

    #getBlockchainExplorer(type) {
        switch (type) {
            case this.BITCOIN:
                return BlockchainExplorer.BTC
            case this.ETHEREUM:
                return BlockchainExplorer.ETH
            case this.TETHER:
                return BlockchainExplorer.USDT
            //case this.XOYCOIN:
            //    return BlockchainExplorer.XOY
            case this.XOYCOINCONTRACT:
                return BlockchainExplorer.XOY
            default:
                return undefined
        }
    }

    #getBlockchainRpc(type) {
        switch (type) {
            case this.BITCOIN:
                return BlockchainRpc.BTC
            case this.ETHEREUM:
                return BlockchainRpc.ETH
            //case this.XOYCOIN:
            //    return BlockchainRpc.XOY
            default:
                return undefined
        }
    }

    async createWallet(seed, indexId, walletType) {
        const service = this.#getBlockchainExplorer(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.createWallet(seed, indexId)
    }

    async createContract(wallet, walletType) {
        const service = this.#getBlockchainExplorer(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.createContract(wallet)
    }

    async getBalance(address, walletType) {
        const service = this.#getBlockchainExplorer(walletType)
        // const service = this.#getBlockchainRpc(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.getBalance(address)
    }

    async getTransactionInfo(txId, walletType) {
        const service = this.#getBlockchainExplorer(walletType)
        // const service = this.#getBlockchainRpc(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.getTransactionInfo(txId)
    }

    async getTransactionsInfo(txsId, walletType) {
        const service = this.#getBlockchainExplorer(walletType)
        // const service = this.#getBlockchainRpc(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.getTransactionsInfo(txsId.split(','))
    }

    async getRawTransactionInfo(txId, hash, walletType) {
        const service = this.#getBlockchainRpc(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.getRawTransactionInfo(txId, hash)
    }

    async getTransactionsOf(address, walletType) {
        const service = this.#getBlockchainExplorer(walletType)
        // const service = this.#getBlockchainRpc(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.getTransactionsOf(address)
    }

    async verifyMessage(amount, signature, walletType) {
        const service = this.#getBlockchainExplorer(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.verifyMessage(amount, signature)
    }

    async getEvent(wallet, contract, address, hash, walletType) {
        const service = this.#getBlockchainExplorer(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.getEvent(wallet, contract, address, hash)
    }

    async sendTransaction(wallet, toAddress, amount, walletType) {
        const service = this.#getBlockchainExplorer(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.sendTransaction(wallet, toAddress, amount)
    }

    async sendContractTransaction(wallet, contract, toAddress, amount, walletType, memo) {
        const service = this.#getBlockchainExplorer(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.sendTransaction(wallet, contract, toAddress, amount, memo)
    }

    async getBlockByHeight(height, walletType) {
        const service = this.#getBlockchainExplorer(walletType)
        // const service = this.#getBlockchainRpc(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }

        return service.getBlockByHeight(height)

        /*switch (walletType) {
            case this.BITCOIN:
                const result = await service.getBlockHashByHeight(height)
                return service.getBlockByHash(result.hash)
            case this.ETHEREUM:
            case this.XOYCOIN:
                return service.getBlockByHeight(height)
            default:
                return undefined
        }*/
    }

    async listUnspent(address, walletType) {
        const service = this.#getBlockchainRpc(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.listUnspent(address)
    }

    async importAddress(address, walletType) {
        const service = this.#getBlockchainRpc(walletType)

        if (!service) {
            throw Error("El blockchain de '" + walletType + "' no esta definido")
        }
        return service.importAddress(address)
    }
}