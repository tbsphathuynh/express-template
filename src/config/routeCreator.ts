import { Router } from "express";

export enum HttpMethods {
  get = "get",
  post = "post",
  put = "put",
  delete = "delete",
  patch = "patch",
}
export interface IRoutes {
  path: string;
  method: HttpMethods;
  middleware: any[];
  handler: any;
}
const routeCreator = (route: Router, routes: IRoutes[], middleware?: any[]) => {
  routes.forEach((r) => {
    route[r.method](
      r.path,
      [...(middleware || []), ...(r.middleware || [])],
      r.handler
    );
  });
};

export default routeCreator;
