import { PatientService } from "../services/PatientService";
import { AppointmentService } from "../services/AppointmentService";
import { AppDataSource } from "../config/database";
import { Dentist } from "../models/Dentist";
import { Surgery } from "../models/Surgery";
import { Address } from "../models/Address";

export class AppRunner {
  private patientService = new PatientService();
  private appointmentService = new AppointmentService();

  async run() {
    console.log("--- Starting ADS Dental CLI ---");

    try {
      // Create Base Data (Dentist & Surgery)
      const dentistRepo = AppDataSource.getRepository(Dentist);
      const surgeryRepo = AppDataSource.getRepository(Surgery);

      const dentist = new Dentist();
      dentist.firstName = "Dr. Gillian";
      dentist.specialization = "General Dentistry";
      const savedDentist = await dentistRepo.save(dentist);

      const surgeryAddress = new Address();
      surgeryAddress.street = "1000 N 4th St";
      surgeryAddress.city = "Fairfield";
      surgeryAddress.zipCode = "52557";

      const surgery = new Surgery();
      surgery.name = "MIU Dental Clinic";
      surgery.address = surgeryAddress;
      const savedSurgery = await surgeryRepo.save(surgery);

      // Use Service to Create Patient
      console.log("\n[1] Registering New Patient...");
      const newPatient = await this.patientService.registerNewPatient(
        "Gillian",
        "White",
        "123 Chrome St",
        "Fairfield",
        "52556",
      );
      console.log(
        `Patient Created: ${newPatient.firstName} ${newPatient.lastName}`,
      );

      // Use Service to Book Appointment
      console.log("\n[2] Booking Appointment...");
      const appointmentDate = new Date("2026-05-15T10:00:00Z");
      const appointment = await this.appointmentService.bookAppointment(
        newPatient.id,
        savedDentist.id,
        savedSurgery.id,
        appointmentDate,
      );
      console.log(`Appointment Booked for ID: ${appointment.id}`);

      // Fetch and Display Data
      console.log("\n[3] Fetching all appointments...");
      const allAppointments = await this.appointmentService.getAppointments();

      allAppointments.forEach((app) => {
        console.log(
          `- Date: ${app.appointmentDate.toDateString()} | Patient: ${app.patient.firstName} | Dentist: ${app.dentist.firstName} | Location: ${app.surgery.name}`,
        );
      });

      // Map the nested TypeORM data into a flat structure matching your assignment image
      const tableData = allAppointments.map((app) => {
        const dateObj = new Date(app.appointmentDate);

        // Formats to '15-May-26'
        const formattedDate = dateObj
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          })
          .replace(/ /g, "-");

        // Formats to '10.00'
        const formattedTime = dateObj
          .toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC", // Keeps time consistent with the saved ISO string
          })
          .replace(":", ".");

        return {
          dentistName: app.dentist.firstName,
          patNo: `P${app.patient.id}00`,
          patName: `${app.patient.firstName} ${app.patient.lastName}`,
          "appointment date": formattedDate,
          time: formattedTime,
          surgeryNo: `S${app.surgery.id}0`,
        };
      });

      // Print the array as a beautiful table in the terminal!
      console.table(tableData);
    } catch (error) {
      console.error("Application Error:", error);
    }
  }
}
