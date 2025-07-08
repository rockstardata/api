import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomeService {
  create(createIncomeDto: CreateIncomeDto) {
    return 'This action adds a new income';
  }
  findByOrganization(orgId: number) {
    // En un caso real, aquí iría la lógica para buscar en la base de datos.
    return {
      message: `Acceso concedido. Mostrando ingresos para la organización con ID: ${orgId}`,
    };
  }
  findAll() {
    return `This action returns all income`;
  }

  findOne(id: number) {
    return `This action returns a #${id} income`;
  }

  update(id: number, updateIncomeDto: UpdateIncomeDto) {
    return `This action updates a #${id} income`;
  }

  remove(id: number) {
    return `This action removes a #${id} income`;
  }
}
