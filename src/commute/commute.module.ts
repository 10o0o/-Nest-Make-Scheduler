import { Module } from '@nestjs/common';
import { CommuteService } from './commute.service';
import { CommuteController } from './commute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tbl_staff } from './entity/staff.entity';
import { tbl_attendance_info } from './entity/attendance_info.entity';
import { tbl_attendance_log } from './entity/attendance_log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      tbl_staff,
      tbl_attendance_info,
      tbl_attendance_log,
    ]),
  ],
  controllers: [CommuteController],
  providers: [CommuteService],
})
export class CommuteModule {}
