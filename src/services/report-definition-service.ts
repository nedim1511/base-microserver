import { ReportDefinitionDao } from "../dao/report-definition-dao";
import ReportDefinition from "../models/report-definition.model";

export default class ReportDefinitionService {
    private reportDefinitionDao: ReportDefinitionDao;

    constructor(reportDefinitionDao: any) {
        this.reportDefinitionDao = reportDefinitionDao;
    }

    async getReportDefinitions(params: any = {}) {
        return await this.reportDefinitionDao.find(ReportDefinition, params);
    }

    async getById(params: any = {}) {
        return await this.reportDefinitionDao.findOne(ReportDefinition, params);
    }

    async addReportDefinition(model: any) {
        console.log(model)
        return await this.reportDefinitionDao.create(model);
    }

    async editReportDefinition(model: any) {
        return await this.reportDefinitionDao.findOneAndUpdate(ReportDefinition, model);
    }
}
