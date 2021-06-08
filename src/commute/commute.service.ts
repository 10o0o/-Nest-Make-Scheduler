import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    return {
      data: staff,
      message: '성공적으로 출근했습니다.',
    };
  }
}
