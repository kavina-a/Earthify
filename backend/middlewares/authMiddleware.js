const asyncHandler = require("../middlewares/asyncHandler.js");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authenticate = (allowedRoles = []) =>
  asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.jwt;

    if (token) {
      try {
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
          res.status(401);
          throw new Error("User not found");
        }

        // If no allowedRoles array is passed, skip role checking
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          res.status(403);
          throw new Error("Not authorized, incorrect role");
        }

        req.user = user;

        next();
      } catch (error) {
        res.status(401);
        //console.log("Error verifying token:", error);
        throw new Error("Not authorized, token failed");
      }
    } else {
      res.status(401);
      console.log("No token found in cookies");
      throw new Error("Not authorized, no token");
    }
  });

module.exports = authenticate;
