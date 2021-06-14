import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Staff } from '../interface/staffs.interface';
import { tbl_attendance_info } from './attendance_info.entity';
import { tbl_attendance_log } from './attendance_log.entity';

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
  staff1: tbl_staff;

  @OneToMany(() => tbl_attendance_log, (log) => log.staff)
  log: tbl_staff[];
}
