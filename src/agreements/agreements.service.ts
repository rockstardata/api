import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { Agreement, AgreementStatus } from './entities/agreement.entity';
import { Venue } from 'src/venue/entities/venue.entity';
import { User } from 'src/users/entities/user.entity';
import { SyncService } from '../database/sync.service';

@Injectable()
export class AgreementsService {
  constructor(
    @InjectRepository(Agreement)
    private agreementRepository: Repository<Agreement>,
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly syncService: SyncService,
  ) {}

  async create(createAgreementDto: CreateAgreementDto, userId: number) {
    const venue = await this.venueRepository.findOne({
      where: { id: createAgreementDto.venueId },
    });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    const agreement = this.agreementRepository.create({
      ...createAgreementDto,
      venue,
      createdBy: { id: userId },
      startDate: new Date(createAgreementDto.startDate),
      endDate: new Date(createAgreementDto.endDate),
    });

    if (createAgreementDto.responsiblePersonId) {
      const responsiblePerson = await this.userRepository.findOne({
        where: { id: createAgreementDto.responsiblePersonId },
      });
      if (responsiblePerson) {
        agreement.responsiblePerson = responsiblePerson;
      }
    }

    const savedAgreement = await this.agreementRepository.save(agreement);
    this.syncService.syncEntity('Agreement', 'create', savedAgreement).catch(error => {
      console.error('Failed to sync agreement creation to external DB:', error);
    });
    return savedAgreement;
  }

  async findAll(venueId?: number) {
    const query = this.agreementRepository.createQueryBuilder('agreement')
      .leftJoinAndSelect('agreement.venue', 'venue')
      .leftJoinAndSelect('agreement.createdBy', 'createdBy')
      .leftJoinAndSelect('agreement.responsiblePerson', 'responsiblePerson');

    if (venueId) {
      query.where('venue.id = :venueId', { venueId });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const agreement = await this.agreementRepository.findOne({
      where: { id },
      relations: ['venue', 'createdBy', 'responsiblePerson'],
    });

    if (!agreement) {
      throw new NotFoundException(`Agreement with ID ${id} not found`);
    }

    return agreement;
  }

  async update(id: number, updateAgreementDto: UpdateAgreementDto, userId: number) {
    const agreement = await this.findOne(id);

    if (updateAgreementDto.venueId) {
      const venue = await this.venueRepository.findOne({
        where: { id: updateAgreementDto.venueId },
      });
      if (venue) {
        agreement.venue = venue;
      }
    }

    if (updateAgreementDto.responsiblePersonId) {
      const responsiblePerson = await this.userRepository.findOne({
        where: { id: updateAgreementDto.responsiblePersonId },
      });
      if (responsiblePerson) {
        agreement.responsiblePerson = responsiblePerson;
      }
    }

    if (updateAgreementDto.startDate) {
      agreement.startDate = new Date(updateAgreementDto.startDate);
    }

    if (updateAgreementDto.endDate) {
      agreement.endDate = new Date(updateAgreementDto.endDate);
    }

    Object.assign(agreement, updateAgreementDto);
    const updatedAgreement = await this.agreementRepository.save(agreement);
    this.syncService.syncEntity('Agreement', 'update', updatedAgreement).catch(error => {
      console.error('Failed to sync agreement update to external DB:', error);
    });
    return updatedAgreement;
  }

  async remove(id: number) {
    const agreement = await this.findOne(id);
    await this.agreementRepository.remove(agreement);
    this.syncService.syncEntity('Agreement', 'delete', { id }).catch(error => {
      console.error('Failed to sync agreement deletion to external DB:', error);
    });
  }

  async findByVenue(venueId: number) {
    return this.agreementRepository.find({
      where: { venue: { id: venueId } },
      relations: ['venue', 'createdBy', 'responsiblePerson'],
    });
  }

  async findByStatus(status: AgreementStatus) {
    return this.agreementRepository.find({
      where: { status },
      relations: ['venue'],
    });
  }

  async getExpiringAgreements(days: number = 30) {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return this.agreementRepository
      .createQueryBuilder('agreement')
      .leftJoinAndSelect('agreement.venue', 'venue')
      .where('agreement.endDate <= :date', { date })
      .andWhere('agreement.status = :status', { status: 'active' })
      .getMany();
  }
}
