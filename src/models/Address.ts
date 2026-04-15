import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Patient } from "./Patient";

@Entity("addresses")
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false })
  street!: string;

  @Column({ type: "varchar", nullable: false })
  city!: string;

  @Column({ type: "varchar", nullable: false })
  zipCode!: string;

  @OneToOne(() => Patient, (patient) => patient.address)
  patient!: Patient;
}
