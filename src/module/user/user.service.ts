import { Model, RootFilterQuery, UpdateQuery } from "mongoose";
import UserModel, { UserDocument } from "./user.schema";

class UserService {
  private userModel: Model<UserDocument>;

  constructor() {
    this.userModel = UserModel;
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }
  async createUser(userData: Partial<UserDocument>): Promise<UserDocument> {
    const user = new this.userModel(userData);
    await user.save();
    return user;
  }
  async updateUser(
    filter: RootFilterQuery<UserDocument>,
    userData: UpdateQuery<UserDocument>
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOneAndUpdate(filter, userData, {
      new: true,
    });
    return user;
  }
}

export default UserService;
