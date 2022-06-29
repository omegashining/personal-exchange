import ChaiHttp from 'chai-http'
import chai from "chai"
import {arrayResponse, objectResponse} from "./responses.js"
import Data from "../data/access.json";
import WalletsUsers from "../data/wallets-users.json"

chai.use(ChaiHttp)
const url = "http://localhost:8080"

describe("Withdrawals users", () => {
    let token = ""
    const hash = "hash-1"
    const walletId = "1c25613e-5cdb-4e92-9a13-e94864638066"

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
            .get('/withdrawals_users/hash/' + hash)
            .set('Authorization', token)
            .end(async (err, res) => {
                await objectResponse(err, res)
                done()
            })
    })

    it("Get withdrawals by wallet", (done) => {
        chai.request(url)
            .get('/withdrawals_users/wallet/' + WalletsUsers[0].id)
            .set('Authorization', token)
            .end(async (err, res) => {
                await arrayResponse(err, res)
                done()
            })
    })
})
