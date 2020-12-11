import { BaseDao } from "./base-dao";

import TestModel from "../models/test";

export class TestDao extends BaseDao {
    async getTest() {
       return "Success";
    }
}