import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class tbl_staff {
  @PrimaryGeneratedColumn()
  s_id: Number;

  @Column({
    length: 50,
    nullable: true,
    default: null,
    comment: '직원명',
    collation: 'utf8_general_ci',
  })
  s_nm: string;
}