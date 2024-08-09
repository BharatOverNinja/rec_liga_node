// const jwt = require("jsonwebtoken");
// const BadRequestError = require("../errors/badRequestError.js");
// const User = require("../models/user.js");

// const authenticateUser = async (authHeader) => {
//   if (!authHeader) {
//     throw new BadRequestError("Authorization header missing");
//   }

//   const token = authHeader.split(" ")[1];
//   let decoded;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//   } catch (err) {
//     throw new BadRequestError("Invalid token");
//   }

//   const userId = decoded.id;
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new BadRequestError("User not found");
//   }

//   return userId;
// };

// module.exports = { authenticateUser };