import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommuteModule } from './commute/commute.module';
import { tbl_attendance_info } from './commute/entity/attendance_info.entity';
import { tbl_staff } from './commute/entity/staff.entity';

@Module({
  imports: [
    CommuteModule,
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'test123!@#',
    database: 'TEST_makeScheduler',
    entities: [tbl_staff, tbl_attendance_info],
    synchronize: true,
    autoLoadEntities: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
