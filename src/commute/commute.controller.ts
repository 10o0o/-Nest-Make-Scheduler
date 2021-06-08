import { BadRequestException, Controller, Post, Request } from '@nestjs/common';
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

  @Post()
  async commute(@Request() req) {
    if (!req.body.name) {
      throw new BadRequestException('name을 입력해 주세요');
    }

    return await this.commuteService.checkCommute(req.body.name);
  }
}
