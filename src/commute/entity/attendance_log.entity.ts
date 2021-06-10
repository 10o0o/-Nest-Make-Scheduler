import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { tbl_staff } from './staff.entity';

@Entity()
export class tbl_attendance_log {
  @PrimaryGeneratedColumn()
  log_id: number;

  @CreateDateColumn({
    nullable: false,
    comment: '출근기록',
  })
  attendance_dt: Date;

  @UpdateDateColumn({
    nullable: true,
    comment: '퇴근기록',
  })
  commute_dt: Date;

  @OneToOne(() => tbl_staff)
  @JoinColumn()
  staff: tbl_staff;
}
