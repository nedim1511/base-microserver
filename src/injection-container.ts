import { asClass, createContainer } from "awilix";
import { TestDao } from "./dao/test-dao";
import { WidgetDao } from "./dao/widget-dao";
import TestService from "./services/test-service";
import WidgetService from "./services/widget.service";

const container = createContainer();

container.register({
  testDao: asClass(TestDao).classic(),
  testService: asClass(TestService).classic(),
  widgetDao: asClass(WidgetDao).classic(),
  widgetService: asClass(WidgetService).classic(),
});

export default container;
