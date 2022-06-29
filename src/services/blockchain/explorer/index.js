import BitcoinExplorer from "./bitcoin.js"
import EthereumExplorer from "./ethereum.js"
import TetherExplorer from "./tether.js"
import Erc20Explorer from "./erc20.js"

import config from "../../../config.js"
import ContractExplorer from "./contract.js";

export default {
    BTC: new BitcoinExplorer(config.blockchains.btc),
    ETH: new EthereumExplorer(config.blockchains.eth),
    USDT: new TetherExplorer(config.blockchains.usdt),
    //XOY: new Erc20Explorer(config.blockchains.xoy),
    XOY: new ContractExplorer(config.blockchains.xoy)
}