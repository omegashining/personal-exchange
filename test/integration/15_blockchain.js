import ChaiHttp from 'chai-http'
import chai from "chai"
import {objectResponse} from "./responses.js"
import Data from "../data/access.json";

const expect = chai.expect
chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Blockchain", () => {
    let token = ""
    let address = ""
    let tx = ""

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
            .post('/blockchain/wallet')
            .set('Authorization', token)
            .send({
                seed: 'd8d78d809328769b97c76b9d77d491235241bd2f42ff76d12b9c8a32ba6314c27311a2f5178baa1beb7fee55d4af6ef782d88e74529b759fdc1add4dccdf0660',
                indexId: 12,
                currency: 'ETH'
            })
            .end((err, res) => {
                if (err) {
                    console.log("Error: " + err)
                    throw err
                }

                console.log("Res: " + JSON.stringify(res.body))

                expect(res).to.have.status(200)
                expect(res.body.address).to.not.equals(null)

                address = res.body.address
                done()
            })
    })

    it("Send transaction", (done) => {
        chai.request(url)
            .post('/blockchain/send/')
            .set('Authorization', token)
            .send({
                from: '0x75393d51027e34c2279eDB419754155719cA05e3',
                to: address,
                amount: 0.06,
                currency: 'ETH'
            })
            .end((err, res) => {
                if (err) {
                    console.log("Error: " + err)
                    throw err
                }

                console.log("Res: " + JSON.stringify(res.body))

                expect(res).to.have.status(200)
                expect(res.body.hash).to.not.equals(null)

                tx = res.body.hash
                done()
            })
    }).timeout(15000)

    it("Get balance by address and currency", (done) => {
        chai.request(url)
            .get('/blockchain/balance/address/' + address + '/currency/ETH')
            .set('Authorization', token)
            .end((err, res) => {
                if (err) {
                    console.log("Error: " + err)
                    throw err
                }

                console.log("Res: " + JSON.stringify(res.body))

                expect(res).to.have.status(200)
                expect(res.body.balance).to.be.greaterThanOrEqual(0)
                done()
            })
    })

    it("Get transaction by txId and currency", (done) => {
        chai.request(url)
            .get('/blockchain/transaction/' + tx + '/currency/ETH')
            .set('Authorization', token)
            .end((err, res) => {
                if (err) {
                    console.log("Error: " + err)
                    throw err
                }

                console.log("Res: " + JSON.stringify(res.body))

                expect(res).to.have.status(200)
                done()
            })
    })

    it("Get transactions by address and currency", (done) => {
        chai.request(url)
            .get('/blockchain/transactions/address/' + address + '/currency/ETH')
            .set('Authorization', token)
            .end((err, res) => {
                if (err) {
                    console.log("Error: " + err)
                    throw err
                }

                console.log("Res: " + JSON.stringify(res.body))

                expect(res).to.have.status(200)
                done()
            })
    })
})