import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { CronJob } from 'cron';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment');
import { getConnection, Repository } from 'typeorm';
import { staff } from './data/data';
import { tbl_attendance_info } from './entity/attendance_info.entity';
import { tbl_attendance_log } from './entity/attendance_log.entity';
import { tbl_staff } from './entity/staff.entity';

@Injectable()
export class CommuteService {
  constructor(
    @InjectRepository(tbl_staff) private staffRepository: Repository<tbl_staff>,
    @InjectRepository(tbl_attendance_info)
    private attendanceRepository: Repository<tbl_attendance_info>,
    @InjectRepository(tbl_attendance_log)
    private attendanceLogRepository: Repository<tbl_attendance_log>,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.load();
  }

  private load() {
    this.checkRemainCommute();
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

  // 퇴근하자마자 실수로 출근 한번 더 처리
  // 퇴근 포스트
  async checkCommute(staff_name) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const { manager } = queryRunner;
    await queryRunner.startTransaction();

    const staff = await manager.findOne(tbl_staff, { s_nm: staff_name });

    if (!staff) throw new NotFoundException('등록되지 않은 직원입니다.');

    const isCommute = await manager.findOne(tbl_attendance_info, { staff });

    if (isCommute) {
      return {
        data: staff,
        message: '이미 출근한 사람입니다.',
      };
    }

    try {
      await manager.save(tbl_attendance_info, {
        staff,
      });

      const cronName = staff_name;
      const date = moment().add(5, 'second');

      this.addCronJob(cronName, date, async () => {
        try {
          await this.offWork(staff);
        } catch (e) {
          console.error(e);
          await queryRunner.rollbackTransaction();
        }
      });

      console.log(`${staff_name} 스케줄러 등록 완료!`);

      return {
        data: staff,
        message: '성공적으로 출근했습니다.',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async offWork(staff) {
    const queryRunner = getConnection().createQueryRunner();
    const { manager } = queryRunner;
    await queryRunner.startTransaction();

    try {
      const attendance_dt = await manager
        .createQueryBuilder(tbl_attendance_info, 'attendance')
        .select('attendance.attendance_dt')
        .where('staffSid = :id', { id: staff.s_id })
        .getOne();

      const newLog = manager.create(tbl_attendance_log);
      newLog.staff = staff;
      newLog.attendance_dt = attendance_dt.attendance_dt;
      newLog.commute_dt = new Date();

      await manager.save(tbl_attendance_log, newLog);
      await manager.delete(tbl_attendance_info, { staff });
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
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private addCronJob(
    cronName: string,
    date: moment.Moment,
    callback: () => void,
  ) {
    try {
      const job = new CronJob(date, callback);

      this.schedulerRegistry.addCronJob(cronName, job);
      this.deleteCron(cronName);
      job.start();
    } catch (error) {
      console.error(error);
    }
  }

  private deleteCron(cronName: string) {
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

  async checkRemainCommute() {
    const remainCommuteLists = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .getRawMany();

    remainCommuteLists.forEach(async (commuteOne) => {
      console.log(commuteOne);
      if (
        commuteOne.attendance_attendance_dt < moment().subtract(5, 'seconds')
      ) {
        this.attendanceRepository.delete({
          ri_id: commuteOne.attendance_ri_id,
        });
      } else {
        const cronName = await this.staffRepository
          .createQueryBuilder('staff')
          .select('staff.s_nm')
          .where('staff.s_id = :id', { id: commuteOne.attendance_staffSId })
          .getOne();

        console.log('크론이름 :', cronName);
        const date = moment().add(5, 'second');

        this.addCronJob(cronName.s_nm, date, async () => {
          try {
            const staff = await this.staffRepository.findOne({
              s_nm: cronName.s_nm,
            });
            await this.offWork(staff);
          } catch (e) {
            console.error(e);
          }
        });
      }
    });
  }

  async update(userInfo) {
    const user = await this.staffRepository.findOne({
      s_nm: userInfo.name,
    });

    user.s_nm = userInfo.changeName;

    const test = await this.staffRepository.save(user);
    // console.log(user)

    // const test = await this.staffRepository.update(
    //   { s_nm: userInfo.name },
    //   { s_nm: userInfo.changeName },
    // );

    console.log(test);
  }
}
