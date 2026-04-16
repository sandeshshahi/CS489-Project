import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Role } from "./Role";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: false, unique: true })
  username!: string;

  @Column({ type: "varchar" })
  password!: string;

  @ManyToOne(() => Role, { nullable: false, eager: true })
  @JoinColumn({ name: "role_id" })
  role!: Role;
}
