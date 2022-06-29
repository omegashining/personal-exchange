export default class AbstractCron {
    constructor(logger) {
        this.logger = logger
    }

    async logError(error, name, object) {
        this.logger.error(name, {
            response: {
                status: 500,
                error: error + ''
            },
            request: JSON.stringify(object)
        })
    }
}