import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { staff } from './data/data';
import { tbl_staff } from './entity/staff.entity';

@Injectable()
export class CommuteService {
  constructor(
    @InjectRepository(tbl_staff) private staffRepository: Repository<tbl_staff>,
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

  findAll() {
    return `This action returns all commute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commute`;
  }

  remove(id: number) {
    return `This action removes a #${id} commute`;
  }
}
