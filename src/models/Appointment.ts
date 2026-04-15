import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Patient } from "./Patient";
import { Dentist } from "./Dentist";
import { Surgery } from "./Surgery";

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "timestamp", nullable: false })
  appointmentDate!: Date;

  @ManyToOne(() => Patient, (patient) => patient.appointments, {
    nullable: false,
  })
  @JoinColumn({ name: "patient_id" })
  patient!: Patient;

  @ManyToOne(() => Dentist, (dentist) => dentist.appointments, {
    nullable: false,
  })
  @JoinColumn({ name: "dentist_id" })
  dentist!: Dentist;

  @ManyToOne(() => Surgery, (surgery) => surgery.appointments, {
    nullable: false,
  })
  @JoinColumn({ name: "surgery_id" })
  surgery!: Surgery;
}
