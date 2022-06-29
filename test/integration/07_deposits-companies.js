import ChaiHttp from 'chai-http'
import chai from "chai"
import {arrayResponse, objectResponse} from "./responses.js"
import Data from "../data/access.json"
import WalletsCompanies from "../data/wallets-companies.json"

chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Deposits companies", () => {
    let token = ""
    const hash = "hash-1"

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

    it("Get deposit by hash", (done) => {
        chai.request(url)
            .get('/deposits_companies/hash/' + hash)
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get deposits by wallet", (done) => {
        chai.request(url)
            .get('/deposits_companies/wallet/' + WalletsCompanies[0].id)
            .set('Authorization', token)
            .end(async (err, res) => {
                await arrayResponse(err, res)
                done()
            })
    })
})
