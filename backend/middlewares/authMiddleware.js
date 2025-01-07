const asyncHandler = require("../middlewares/asyncHandler.js");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authenticate = (allowedRoles = []) =>
  asyncHandler(async (req, res, next) => {
    let token;

    // Log cookies to see if the token is in there
    // console.log("Cookies:", req.cookies);
    // console.log(allowedRoles);
    
    token = req.cookies.jwt;

    if (token) {
      try {
        // Log the token for verification
        // console.log("Token received:", token);

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log the decoded token to ensure the user ID is correct
        // console.log("Decoded token:", decoded);

        // Retrieve the user from the database
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
          res.status(401);
          throw new Error("User not found");
        }

        // Log the user object
        //console.log("User found:", user);

        // If no allowedRoles array is passed, skip role checking
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          res.status(403);
          throw new Error("Not authorized, incorrect role");
        }

       // console.log("User authenticated, proceeding to next middleware");
        // Attach the user to the request object
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

// const authenticate = (allowedRoles = []) =>
//   asyncHandler(async (req, res, next) => {
//     let token;

//     // Extract the token from the cookie
//     token = req.cookies.jwt;

//     if (token) {
//       try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Retrieve the user from the database
//         const user = await User.findById(decoded.userId).select("-password");

//         if (!user) {
//           res.status(401);
//           throw new Error("User not found");
//         }

//         // If no allowedRoles array is passed, skip role checking
//         // Otherwise, check if the user's role is in the allowedRoles array
//         if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//           res.status(403);
//           throw new Error("Not authorized, incorrect role");
//         }

//         // Attach the user to the request object
//         req.user = user;

//         next();
//       } catch (error) {
//         res.status(401);
//         throw new Error("Not authorized, token failed");
//       }
//     } else {
//       res.status(401);
//       console.log("No token found in cookies");
//       throw new Error("Not authorized, no token");
//     }
//   });

// module.exports = authenticate;