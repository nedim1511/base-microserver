import { asClass, createContainer } from "awilix";
import { TestDao } from "./dao/test-dao";
import TestService from "./services/test-service";

const container = createContainer();

container.register({
  testDao: asClass(TestDao).classic(),
  testService: asClass(TestService).classic()
});

export default container;
