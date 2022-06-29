import passport from "passport"

export default class Passport {
    constructor(config, Strategy) {
        if (config.client) this.config = config['params']
        else this.config = config
        this.passport = new Strategy(config, (...params) => this.callback.apply(this, params))
    }

    getPassport() {
        return this.passport
    }

    static isTokenValid(req, res, next) {
        passport.authenticate('bearer', {session: false}, (error, user, extra) => {
            if (error) {
                return res.status(error.status).json({
                    success: false,
                    error: error.message
                })
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'No token provided'
                })
            }

            req.token = extra.token
            req.user = user
            req.session = extra.session
            next()
        })(req, res, next)
    }

    callback(...params) {
    }
}