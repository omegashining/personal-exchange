import axios from "axios"
import ethers from "ethers"
import {getEthGas} from "../../../util/ethereum.js"
import {accountFromSeed} from "../../../util/hdwalllet.js"

export default class EthereumExplorer {
    constructor(config) {
        this.config = config
        this.explorer = config.explorer
        this.rpc = config.rpc
        this.gasLimit = config.gasLimit
        this.master = config.master
        this.minimum = config.minimum
    }

    createWallet(seed, index) {
        const seedBytes = Buffer.from(seed, 'hex')
        const ethereum = accountFromSeed(seedBytes, index, 'ethereum')

        return {
            address: ethereum[1],
            privateKey: ethereum[0].toString('hex'),
            publicKey: ethereum[1]
        }
    }

    async getBalance(address) {
        // console.log("-->" + `${this.explorer}?module=account&action=balance&address=${address}&tag=latest&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7` )
        return axios.get(`${this.explorer}?module=account&action=balance&address=${address}&tag=latest&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7`)
            .then(result => result.data)
            .then(data => data.result ? parseFloat(data.result) / 1e18 : 0)
    }

    async getTransactionInfo(txId) {
        // console.log("-->" + `${this.explorer}?module=proxy&action=eth_getTransactionByHash&txhash=${txId}&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7` )
        return axios.get(`${this.explorer}?module=proxy&action=eth_getTransactionByHash&txhash=${txId}&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7`)
            .then(result => result.data)
            .then(result => result.result ? result.result : {})
            .then(result => ({
                hash: result.hash,
                from: result.from,
                to: result.to,
                value: parseInt(result.value, 16) / 1e18,
                fee: parseInt(result.gas, 16) / 1e18,
                confirmations: parseInt(result.blockNumber, 16),
                timestamp: 0,
                type: ''
            }))
    }

    async getTransactionsInfo(txsId = []) {
        // console.log("-->" + `${txsId}` )
        let txs = []

        await Promise.all(txsId.map(async (txId) => {
            const txInfo = await this.getTransactionInfo(txId)

            txs.push(txInfo)
        }))

        return txs
    }

    async getTransactionsOf(address) {
        const url = `${this.explorer}?module=account&action=txlist&address=${address}&page=1&offset=100&sort=asc&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7`
        // console.log("-->" + url )
        return axios.get(url)
            .then(result => result.data)
            .then(result => result.result && Array.isArray(result.result) ? result.result : [])
            .then(async result => {
                if (!result) return []

                let txs = []
                for (const tx of result) {
                    txs.push({
                        hash: tx.hash,
                        from: tx.from,
                        to: tx.to,
                        value: parseFloat(tx.value) / 1e18,
                        fee: parseFloat(tx.gasUsed) / 1e18,
                        confirmations: typeof tx.confirmations === 'string' ? parseInt(tx.confirmations) : tx.confirmations,
                        timestamp: typeof tx.timeStamp === 'string' ? parseInt(tx.timeStamp) : tx.timeStamp,
                        type: tx.to.toLowerCase() === address.toLowerCase() ? 'deposit' : 'withdrawal'
                    })
                }

                return txs
            }).catch((error) => {
                if (error.response) {
                    console.log('ETH - Request made and server responded:')
                    console.log(error.response)
                } else if (error.request) {
                    console.log('ETH - The request was made but no response was received:')
                    console.log(error.request)
                } else {
                    console.log('ETH - Something happened in setting up the request that triggered an Error:')
                    console.log('Error', error.message)
                }
            })
    }

    async getBlockByHeight(height) {
        // console.log("-->" + `${this.explorer}?module=proxy&action=eth_getBlockByNumber&tag=0x${Number(height).toString(16)}&boolean=true&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7` )
        return await axios.get(`${this.explorer}?module=proxy&action=eth_getBlockByNumber&tag=${Number(height).toString(16)}&boolean=true&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7`)
            .then(result => result.data)
            .then(result => result.result ? result.result : [])
            .then(async result => {
                if (!result) return []

                let txs = []
                result.transactions.forEach(tx => {
                    txs.push({
                        hash: tx.hash,
                        from: tx.from,
                        to: tx.to,
                        value: parseInt(tx.value, 16) / 1e18,
                        fee: parseInt(tx.gas, 16) / 1e18,
                        confirmations: parseInt(height),
                        timestamp: typeof result.timestamp === 'string' ? parseInt(result.timestamp) : result.timestamp,
                        type: parseInt(tx.type, 16)
                    })
                })

                return txs
            })
    }

    async sendTransaction(wallet, to, amount) {
        const ethWallet = new ethers.Wallet(wallet.privateKey, new ethers.providers.JsonRpcProvider(this.rpc))

        const gasPrice = await getEthGas()
        const fee = parseFloat(gasPrice.wei) * parseInt(this.gasLimit)
        const totalFee = fee * 2
        const commission = Math.floor(fee / 2)
        const sent = Math.round(parseFloat(amount) * 1e18) - totalFee - commission

        if (sent < parseInt(this.minimum)) throw new Error("The minimum amount to sent is " + (parseFloat(this.minimum) / 1e18) + " (" + (sent / 1e18) + ").")

        const balance = parseFloat(await this.getBalance(wallet.address)) * 1e18
        const totalAmount = sent + totalFee + commission

        if (totalAmount > balance) throw new Error("Insufficient funds in wallet." + wallet.id + " - " + wallet.address + ".")

        const nonce = await ethWallet.getTransactionCount('pending')
        //const nonce2 = await ethWallet.getTransactionCount('latest')

        const tx = {
            to,
            data: '',
            nonce,
            value: ethers.BigNumber.from(sent.toString()),
            gasLimit: ethers.BigNumber.from(this.gasLimit),
            gasPrice: ethers.BigNumber.from(gasPrice.wei),
            chainId: await ethWallet.getChainId()
        }
        const txc = {
            to: this.master,
            data: '',
            nonce: nonce + 1,
            value: ethers.BigNumber.from(commission.toString()),
            gasLimit: ethers.BigNumber.from(this.gasLimit),
            gasPrice: ethers.BigNumber.from(gasPrice.wei),
            chainId: await ethWallet.getChainId()
        }

        const receipt = await ethWallet.sendTransaction(tx)
        await ethWallet.sendTransaction(txc)

        return {
            hash: receipt.hash,
            fee: fee / 1e18
        }
    }
}