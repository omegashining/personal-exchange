import Units from 'ethereumjs-units'
import axios from "axios"
import ethers from "ethers"

export const getEthGas = async () => {
    const result = await axios('https://ethgasstation.info/api/ethgasAPI.json?api-key=98d9f52166be2b0ec537e1703e8bc6e0a2b923e0ea75d366393950b8d290')
    const gwei = (result.data.fastest / 10).toString()
    const wei = Units.convert(gwei, 'gwei', 'wei')

    return {
        gwei, wei
    }
}

export const getEthGasContract = async () => {
    const gwei = '10'
    const wei = Units.convert(gwei, 'gwei', 'wei')

    return {
        gwei, wei
    }
}

export const reduce = (n, decimals) => {
    return ethers.utils.formatUnits(n, decimals);
}

export const expand = (n, decimals) => {
    return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(decimals))
}