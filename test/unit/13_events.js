import chai from 'chai'

import chaiAsPromised from "chai-as-promised"
import Services from "../../src/services/services.js"

const expect = chai.expect
chai.use(chaiAsPromised)
chai.should()

describe('Events', () => {
    const service = Services.event

    it('Should return all events', async () => {
        const res = await service.getAll()

        expect(res.length).to.not.equals(0)
    })
})
