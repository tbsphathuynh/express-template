import authRoutes from "./module/auth/auth.route";
import userRoute from "./module/user/user.route";

const ROUTES = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/user",
    route: userRoute,
  },
];

export default ROUTES;
