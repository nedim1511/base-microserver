import { TestDao } from "../dao/test-dao";

export default class TestService {
  private testDao: TestDao;

  constructor(testDao: any){
      this.testDao = testDao;
  }

  async getTest() {
      return await this.testDao.getTest();
  }
}