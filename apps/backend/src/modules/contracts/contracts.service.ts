import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractsRepository: Repository<Contract>,
  ) {}

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    const contract = this.contractsRepository.create({
      ...createContractDto,
      parties: Array.isArray(createContractDto.parties) ? createContractDto.parties.join(',') : createContractDto.parties,
      tags: Array.isArray(createContractDto.tags) ? createContractDto.tags.join(',') : createContractDto.tags
    });
    return this.contractsRepository.save(contract);
  }

  async findAll(): Promise<Contract[]> {
    return this.contractsRepository.find({
      relations: ['assignedLawyer', 'matter'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({
      where: { id },
      relations: ['assignedLawyer', 'matter'],
    });
    
    if (!contract) {
      throw new NotFoundException(`Contract with ID "${id}" not found`);
    }
    
    return contract;
  }

  async update(id: string, updateContractDto: UpdateContractDto): Promise<Contract> {
    const updateData = {
      ...updateContractDto,
      parties: Array.isArray(updateContractDto.parties) ? updateContractDto.parties.join(',') : updateContractDto.parties,
      tags: Array.isArray(updateContractDto.tags) ? updateContractDto.tags.join(',') : updateContractDto.tags
    };
    await this.contractsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.contractsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contract with ID "${id}" not found`);
    }
  }

  async findByStatus(status: string): Promise<Contract[]> {
    return this.contractsRepository.find({
      where: { status },
      relations: ['assignedLawyer', 'matter'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByType(type: string): Promise<Contract[]> {
    return this.contractsRepository.find({
      where: { type },
      relations: ['assignedLawyer', 'matter'],
      order: { createdAt: 'DESC' },
    });
  }

  async findExpiringSoon(days: number = 30): Promise<Contract[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.contractsRepository
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.assignedLawyer', 'assignedLawyer')
      .leftJoinAndSelect('contract.matter', 'matter')
      .where('contract.expirationDate <= :futureDate', { futureDate })
      .andWhere('contract.expirationDate > :now', { now: new Date() })
      .andWhere('contract.status IN (:...statuses)', { statuses: ['executed', 'review'] })
      .orderBy('contract.expirationDate', 'ASC')
      .getMany();
  }

  async getStatistics() {
    const [total, draft, review, executed, expired] = await Promise.all([
      this.contractsRepository.count(),
      this.contractsRepository.count({ where: { status: 'draft' } }),
      this.contractsRepository.count({ where: { status: 'review' } }),
      this.contractsRepository.count({ where: { status: 'executed' } }),
      this.contractsRepository.count({ where: { status: 'expired' } }),
    ]);

    const totalValue = await this.contractsRepository
      .createQueryBuilder('contract')
      .select('SUM(contract.value)', 'sum')
      .where('contract.status = :status', { status: 'executed' })
      .getRawOne();

    return { 
      total, 
      draft, 
      review, 
      executed, 
      expired,
      totalValue: totalValue?.sum || 0
    };
  }

  async findByMatter(matterId: string): Promise<Contract[]> {
    return this.contractsRepository.find({
      where: { matterId },
      relations: ['assignedLawyer', 'matter'],
      order: { createdAt: 'DESC' },
    });
  }
}