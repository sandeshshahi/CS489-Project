import { AppDataSource } from "../config/database";
import { Appointment } from "../models/Appointment";

export const AppointmentRepository = AppDataSource.getRepository(
  Appointment,
).extend({
  findAllWithDetails() {
    return this.find({
      relations: ["patient", "dentist", "surgery"],
    });
  },
});
