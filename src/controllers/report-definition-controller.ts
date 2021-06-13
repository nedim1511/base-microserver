import * as express from "express";
import responseHandler = require("../middleware/response-handle");
import ReportDefinitionService from "../services/report-definition-service";
import ReportDefinition from "../models/report-definition.model";
import StyleService from "../services/style-service";

export class ReportDefinitionController {
    public router = express.Router();

    constructor() {
        this.router.get("", responseHandler(this.getReportDefinitions));
        this.router.get("/:id", responseHandler(this.getById));
        this.router.post("", responseHandler(this.addReportDefinition));
        this.router.put("", responseHandler(this.editReportDefinition));
    }

    async getReportDefinitions(req, res, next) {
        const reportDefinitionService: ReportDefinitionService = req.container.resolve(
            "reportDefinitionService"
        );
        const reportDefinitionResult = await reportDefinitionService.getReportDefinitions();
        return reportDefinitionResult;
    }

    async getById(req, res, next) {
        const reportDefinitionService: ReportDefinitionService = req.container.resolve(
            "reportDefinitionService"
        );
        const styleService: StyleService = req.container.resolve("styleService");
        const reportDefinitionResult = await reportDefinitionService.getById({
            _id: req.params.id,
        });
        const styleResult = await styleService.getById(reportDefinitionResult.key);
        return { widget: reportDefinitionResult, style: styleResult };
    }

    async addReportDefinition(req, res, next) {
        const reportDefinitionService: ReportDefinitionService = req.container.resolve(
            "reportDefinitionService"
        );
        const reportDefinitionResult = await reportDefinitionService.addReportDefinition(
            new ReportDefinition(req.body)
        );
        return reportDefinitionResult._doc;
    }

    async editReportDefinition(req, res, next) {
        const reportDefinitionService: ReportDefinitionService = req.container.resolve(
            "reportDefinitionService"
        );
        const reportDefinitionResult = await reportDefinitionService.editReportDefinition(
            new ReportDefinition(req.body)
        );
        return reportDefinitionResult._doc;
    }
}
