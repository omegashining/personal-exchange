import ChaiHttp from 'chai-http'
import chai from "chai"
import {arrayResponse, objectResponse} from "./responses.js"
import Data from "../data/access.json"

chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Wallets types", () => {
    let token = ""

    it("Authenticate", (done) => {
        chai.request(url)
            .post('/access/')
            .send({
                email: Data[0].email,
                password: Data[0].password
            })
            .end(async (err, res) => {
                await objectResponse(err, res)

                if (res.body) {
                    token = "Bearer " + res.body.token
                }
                done()
            })
    })

    it("Get wallets types", (done) => {
        chai.request(url)
            .get('/wallets_types/')
            .set('Authorization', token)
            .end(async (err, res) => {
                await arrayResponse(err, res)
                done()
            })
    })
})