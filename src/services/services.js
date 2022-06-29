import Dao from "../model/dao/dao.js"
import SessionsService from "./redis/sessions.js"
import AccessService from "./access.js"
import AccessTokenService from "./access-tokens.js"
import AccessTokenScopeActionService from "./access-tokens-scopes-actions.js"
import CompanyService from "./companies.js"
import DepositCompanyService from "./deposits-companies.js"
import DepositUserService from "./deposits-users.js"
import EventService from "./events.js"
import LevelService from "./levels.js"
import LimitService from "./limits.js"
import ScopeService from "./scopes.js"
import ScopeActionService from "./scopes-actions.js"
import TradeUserService from "./trades-users.js"
import UserService from "./users.js"
import WalletTypeService from "./wallets-types.js"
import WalletCompanyService from "./wallets-companies.js"
import WalletUserService from "./wallets-users.js"
import WebhookService from "./webhook.js"
import WebhookEventService from "./webhooks-events.js"
import WithdrawalCompanyService from "./withdrawals-companies.js"
import WithdrawalUserService from "./withdrawals-users.js"
import BlockchainService from "./blockchain.js"

const dao = new Dao()

export default {
    sessions: new SessionsService(),
    access: new AccessService(dao),
    accessToken: new AccessTokenService(dao),
    accessTokenScopeAction: new AccessTokenScopeActionService(dao),
    company: new CompanyService(dao),
    depositCompany: new DepositCompanyService(dao, new WebhookService(dao)),
    depositUser: new DepositUserService(dao, new WebhookService(dao)),
    event: new EventService(dao),
    level: new LevelService(dao),
    limit: new LimitService(dao),
    scope: new ScopeService(dao),
    scopeAction: new ScopeActionService(dao),
    tradeUser: new TradeUserService(dao),
    user: new UserService(dao),
    walletCompany: new WalletCompanyService(dao),
    walletType: new WalletTypeService(dao),
    walletUser: new WalletUserService(dao),
    webhook: new WebhookService(dao),
    webhookEvent: new WebhookEventService(dao),
    withdrawalCompany: new WithdrawalCompanyService(dao, new WebhookService(dao)),
    withdrawalUser: new WithdrawalUserService(dao, new WebhookService(dao)),
    blockchain: new BlockchainService(),
}