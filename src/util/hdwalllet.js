import bip39 from "bip39"
import HDKey from "hdkey"
import coininfo from "coininfo"
import CoinKey from "coinkey"
import * as ethUtil from "ethereumjs-util"

export const generateMnemonic = () => {
    return bip39.generateMnemonic(256)
}

export const generateSeed = (words) => {
    return bip39.mnemonicToSeedSync(words)
}

export const generateGenesis = () => {
    const words = generateMnemonic()
    const seed = generateSeed(words)
    return [words, seed]
}

export const rootKeyFromSeed = (seed, network) => {
    if (network === 'bitcoin' || network === 'ethereum') {
        return HDKey.fromMasterSeed(seed)
    } else if (network === 'bitcoin-testnet') {
        let testnet = coininfo.bitcoin.test.versions.bip32
        return HDKey.fromMasterSeed(seed, testnet)
    } else {
        throw `Wrong Network : network ${network} not supported.`
    }
}

export const coinData = (coinKey) => {
    return [coinKey.privateKey, coinKey.publicAddress, coinKey.privateWif, coinKey.publicKey]
}

export const bitcoinData = (key) => {
    const coinKey = CoinKey(key)
    return coinData(coinKey)
}

export const bitcoinDataTestnet = (key) => {
    const coinKey = CoinKey(key, coininfo('BTC-TEST'))
    return coinData(coinKey)
}

export const ethereumAccountToAddress = (p) => {
    const pubKey = ethUtil.privateToPublic(p)
    const address = ethUtil.publicToAddress(pubKey).toString('hex')
    return ethUtil.toChecksumAddress('0x' + address)
}

export const ethereumData = (key) => {
    return [key, ethereumAccountToAddress(key)]
}

export const accountFromPrivateKey = (key, network) => {
    if (network === 'bitcoin') {
        return bitcoinData(key)
    } else if (network === 'bitcoin-testnet') {
        return bitcoinDataTestnet(key)
    } else if (network === 'ethereum') {
        return ethereumData(key)
    }
}

export const accountFromRootKey = (rootKey, accountNumber, network) => {
    let networkNumber

    if (network === 'bitcoin') {
        networkNumber = 0
    } else if (network === 'bitcoin-testnet') {
        networkNumber = 1
    } else if (network === 'ethereum') {
        networkNumber = 60
    } else {
        throw `Wrong Network : network ${network} not supported.`
    }

    const net = networkNumber.toString()
    const index = accountNumber.toString()
    const path = `m/44'/${net}'/0'/0/${index}`
    const account = rootKey.derive(path)

    return accountFromPrivateKey(account.privateKey, network)
}

export const accountFromSeed = (seed, accountNumber, network) => {
    const rootKey = rootKeyFromSeed(seed, network)
    return accountFromRootKey(rootKey, accountNumber, network)
}

export const test = (logger) => {
    let genesis = generateGenesis()
    console.log(genesis[0])
    console.log(genesis[1])
    console.log(genesis[1].toString('hex'))
    console.log(Buffer.from(genesis[1].toString('hex'), 'hex'))

    let bitcoin = accountFromSeed(genesis[1], 0, 'bitcoin')
    console.log(`Bitcoin address: ${bitcoin[1]}`)
    console.log(`Bitcoin WIF / private_key: ${bitcoin[2]}`)
    console.log(`Bitcoin public_key: ${bitcoin[3].toString('hex')}`)

    let ethereum = accountFromSeed(genesis[1], 0, 'ethereum')
    console.log(`Ethereum private_key: ${ethereum[0].toString('hex')}`)
    console.log(`Ethereum address / public_key: ${ethereum[1]}`)

    logger.info(`Testing generation of HD wallets`, {
        response: {
            status: 200,
            executionTime: 0
        },
        request: ''
    })
}