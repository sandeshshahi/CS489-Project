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

@Entity("surgeries")
export class Surgery {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false })
  name!: string;

  @OneToOne(() => Address, { cascade: true, nullable: false, eager: true })
  @JoinColumn({ name: "address_id" })
  address!: Address;

  @OneToMany(() => Appointment, (appointment) => appointment.surgery)
  appointments!: Appointment[];
}
