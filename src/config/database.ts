import "reflect-metadata";
import { DataSource } from "typeorm";
import { Address } from "../models/Address";
import { Patient } from "../models/Patient";
import { Dentist } from "../models/Dentist";
import { Surgery } from "../models/Surgery";
import { Appointment } from "../models/Appointment";
import { Role } from "../models/Role";
import { User } from "../models/User";

export const AppDataSource = new DataSource({
  type: "mysql", // Switch to "mysql" or "sqlite" if preferred
  host: "127.0.0.1",
  port: 3306,
  username: "root", // Replace with your DB username
  password: "welcomehome", // Replace with your DB password
  database: "ads_dental_db", // Ensure this DB is created in your database server
  synchronize: true, // Auto-creates tables based on models
  logging: false,
  entities: [Address, Patient, Dentist, Surgery, Appointment, Role, User],
});
