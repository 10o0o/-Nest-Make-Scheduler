import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Request,
  Res,
} from '@nestjs/common';
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
  async commute(@Req() req, @Res() res) {
    // if (!req.body.name) {
    //   throw new BadRequestException('name을 입력해 주세요');
    // }

    const returndata = await this.commuteService.checkCommute(req.body.name);

    res.status(201).send(returndata);
  }

  @Post('update')
  async update(@Request() req) {
    return await this.commuteService.update(req.body);
  }
}
