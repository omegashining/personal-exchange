import ChaiHttp from 'chai-http'
import chai from "chai"
import {arrayResponse, objectResponse} from "./responses.js"
import Data from "../data/access.json"
import WalletsCompanies from "../data/wallets-companies.json"

chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Withdrawals companies", () => {
    let token = ""
    const hash = "hash-1"
    const walletId = "98ff7d34-8fb4-475b-a1fe-d7e9d5fb1fab"

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

    it("Get withdrawal by hash", (done) => {
        chai.request(url)
            .get('/withdrawals_companies/hash/' + hash)
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get withdrawals by wallet", (done) => {
        chai.request(url)
            .get('/withdrawals_companies/wallet/' + WalletsCompanies[0].id)
            .set('Authorization', token)
            .end(async (err, res) => {
                await arrayResponse(err, res)
                done()
            })
    })
})
