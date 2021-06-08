import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Staff } from '../interface/staffs.interface';
import { tbl_attendance_info } from './attendance_info.entity';

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

  @OneToOne(() => tbl_attendance_info, (attendance) => attendance.staff)
  staff: tbl_staff;
}
