import * as express from 'express'
import responseHandler = require('../middleware/response-handle');
import TestService from '../services/test-service';

export class TestController {
  public router = express.Router();

  constructor() {
    this.router.get("", responseHandler(this.getTest));
  }

  async getTest(req, res, next){
    const testService: TestService = req.container.resolve('testService');
    const testResult = await testService.getTest();
    return testResult;
  }
}
