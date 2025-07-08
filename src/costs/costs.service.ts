import { Injectable } from '@nestjs/common';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';

@Injectable()
export class CostsService {
  create(createCostDto: CreateCostDto) {
    return 'This action adds a new cost';
  }

  findAll() {
    return `This action returns all costs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cost`;
  }

  update(id: number, updateCostDto: UpdateCostDto) {
    return `This action updates a #${id} cost`;
  }

  remove(id: number) {
    return `This action removes a #${id} cost`;
  }
}
