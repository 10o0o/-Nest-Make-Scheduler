import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { tbl_staff } from './staff.entity';

@Entity()
export class tbl_attendance_info {
  @PrimaryGeneratedColumn()
  ri_id: Number;

  @OneToOne(() => tbl_staff)
  @Column()
  s_id: number;

  @CreateDateColumn({
    nullable: false,
    comment: '출근일',
  })
  attendance_dt: Date;
}