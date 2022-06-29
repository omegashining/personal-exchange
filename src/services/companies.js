import Company from "../model/company-entity.js"

export default class CompanyService {
    constructor(dao) {
        this.dao = dao
    }

    async create(object) {
        if (!object.xoyContract) {
            object.xoyContract = ''
        }

        return await this.dao.insert(Company.model, object)
    }

    async getById(id) {
        return await this.dao.selectById(Company.model, id)
    }

    async getAll() {
        return await this.dao.select(Company.model)
    }

    async update(object) {
        let company = await this.dao.selectById(Company.model, object.id)

        if (company) {
            if (!company.seed) {
                company.seed = object.seed
            }
            if (!company.mnemonic) {
                company.mnemonic = object.mnemonic
            }

            company.name = object.name
            company.planType = object.planType
            company.updatedAt = new Date()

            return await company.save()
        } else {
            return false
        }
    }

    async updateContract(id, xoyContract) {
        let company = await this.dao.selectById(Company.model, id)

        if (company) {
            company.xoyContract = xoyContract
            company.updatedAt = new Date()

            return await company.save()
        } else {
            return false
        }
    }

    async activate(id) {
        let company = await this.dao.selectById(Company.model, id)

        if (company) {
            company.status = 'ACTIVE'
            company.updatedAt = new Date()

            const result = await company.save()

            return !!result
        } else {
            return false
        }
    }

    async inactivate(id) {
        let company = await this.dao.selectById(Company.model, id)

        if (company) {
            company.status = 'INACTIVE'
            company.updatedAt = new Date()

            const result = await company.save()

            return !!result
        } else {
            return false
        }
    }

    async lock(id) {
        let company = await this.dao.selectById(Company.model, id)

        if (company) {
            company.status = 'LOCKED'
            company.updatedAt = new Date()

            const result = await company.save()

            return !!result
        } else {
            return false
        }
    }

    count() {
        return this.dao.count(Company.model)
    }
}