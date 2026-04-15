import { AppDataSource } from "../config/database";
import { Patient } from "../models/Patient";

export const PatientRepository = AppDataSource.getRepository(Patient).extend({
  findPatientWithAddress(patientId: number) {
    return this.findOne({
      where: { id: patientId },
      relations: ["address"],
    });
  },
  findPatientsByLastName(lastName: string) {
    return this.find({ where: { lastName } });
  },
});
