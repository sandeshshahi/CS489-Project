import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Appointment } from "./Appointment";

@Entity("dentists")
export class Dentist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false })
  firstName!: string;

  @Column({ type: "varchar", nullable: false })
  specialization!: string;

  @OneToMany(() => Appointment, (appointment) => appointment.dentist)
  appointments!: Appointment[];
}
