import ChaiHttp from 'chai-http'
import chai from "chai"
import {arrayResponse, objectResponse} from "./responses.js"
import Data from "../data/access.json"
import Users from "../data/users.json"

const expect = chai.expect
chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Wallets users", () => {
    let token = ""
    let address = ""
    const currency = "BTC"

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
            .post('/wallets_users/')
            .set('Authorization', token)
            .send({
                userId: Users[0].userId,
                currency
            })
            .end(async (err, res) => {
                await objectResponse(err, res)
                address = res.body.address
                done()
            })
    })

    it("Get wallets by user", (done) => {
        chai.request(url)
            .get('/wallets_users/user/' + Users[0].userId)
            .set('Authorization', token)
            .end(async (err, res) => {
                await arrayResponse(err, res)
                done()
            })
    })

    it("Get wallets by company", (done) => {
        chai.request(url)
            .get('/wallets_users/company/' + Users[0].companyId)
            .set('Authorization', token)
            .end(async (err, res) => {
                await arrayResponse(err, res)
                done()
            })
    })

    it("Get wallets by company and currency", (done) => {
        chai.request(url)
            .get('/wallets_users/company/' + Users[0].companyId + '/currency/' + currency)
            .set('Authorization', token)
            .end(async (err, res) => {
                await arrayResponse(err, res)
                done()
            })
    })

    it("Get wallet by user and currency", (done) => {
        chai.request(url)
            .get('/wallets_users/user/' + Users[0].userId + '/currency/' + currency)
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get wallet by address and currency", (done) => {
        chai.request(url)
            .get('/wallets_users/address/' + address + '/currency/' + currency)
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get balances by company", (done) => {
        chai.request(url)
            .get('/wallets_users/balance/company/' + Users[0].companyId)
            .set('Authorization', token)
            .end((err, res) => {
                if (err) {
                    console.log("Error: " + err)
                    throw err
                }

                console.log("Res: " + JSON.stringify(res.body))

                expect(res).to.have.status(200)
                expect(res.body).to.not.equals(null)
                done()
            })
    })

    it("Get balance by company and currency", (done) => {
        chai.request(url)
            .get('/wallets_users/balance/company/' + Users[0].companyId + '/currency/' + currency)
            .set('Authorization', token)
            .end((err, res) => {
                if (err) {
                    console.log("Error: " + err)
                    throw err
                }

                console.log("Res: " + JSON.stringify(res.body))

                expect(res).to.have.status(200)
                expect(res.body.balance).to.not.equals(null)
                done()
            })
    })
})