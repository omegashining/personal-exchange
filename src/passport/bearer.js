import Passport from "./passport.js"
import Bearer from "passport-http-bearer"
import Services from "../services/services.js"

export default class BearerPassport extends Passport {
    constructor(config) {
        super(config, Bearer.Strategy)
    }

    async callback(req, token, done) {
        try {
            const session = await Services.sessions.getSession(token)
            const access = await Services.access.getById(session.id)

            if (access) {
                return done(null, {
                    id: access.id,
                    name: access.name,
                    username: access.username,
                }, {
                    session,
                    token
                })
            } else {
                const accessToken = await Services.accessToken.getByToken(token)
                if (!accessToken) return done({status: 401, message: "Invalid token"})

                const company = await Services.company.getById(accessToken.companyId)
                if (!company) return done({status: 404, message: "Access not found"})

                let scopesAction = accessToken.scopesActions.find(sa => sa.endpoint.toLowerCase() === req.baseUrl.toLowerCase() && sa.method.toLowerCase() === req.method.toLowerCase() )
                if (!scopesAction) return done({status: 403, message: "Token without permissions"})

                return done(null, {
                    id: company.accessId
                }, {
                    token
                })
            }
        } catch (error) {
            return done({status: 500, message: "Internal Server Error"})
        }
    }
}