import WebhookEvent from "../model/webhook-events-entity.js"

export default class WebhookEventService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(WebhookEvent.model, object)
    }

    count() {
        return this.dao.count(WebhookEvent.model)
    }
}