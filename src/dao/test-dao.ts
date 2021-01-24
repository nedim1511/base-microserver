import { BaseDao } from "./base-dao";

export class TestDao extends BaseDao {
    async getTest() {
       return "Success";
    }
}