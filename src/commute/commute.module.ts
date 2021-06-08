import { Module } from '@nestjs/common';
import { CommuteService } from './commute.service';
import { CommuteController } from './commute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { tbl_staff } from './entity/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([tbl_staff])],
  controllers: [CommuteController],
  providers: [CommuteService],
})
export class CommuteModule {}
