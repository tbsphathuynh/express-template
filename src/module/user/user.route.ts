import { Router } from "express";
import UserController from "./user.controller";
import routeCreator, { HttpMethods, IRoutes } from "../../config/routeCreator";
import { validateBody } from "../../middleware/validation.middleware";
import { validateUpdateUserPayload } from "./validator/update-user.validator";
import { authenticateJWT } from "../../middleware/auth.middleware";

const userRoute = Router();
const userController = new UserController();

const routes: IRoutes[] = [
  {
    path: "/",
    method: HttpMethods.put,
    middleware: [validateBody(validateUpdateUserPayload)],
    handler: userController.updateLoggedInUser,
  },
  {
    path: "/",
    method: HttpMethods.get,
    middleware: [],
    handler: userController.getLoggedInUser,
  },
  {
    path: "/:id",
    method: HttpMethods.get,
    middleware: [],
    handler: userController.getUserById,
  },
];
routeCreator(userRoute, routes, [authenticateJWT]);
export default userRoute;
