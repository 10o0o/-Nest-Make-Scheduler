import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommuteModule } from './commute/commute.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CommuteModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
