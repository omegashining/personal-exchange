import axios from "axios"
import ethers from "ethers"
import erc20Abi from "../../../abi/ERC20.json"
import {accountFromSeed} from "../../../util/hdwalllet.js"
import {getEthGas} from "../../../util/ethereum.js"

export default class Erc20Explorer {
    constructor(config) {
        this.config = config
        this.explorer = config.explorer
        this.rpc = config.rpc
        this.gasLimit = config.gasLimit
        this.master = config.master
        this.minimum = config.minimum
        this.token = config.token
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
        // console.log("-->" + `${this.explorer}?module=account&action=tokenbalance&contractaddress=${this.token}&address=${address}&tag=latest&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7` )
        return axios.get(`${this.explorer}?module=account&action=tokenbalance&contractaddress=${this.token}&address=${address}&tag=latest&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7`)
            .then(result => result.data)
            .then(data => data.result ? parseFloat(data.result) / 1e8 : 0)
    }

    async getTransactionInfo(txId) {
        // console.log("-->" + `${this.explorer}?module=transaction&action=gettxreceiptstatus&txhash=${txId}&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7` )
        return axios.get(`${this.explorer}?module=transaction&action=gettxreceiptstatus&txhash=${txId}&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7`)
            .then(result => result.data)
    }

    async getTransactionsOf(address) {
        // console.log("-->" + `${this.explorer}?module=account&action=tokentx&contractaddress=${this.token}&address=${address}&page=1&offset=100&sort=asc&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7` )
        return axios.get(`${this.explorer}?module=account&action=tokentx&contractaddress=${this.token}&address=${address}&page=1&offset=100&sort=asc&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7`)
            .then(result => result.data)
            .then(result => result.result && Array.isArray(result.result) ? result.result : [])
            .then(async result => {
                if (!result) return []

                let txs = []
                for (const tx of result) {
                    txs.push({
                        hash: t.hash,
                        from: t.from,
                        to: t.to,
                        value: parseFloat(t.value) / 1e8,
                        fee: parseFloat(t.gasUsed) / 1e18,
                        confirmations: typeof t.confirmations === 'string' ? parseInt(t.confirmations) : t.confirmations,
                        timestamp: typeof t.timeStamp === 'string' ? parseInt(t.timeStamp) : t.timeStamp,
                        type: t.to.toLowerCase() === address.toLowerCase() ? 'deposit' : 'withdrawal'
                    })
                }

                return txs
            }).catch((error) => {
                if (error.response) {
                    console.log('Request made and server responded:')
                    console.log(error.response)
                } else if (error.request) {
                    console.log('The request was made but no response was received:')
                    console.log(error.request)
                } else {
                    console.log('Something happened in setting up the request that triggered an Error:')
                    console.log('Error', error.message)
                }
            })
    }

    async sendTransaction(wallet, to, amount) {
        const ethWallet = new ethers.Wallet(wallet.privateKey, new ethers.providers.JsonRpcProvider(this.rpc))
        const tokenContract = new ethers.Contract(this.token, erc20Abi, ethWallet)

        const gasPrice = await getEthGas()
        const fee = parseFloat(gasPrice.wei) * parseInt(this.gasLimit)
        const totalFee = fee * 2
        const commission = Math.floor(fee / 2)

        const sent = Math.round(parseFloat(amount) * 1e8)
        if (sent < parseInt(this.minimum)) throw new Error("The minimum amount to sent is " + (parseFloat(this.minimum) / 1e8) + " (" + sent / 1e8 + ").")

        const ethBalance = parseFloat((await ethWallet.getBalance('latest')).toString())
        if (totalFee + commission > ethBalance) throw new Error("Insufficient funds (ETH)." + wallet.id + " - " + wallet.address + ".")

        const tokenBalance = parseFloat((await tokenContract.balanceOf(wallet.address)).toString())
        if (sent > tokenBalance) throw new Error("Insufficient funds (Token)." + wallet.id + " - " + wallet.address + ".")

        const nonce = await ethWallet.getTransactionCount('pending')
        //const nonce2 = await ethWallet.getTransactionCount('latest')

        const txc = {
            to: this.master,
            data: '',
            nonce,
            value: ethers.BigNumber.from(commission.toString()),
            gasLimit: ethers.BigNumber.from(this.gasLimit),
            gasPrice: ethers.BigNumber.from(gasPrice.wei),
            chainId: await ethWallet.getChainId()
        }

        const receipt = await tokenContract.transfer(to, sent)
        const receipt2 = await ethWallet.sendTransaction(txc)

        return {
            hash: receipt.hash,
            fee: fee / 1e18,
            ethHash: receipt2.hash,
            ethTo: this.master,
            ethAmount: commission
        }
    }
}