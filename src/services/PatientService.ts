import { PatientRepository } from "../repositories/PatientRepository";
import { Patient } from "../models/Patient";
import { Address } from "../models/Address";

export class PatientService {
  async registerNewPatient(
    firstName: string,
    lastName: string,
    street: string,
    city: string,
    zipCode: string,
  ): Promise<Patient> {
    const address = new Address();
    address.street = street;
    address.city = city;
    address.zipCode = zipCode;

    const patient = new Patient();
    patient.firstName = firstName;
    patient.lastName = lastName;
    patient.address = address; // Cascade: true in the model will save the address automatically

    return await PatientRepository.save(patient);
  }

  async getAllPatients(): Promise<Patient[]> {
    return await PatientRepository.find({ relations: ["address"] });
  }
}
