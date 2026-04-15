import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { PatientRepository } from "../repositories/PatientRepository";
import { AppDataSource } from "../config/database";
import { Dentist } from "../models/Dentist";
import { Surgery } from "../models/Surgery";
import { Appointment } from "../models/Appointment";

export class AppointmentService {
  async bookAppointment(
    patientId: number,
    dentistId: number,
    surgeryId: number,
    date: Date,
  ): Promise<Appointment> {
    const patient = await PatientRepository.findOneBy({ id: patientId });
    const dentist = await AppDataSource.getRepository(Dentist).findOneBy({
      id: dentistId,
    });
    const surgery = await AppDataSource.getRepository(Surgery).findOneBy({
      id: surgeryId,
    });

    if (!patient || !dentist || !surgery) {
      throw new Error("Patient, Dentist, or Surgery not found!");
    }

    const appointment = new Appointment();
    appointment.appointmentDate = date;
    appointment.patient = patient;
    appointment.dentist = dentist;
    appointment.surgery = surgery;

    return await AppointmentRepository.save(appointment);
  }

  async getAppointments() {
    return await AppointmentRepository.findAllWithDetails();
  }
}
