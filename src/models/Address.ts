import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("addresses")
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  street!: string;

  @Column({ nullable: false })
  city!: string;

  @Column({ nullable: false })
  zipCode!: string;
}
