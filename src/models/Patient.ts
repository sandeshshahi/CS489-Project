import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Address } from "./Address";
import { Appointment } from "./Appointment";

@Entity("patients")
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false })
  firstName!: string;

  @Column({ type: "varchar", nullable: false })
  lastName!: string;

  @OneToOne(() => Address, { cascade: true, nullable: false, eager: true })
  @JoinColumn({ name: "address_id" })
  address!: Address;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments!: Appointment[];
}
