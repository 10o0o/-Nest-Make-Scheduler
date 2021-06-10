import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommuteModule } from './commute/commute.module';
import { tbl_attendance_info } from './commute/entity/attendance_info.entity';
import { tbl_attendance_log } from './commute/entity/attendance_log.entity';
import { tbl_staff } from './commute/entity/staff.entity';
import { AddAttendanceLog1623206519490 } from './migrations/1623206519490-AddAttendanceLog';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CommuteModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'TEST_makeScheduler',
      entities: [tbl_staff, tbl_attendance_info, tbl_attendance_log],
      // migrations: [AddAttendanceLog1623206519490],
      // migrationsTableName: 'tbl_attendance_log',
      // migrationsRun: true,
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
