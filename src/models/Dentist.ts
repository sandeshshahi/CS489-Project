import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Appointment } from "./Appointment";

@Entity("dentists")
export class Dentist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  firstName!: string;

  @Column({ nullable: false })
  specialization!: string;

  @OneToMany(() => Appointment, (appointment) => appointment.dentist)
  appointments!: Appointment[];
}
