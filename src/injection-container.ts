import { asClass, createContainer } from "awilix";
import { ReadyComponentDao } from "./dao/ready-component-dao";
import { StyleDao } from "./dao/style-dao";
import { TestDao } from "./dao/test-dao";
import ReadyComponentService from "./services/ready-component-service";
import StyleService from "./services/style-service";
import TestService from "./services/test-service";

const container = createContainer();

container.register({
  testDao: asClass(TestDao).classic(),
  testService: asClass(TestService).classic(),
  readyComponentDao: asClass(ReadyComponentDao).classic(),
  readyComponentService: asClass(ReadyComponentService).classic(),
  styleDao: asClass(StyleDao).classic(),
  styleService: asClass(StyleService).classic(),
});

export default container;
