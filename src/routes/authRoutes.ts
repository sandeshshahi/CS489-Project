import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";
import { Role } from "../models/Role";

const router = Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "super_secret_dental_key_for_development";

// Helper route just to seed a test Admin and User into the DB
router.post("/setup", async (req: Request, res: Response) => {
  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);

  const adminRole = await roleRepo.save({ roleName: "ADMIN" });
  const userRole = await roleRepo.save({ roleName: "OFFICE_MANAGER" });

  // Hash passwords before saving!
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const hashedManagerPassword = await bcrypt.hash("manager123", 10);

  await userRepo.save({
    username: "admin",
    password: hashedAdminPassword,
    role: adminRole,
  });
  await userRepo.save({
    username: "manager",
    password: hashedManagerPassword,
    role: userRole,
  });

  res.json({ message: "Test roles and users created successfully!" });
});

// The actual Login Endpoint
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({ where: { username } });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare raw password with hashed password in DB
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role.roleName },
    JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.json({ token });
});

export default router;
