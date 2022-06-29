import Router from "./router.js"
import Services from "../services/services.js"
import Passport from "../passport/passport.js"

export default class EventRouter extends Router {
    init() {
        this.get('/', '1 minute', Passport.isTokenValid, this.getEvents)
    }

    async getEvents(req, res) {
        this.logger.debug("Get events.")

        const events = await Services.event.getAll()
        if (!events) throw new Error("Error: Cannot get events.")

        const result = events.map(event => ({
            id: event.id,
            description: event.description,
            status: event.status
        }))

        res.sendSuccess(result)
    }
}