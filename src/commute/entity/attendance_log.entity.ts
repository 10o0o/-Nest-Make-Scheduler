import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { columnName } from 'typeorm-model-generator/dist/src/NamingStrategy';
import { tbl_staff } from './staff.entity';

@Entity()
export class tbl_attendance_log {
  @PrimaryGeneratedColumn()
  log_id: number;

  @Column({
    nullable: false,
    comment: '출근기록',
  })
  attendance_dt: Date;

  @Column({
    nullable: false,
    comment: '퇴근기록',
  })
  commute_dt: Date;

  @ManyToOne(() => tbl_staff, (staff) => staff.log)
  @JoinColumn()
  staff: tbl_staff;
}
