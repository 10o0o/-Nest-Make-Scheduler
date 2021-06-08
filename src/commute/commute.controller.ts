import { Controller, Post } from '@nestjs/common';
import { CommuteService } from './commute.service';

@Controller('commute')
export class CommuteController {
  constructor(private readonly commuteService: CommuteService) {}

  @Post('seed')
  async seeding() {
    const staffs = await this.commuteService.seeding();

    return {
      data: staffs,
      message: 'successfully create dummy',
    };
  }
}
