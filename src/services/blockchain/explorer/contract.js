import axios from "axios"
import ethers from "ethers"
import erc20Abi from "../../../abi/ERC20.json";
import xoyTransaction from "../../../abi/XoyTransaction.json"
import {reduce, getEthGasContract, getEthGas} from "../../../util/ethereum.js"

export default class ContractExplorer {
    constructor(config) {
        this.config = config
        this.explorer = config.explorer
        this.rpc = config.rpc
        this.gasLimit = config.gasLimit
        this.gasLimitTxContract = config.gasLimitTxContract
        this.master = config.master
        this.minimum = config.minimum
        this.token = config.token
    }

    async createContract(wallet) {
        const provider = new ethers.providers.JsonRpcProvider(this.rpc)
        const ethWallet = new ethers.Wallet(wallet.privateKey, provider)
        const factory = new ethers.ContractFactory(xoyTransaction.abi, xoyTransaction.bytecode, ethWallet)
        // const deploymentData = factory.getDeployTransaction([])
        // const estimatedGas = await provider.estimateGas(deploymentData)
        const gasPrice = await getEthGasContract()
        // const fee = parseFloat(gasPrice.wei) * parseInt(estimatedGas.toString())

        const contract = await factory.deploy({
            // gasLimit: estimatedGas,
            // gasPrice: ethers.BigNumber.from(gasPrice.wei)
        })

        const fee = parseFloat(contract.deployTransaction.gasLimit.toString()) * parseFloat(gasPrice.wei)

        // await contract.deployed()

        return {
            address: contract.address,
            hash: contract.deployTransaction.hash,
            fee: fee / 1e18,
        }
    }

    async getBalance(wallet) {
        const ethWallet = new ethers.Wallet(wallet.privateKey, new ethers.providers.JsonRpcProvider(this.rpc))
        const transactionContract = new ethers.Contract(wallet.address, xoyTransaction.abi, ethWallet)
        const balance = await transactionContract.contractBalance(this.token)

        return parseFloat(balance)
    }

    async verifyMessage(amount, signature) {
        return ethers.utils.verifyMessage(amount.toString(), signature)
    }

    async getEvent(wallet, contract, address, hash) {
        const ethWallet = new ethers.Wallet(wallet.privateKey, new ethers.providers.JsonRpcProvider(this.rpc))
        const tokenContract = new ethers.Contract(this.token, erc20Abi, ethWallet)
        const eventFilter = tokenContract.filters.Transfer(address, contract)
        const events = await tokenContract.queryFilter(eventFilter).then(events => {
            return events
                .filter(event => event.transactionHash === hash)
                .map(event => ({
                    transactionHash: event.transactionHash,
                    event: event.event,
                    from: event.args[0],
                    to: event.args[1],
                    value: reduce(event.args[2], 8)
                }))
        }).catch(error => {
            return []
        })

        return events.length === 1 ? events[0] : null
    }

    async getTransactionsOf(address) {
        // console.log("-->" + `${this.explorer}?module=account&action=tokentx&contractaddress=${this.token}&address=${address}&page=1&offset=100&sort=asc&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7` )
        return axios.get(`${this.explorer}?module=account&action=tokentx&contractaddress=${this.token}&address=${address}&page=1&offset=100&sort=asc&apikey=EYJEJPR2Y1IKJTWWU4EIMC57IDEDTT21Q7`)
            .then(result => result.data)
            .then(result => result.result && Array.isArray(result.result) ? result.result : [])
            .then(result => result.map(t => ({
                hash: t.hash,
                from: t.from,
                to: t.to,
                value: parseFloat(t.value) / 1e8,
                fee: parseFloat(t.gasUsed) / 1e18,
                confirmations: typeof t.confirmations === 'string' ? parseInt(t.confirmations) : t.confirmations,
                timestamp: typeof t.timeStamp === 'string' ? parseInt(t.timeStamp) : t.timeStamp,
                type: t.to.toLowerCase() === address.toLowerCase() ? 'deposit' : 'withdrawal'
            }))).catch((error) => {
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

    async sendTransaction(wallet, contract, to, amount, memo) {
        const ethWallet = new ethers.Wallet(wallet.privateKey, new ethers.providers.JsonRpcProvider(this.rpc))
        const transactionContract = new ethers.Contract(contract, xoyTransaction.abi, ethWallet)

        const gasPrice = await getEthGas()
        const fee = parseFloat(gasPrice.wei) * parseInt(this.gasLimit)
        const feeTxContract = parseFloat(gasPrice.wei) * parseInt(this.gasLimitTxContract)
        const totalFee = fee + feeTxContract
        const commission = Math.floor(fee / 2)

        const sent = Math.round(parseFloat(amount) * 1e8)
        if (sent < parseInt(this.minimum)) throw new Error("The minimum amount to sent is " + (parseFloat(this.minimum) / 1e8) + " (" + sent / 1e8 + ").")

        const ethBalance = parseFloat((await ethWallet.getBalance('latest')).toString())
        if (totalFee + commission > ethBalance) throw new Error("Insufficient funds (ETH)." + wallet.id + " - " + wallet.address + ".")

        const contractBalance = parseFloat((await transactionContract.contractBalance(this.token)).toString())
        if (sent > contractBalance) throw new Error("Insufficient funds (Contract)." + wallet.id + " - " + wallet.address + ".")

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

        const receipt2 = await ethWallet.sendTransaction(txc)

        const tx = await transactionContract.withdrawalToken(this.token, to, sent, memo, {
            value: 0,
            gasLimit: ethers.BigNumber.from(this.gasLimitTxContract),
            gasPrice: ethers.BigNumber.from(gasPrice.wei),
            type: 0
        })

        return {
            hash: tx.hash,
            fee: fee / 1e18,
            ethHash: receipt2.hash,
            ethTo: this.master,
            ethAmount: commission / 1e18,
        }
    }
}