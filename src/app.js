import express from 'express'
import passport from "passport"
import http from 'http'
import cors from 'cors'
import fs from "fs"
import https from "https"

import Logger from "./util/logger.js"
import SwaggerRouter from "./routes/swagger.js"
import AccessRouter from "./routes/access.js"
import BlockchainRouter from "./routes/blockchain.js"
import CompanyRouter from "./routes/companies.js"
import DepositCompanyRouter from "./routes/deposits-companies.js"
import DepositUserRouter from "./routes/deposits-users.js"
import EventRouter from "./routes/events.js"
import LevelRouter from "./routes/levels.js"
import LimitRouter from "./routes/limits.js"
import TradeUserRouter from "./routes/trades-users.js"
import UserRouter from "./routes/users.js"
import WalletCompanyRouter from "./routes/wallets-companies.js"
import WalletTypeRouter from "./routes/wallets-types.js"
import WalletUserRouter from "./routes/wallets-users.js"
import WebhookRouter from "./routes/webhook.js"
import WithdrawalCompanyRouter from "./routes/withdrawals-companies.js"
import WithdrawalUserRouter from "./routes/withdrawals-users.js"
import BearerPassport from "./passport/bearer.js"
import config from "./config.js"

console.log('Starting Xoycoin-Exchange Server')

const logger = new Logger()
const app = express()
const swaggerRouter = new SwaggerRouter()
const accessRouter = new AccessRouter(logger.instance(config.logger.elastic.indexes.access))
const blockchainRouter = new BlockchainRouter(logger.instance(config.logger.elastic.indexes.blockchain))
const companyRouter = new CompanyRouter(logger.instance(config.logger.elastic.indexes.company))
const depositCompanyRouter = new DepositCompanyRouter(logger.instance(config.logger.elastic.indexes.deposit_company))
const depositUserRouter = new DepositUserRouter(logger.instance(config.logger.elastic.indexes.deposit_user))
const eventRouter = new EventRouter(logger.instance(config.logger.elastic.indexes.event))
const levelRouter = new LevelRouter(logger.instance(config.logger.elastic.indexes.level))
const limitRouter = new LimitRouter(logger.instance(config.logger.elastic.indexes.limit))
const tradeUserRouter = new TradeUserRouter(logger.instance(config.logger.elastic.indexes.trade_user))
const userRouter = new UserRouter(logger.instance(config.logger.elastic.indexes.user))
const walletCompanyRouter = new WalletCompanyRouter(logger.instance(config.logger.elastic.indexes.wallet_company))
const walletTypeRouter = new WalletTypeRouter(logger.instance(config.logger.elastic.indexes.wallet_type))
const walletUserRouter = new WalletUserRouter(logger.instance(config.logger.elastic.indexes.wallet_user))
const webhookRouter = new WebhookRouter(logger.instance(config.logger.elastic.indexes.webhook))
const withdrawalCompanyRouter = new WithdrawalCompanyRouter(logger.instance(config.logger.elastic.indexes.withdrawal_company))
const withdrawalUserRouter = new WithdrawalUserRouter(logger.instance(config.logger.elastic.indexes.withdrawal_user))

passport.serializeUser(function (user, done) {
    done(null, user)
})
passport.deserializeUser(function (uid, done) {
    done(null, uid)
})

passport.use('bearer', new BearerPassport(config.passport.bearer).getPassport())

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(function (req, res, next) {
    res.setHeader('Strict-Transport-Security', 'max-age=15724800 includeSubDomains')
    next()
})

app.use(passport.initialize())
app.use(passport.session())

app.use('/swagger', swaggerRouter.getRouter())
app.use('/access', accessRouter.getRouter())
app.use('/blockchain', blockchainRouter.getRouter())
app.use('/companies', companyRouter.getRouter())
app.use('/deposits_companies', depositCompanyRouter.getRouter())
app.use('/deposits_users', depositUserRouter.getRouter())
app.use('/events', eventRouter.getRouter())
app.use('/levels', levelRouter.getRouter())
app.use('/limits', limitRouter.getRouter())
app.use('/trades_users', tradeUserRouter.getRouter())
app.use('/users', userRouter.getRouter())
app.use('/wallets_companies', walletCompanyRouter.getRouter())
app.use('/wallets_types', walletTypeRouter.getRouter())
app.use('/wallets_users', walletUserRouter.getRouter())
app.use('/webhooks', webhookRouter.getRouter())
app.use('/withdrawals_companies', withdrawalCompanyRouter.getRouter())
app.use('/withdrawals_users', withdrawalUserRouter.getRouter())

if (!config.server.ssl.enabled) {
    const server = http.createServer(app)

    server.listen(config.server.port, config.server.ip, function () {
        console.log('Xoycoin-Exchange Server v1.0 HTTP port', config.server.port)
    })
} else {
    const privateKey = fs.readFileSync(config.server.ssl.key, 'utf8')
    const certificate = fs.readFileSync(config.server.ssl.crt, 'utf8')
    const credentials = {key: privateKey, cert: certificate}
    const ssl = https.createServer(credentials, app)

    ssl.listen(config.server.port, config.server.ip, function () {
        console.log('Xoycoin-Exchange Server v1.0 HTTPS port', config.server.port)
    })
}