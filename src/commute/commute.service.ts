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
    const staffs = staff;

    for (const staff of staffs) {
      const person = this.staffRepository.findOne({ s_nm: staff.s_nm });

      if (!person) {
        await this.staffRepository.save(staff);
      }
    }

    return staffs;
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
