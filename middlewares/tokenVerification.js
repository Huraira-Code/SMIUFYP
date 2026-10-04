import jwt from "jsonwebtoken";
import UserModel from "../models/usermodel.js";
import config from "../config/config.js";

export const isVerifiedUser = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {

      console.log("h")
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "No token provided"
        });
      }

      const token = authHeader.split(" ")[1];
      console.log(token)
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
      console.log(decoded)
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          message: "User not found"
        });
      }


      console.log("user", user);

      req.user = user;

      next();

    } catch (error) {
      console.log(error)
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired, login again"
        });
      }

      return res.status(401).json({
        message: "Invalid token"
      });
    }
  };
};