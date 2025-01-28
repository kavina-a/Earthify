// const asyncHandler = require("../middlewares/asyncHandler.js");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel.js");

// const authenticate = (allowedRoles = []) =>
//   asyncHandler(async (req, res, next) => {
//     let token;
//     token = req.cookies.jwt;
//     console.log(token)

//     if (token) {
//       try {
       
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log(decoded)
//         const user = await User.findById(decoded.userId).select("-password");
//         console.log(user)

//         if (!user) {
//           res.status(401);
//           throw new Error("User not found");
//         }

//         // If no allowedRoles array is passed, skip role checking
//         if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//           res.status(403);
//           throw new Error("Not authorized, incorrect role");
//         }

//         req.user = user;

//         next();
//       } catch (error) {
//         res.status(401);
//         //console.log("Error verifying token:", error);
//         throw new Error("Not authorized, token failed");
//       }
//     } else {
//       res.status(401);
//       console.log("No token found utto");
//       throw new Error("Not authorized, no token");
//     }
//   });

// module.exports = authenticate;


const asyncHandler = require("../middlewares/asyncHandler.js");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authenticate = (allowedRoles = []) =>
  asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.jwt;
    console.log(`[DEBUG] Token extracted from cookies: ${token || "No token found"}`);

    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`[DEBUG] Decoded token: ${JSON.stringify(decoded)}`);

        // Find the user based on the token's userId
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
          console.log(`[DEBUG] No user found with ID: ${decoded.userId}`);
          res.status(401);
          throw new Error("User not found");
        }

        console.log(`[DEBUG] User found: ${JSON.stringify(user)}`);

        // Check user roles, if applicable
        if (allowedRoles.length > 0) {
          console.log(`[DEBUG] Allowed roles: ${allowedRoles}`);
          console.log(`[DEBUG] User role: ${user.role}`);
          if (!allowedRoles.includes(user.role)) {
            console.log(`[DEBUG] User role not authorized`);
            res.status(403);
            throw new Error("Not authorized, incorrect role");
          }
        }

        // Attach user to request
        req.user = user;
        console.log(`[DEBUG] User successfully authenticated and attached to request`);
        next();
      } catch (error) {
        console.error(`[ERROR] Error verifying token: ${error.message}`);
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    } else {
      console.log("[DEBUG] No token found in cookies");
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  });

module.exports = authenticate;