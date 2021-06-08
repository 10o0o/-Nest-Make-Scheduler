import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { CronJob } from 'cron';
import { Repository } from 'typeorm';
import { staff } from './data/data';
import { tbl_attendance_info } from './entity/attendance_info.entity';
import { tbl_staff } from './entity/staff.entity';

@Injectable()
export class CommuteService {
  constructor(
    @InjectRepository(tbl_staff) private staffRepository: Repository<tbl_staff>,
    @InjectRepository(tbl_attendance_info)
    private attendanceRepository: Repository<tbl_attendance_info>,
    private schedulerRegistry: SchedulerRegistry
  ) {
    this.staffRepository = staffRepository;
  }

  async seeding() {
    const returnDataObj = {
      addStaffs: [],
      alreadyExistStaffs: [],
    };
    const newStaffs = staff;

    for (const staff of newStaffs) {
      const person = await this.staffRepository.findOne({ s_nm: staff.s_nm });

      if (!person) {
        await this.staffRepository.save(staff);
        returnDataObj.addStaffs.push(staff);
      } else {
        returnDataObj.alreadyExistStaffs.push(staff);
      }
    }

    return returnDataObj;
  }

  async checkCommute(staff_name) {
    const staff = await this.staffRepository.findOne({ s_nm: staff_name });

    if (!staff) throw new NotFoundException('등록되지 않은 직원입니다.');

    const isCommute = await this.attendanceRepository.findOne({ staff });

    if (isCommute) {
      return {
        data: staff,
        message: '이미 출근하셨습니다.',
      };
    }

    await this.attendanceRepository.save({
      staff,
    });

    // this.offWork(staff);
    setTimeout(async () => {
      await this.offWork(staff);
    }, 10000);

    return {
      data: staff,
      message: '성공적으로 출근했습니다.',
    };
  }

  async offWork(staff) {
    await this.attendanceRepository.delete({ staff });
    await axios({
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      url: 'https://creative2h.webhook.office.com/webhookb2/fc89e7e4-04f4-4375-a5eb-d0b2da741a41@5c480c99-e865-4067-aabb-9ff37d7939ec/IncomingWebhook/6cca77a57b9346bc9990648fb1dc9e69/a2393a72-cd63-4352-b1e3-797aca11299d',
      data: {
        themeColor: 'BCF7DA',
        title: `${staff.s_nm}님 퇴근시간입니다!.`,
        text: '퇴근시간 알림',
      },
    });

    console.log(`${staff.s_nm} 퇴근시간`);
  }

  addCronJob(cronName: string, date: moment.Moment, callback: () => void) {
    try {
      const job = new CronJob(date, callback);
      this.deleteCron(cronName);
      this.schedulerRegistry.addCronJob(cronName, job);
      job.start();
    } catch (error) {
      console.error(error);
    }
  }

  deleteCron(cronName: string) {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      try {
        if (key === cronName) {
          this.schedulerRegistry.deleteCronJob(cronName);
        }
      } catch (e) {
        console.error(e);
      }
    });
  }
}
