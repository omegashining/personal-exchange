import AccessEntity from "./access-entity.js"
import AccessTokenEntity from "./access-token-entity.js"
import AccessTokenScopeActionEntity from "./access-token-scope-action-entity.js"
import CompanyEntity from "./company-entity.js"
import DepositCompanyEntity from "./deposit-company-entity.js"
import DepositUserEntity from "./deposit-user-entity.js"
import EventEntity from "./event-entity.js"
import LevelEntity from "./level-entity.js"
import LimitEntity from "./limit-entity.js"
import ScopeActionEntity from "./scope-action-entity.js"
import ScopeEntity from "./scope-entity.js"
import TradeUserEntity from "./trade-user-entity.js"
import UserEntity from "./user-entity.js"
import WalletCompanyEntity from "./wallet-company-entity.js"
import WalletUserEntity from "./wallet-user-entity.js"
import WalletTypeEntity from "./wallet-type-entity.js"
import WebhookEntity from "./webhook-entity.js"
import WebhookEventsEntity from "./webhook-events-entity.js"
import WithdrawalCompanyEntity from "./withdrawal-company-entity.js"
import WithdrawalUserEntity from "./withdrawal-user-entity.js"

export default {
    Access: AccessEntity,
    AccessToken: AccessTokenEntity,
    AccessTokenScopeAction: AccessTokenScopeActionEntity,
    Company: CompanyEntity,
    DepositCompany: DepositCompanyEntity,
    DepositUser: DepositUserEntity,
    Event: EventEntity,
    Level: LevelEntity,
    Limit: LimitEntity,
    ScopeAction: ScopeActionEntity,
    Scope: ScopeEntity,
    TradeUser: TradeUserEntity,
    User: UserEntity,
    WalletCompany: WalletCompanyEntity,
    WalletType: WalletTypeEntity,
    WalletUser: WalletUserEntity,
    Webhook: WebhookEntity,
    WebhookEvents: WebhookEventsEntity,
    WithdrawalCompany: WithdrawalCompanyEntity,
    WithdrawalUser: WithdrawalUserEntity
}