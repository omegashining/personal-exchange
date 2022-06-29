import Entities from "../model/index.js"
import Axios from "axios"

export default class WebhookService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        return await this.dao.insert(Entities.Webhook.model, object)
    }

    async createWithEvents(object, events) {
        let webhook = await this.dao.insert(Entities.Webhook.model, object)

        if (events) {
            await this.addEvents(events)
        }

        return webhook
    }

    async addEvents(events) {
        let result
        let counter = 0

        if (events) {
            for (const event of events) {
                result = await this.dao.insert(Entities.WebhookEvents.model, event)

                if (result != null) {
                    counter++
                }
            }
        }

        return counter
    }

    async getById(id) {
        return await this.dao.selectById(Entities.Webhook.model, id)
    }

    async getByUrl(url) {
        return await this.dao.selectOne(Entities.Webhook.model, {url})
    }

    async getByAccess(accessId) {
        return await this.dao.select(Entities.Webhook.model, {accessId})
    }

    async getByType(type) {
        let elements = []
        let events = await this.dao.select(Entities.WebhookEvents.model, {event: type})

        if (events) {
            for (const event of events) {
                elements.push(await this.dao.selectById(Entities.Webhook.model, event.webhook))
            }
        }

        return elements
    }

    async activate(id) {
        let webhook = await this.dao.selectById(Entities.Webhook.model, id)

        if (webhook) {
            webhook.status = 'ACTIVE'
            webhook.updatedAt = new Date()

            const result = await webhook.save()

            return !!result
        } else {
            return false
        }
    }

    async inactivate(id) {
        let webhook = await this.dao.selectById(Entities.Webhook.model, id)

        if (webhook) {
            webhook.status = 'INACTIVE'
            webhook.updatedAt = new Date()

            const result = await webhook.save()

            return !!result
        } else {
            return false
        }
    }

    async sendData(type, data) {
        let elements = await this.getByType(type)

        if (elements && elements.length > 0) {
            elements.forEach((element) => {
                let headers = {}
                if (element.secret) {
                    headers = {
                        headers: {'Authorization': element.secret}
                    }
                }

                Axios.post(element.url, data, headers).then((res) => {
                    console.log("Webhook")
                    console.log("Status: " + res.status)
                    console.log("Data: " + res.data)
                }).catch((err) => {
                    console.log("Webhook Error" + err)
                    throw err
                })
            })
        }
    }
}