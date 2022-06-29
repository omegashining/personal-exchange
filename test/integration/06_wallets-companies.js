import ChaiHttp from 'chai-http'
import chai from "chai"
import {arrayResponse, objectResponse} from "./responses.js"
import Data from "../data/access.json"
import Companies from "../data/companies.json"

chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Wallets companies", () => {
    let token = ""
    let address = ""
    const currency = "ETH"

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

    it("Create wallet", (done) => {
        chai.request(url)
            .post('/wallets_companies/')
            .set('Authorization', token)
            .send({
                companyId: Companies[0].id,
                currency
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                address = res.body.address
                done()
            })
    })

    it("Get wallet by company and currency", (done) => {
        chai.request(url)
            .get('/wallets_companies/company/' + Companies[0].id + '/currency/' + currency)
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get wallet by address and currency", (done) => {
        chai.request(url)
            .get('/wallets_companies/address/' + address + '/currency/' + currency)
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get wallets by company", (done) => {
        chai.request(url)
            .get('/wallets_companies/company/' + Companies[0].id)
            .set('Authorization', token)
            .end(async (err, res) => {
                await arrayResponse(err, res)
                done()
            })
    })
})