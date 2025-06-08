import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import UserService from "./user.service";
import { formatResponse } from "../../config/responseFormatter";
import { logger } from "../../config/logger";

class UserController {
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  getLoggedInUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await this.userService.getUserById(req.user._id.toString());
      if (!user) {
        return res
          .status(404)
          .json(formatResponse(true, "User details not found", {}));
      }
      res.status(200).json(formatResponse(true, "User details", user));
    } catch (error: any) {
      logger.error("getLoggedInUser", error);
      res
        .status(500)
        .json(formatResponse(true, "Internal server error", (error = error)));
    }
  };

  updateLoggedInUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const payload = {
        fullname: req.body.fullname,
      };
      const user = await this.userService.updateUser(
        { _id: req.user._id.toString() },
        { $set: payload }
      );
      if (!user) {
        return res
          .status(404)
          .json(formatResponse(true, "User details not found", {}));
      }
      res.status(200).json(formatResponse(true, "User details updated", user));
    } catch (error: any) {
      logger.error("updateUser", error);
      res
        .status(500)
        .json(formatResponse(true, "Internal server error", (error = error)));
    }
  };

  getUserById = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return res
          .status(404)
          .json(formatResponse(true, "User details not found", {}));
      }
      res.status(200).json(formatResponse(true, "User details", user));
    } catch (error: any) {
      logger.error("getUserById", error);
      res
        .status(500)
        .json(formatResponse(true, "Internal server error", (error = error)));
    }
  };
}

export default UserController;
