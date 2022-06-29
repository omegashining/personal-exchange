import BitcoinRpc from "./bitcoin.js"
import EthereumRpc from "./ethereum.js"
import Erc20Rpc from "./erc20.js"

import config from "../../../config.js"

export default {
    BTC: new BitcoinRpc(config.blockchains.btc),
    ETH: new EthereumRpc(config.blockchains.eth),
    XOY: new Erc20Rpc(config.blockchains.xoy),
}