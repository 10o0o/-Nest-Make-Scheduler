import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Staff } from '../interface/staffs.interface';

@Entity()
export class tbl_staff implements Staff {
  @PrimaryGeneratedColumn()
  s_id: number;

  @Column({
    length: 50,
    nullable: true,
    default: null,
    comment: '직원명',
    collation: 'utf8_general_ci',
  })
  s_nm: string;
}
