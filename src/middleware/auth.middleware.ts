import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Express Request to hold our User payload
export interface AuthRequest extends Request {
  user?: any;
}

const JWT_SECRET =
  process.env.JWT_SECRET || "super_secret_dental_key_for_development";

//   Authentication Middleware (Is the token valid?)
export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info (id, username, role) to the request
    next(); // Token is good, proceed to the next step!
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

// Authorization Middleware (Does the user have the right role?)
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): any => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Requires one of the following roles: ${allowedRoles.join(", ")}`,
      });
    }
    next(); // Role is good, allow access to the endpoint!
  };
};
