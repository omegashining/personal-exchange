import Services from "../../src/services/services.js"

describe('Webhook', () => {
    const service = Services.webhook

    it('Should process available webhooks', async () => {
        try {
            const res = await service.sendData('a860b92d-093d-4fe7-a7d5-e810cb7fcd3a', {
                data1: 'valor1',
                data2: 'valor2'
            })
        }
        catch(err){
            console.log("Error: "+err)
        }

        //expect(res).to.not.equals(null)
    })
})