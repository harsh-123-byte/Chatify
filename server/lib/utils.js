// We will generate utility functions here in the future

import jwt from "jsonwebtoken";

// Function to generate JWT token
export const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET); // jwt.sign method se token generate karenge, jisme hum userId ko payload me dalenge aur secret key use karenge jo environment variable me stored hai.isse hum user ko authenticate kar sakte hai jab wo apne token ke sath request bhejega.
  return token;
};
