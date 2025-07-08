import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Matter } from './entities/matter.entity';
import { CreateMatterDto } from './dto/create-matter.dto';
import { UpdateMatterDto } from './dto/update-matter.dto';

@Injectable()
export class MattersService {
  constructor(
    @InjectRepository(Matter)
    private mattersRepository: Repository<Matter>,
  ) {}

  async create(createMatterDto: CreateMatterDto): Promise<Matter> {
    const matter = this.mattersRepository.create({
      ...createMatterDto,
      tags: Array.isArray(createMatterDto.tags) ? createMatterDto.tags.join(',') : createMatterDto.tags
    });
    return this.mattersRepository.save(matter);
  }

  async findAll(): Promise<Matter[]> {
    return this.mattersRepository.find({
      relations: ['assignedLawyer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Matter> {
    const matter = await this.mattersRepository.findOne({
      where: { id },
      relations: ['assignedLawyer'],
    });
    
    if (!matter) {
      throw new NotFoundException(`Matter with ID "${id}" not found`);
    }
    
    return matter;
  }

  async update(id: string, updateMatterDto: UpdateMatterDto): Promise<Matter> {
    const updateData = {
      ...updateMatterDto,
      tags: Array.isArray(updateMatterDto.tags) ? updateMatterDto.tags.join(',') : updateMatterDto.tags,
      customFields: typeof updateMatterDto.customFields === 'object' ? JSON.stringify(updateMatterDto.customFields) : updateMatterDto.customFields
    };
    await this.mattersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.mattersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Matter with ID "${id}" not found`);
    }
  }

  async findByClient(clientName: string): Promise<Matter[]> {
    return this.mattersRepository.find({
      where: { clientName },
      relations: ['assignedLawyer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string): Promise<Matter[]> {
    return this.mattersRepository.find({
      where: { status },
      relations: ['assignedLawyer'],
      order: { createdAt: 'DESC' },
    });
  }

  async getStatistics() {
    const [total, active, pending, closed] = await Promise.all([
      this.mattersRepository.count(),
      this.mattersRepository.count({ where: { status: 'active' } }),
      this.mattersRepository.count({ where: { status: 'pending' } }),
      this.mattersRepository.count({ where: { status: 'closed' } }),
    ]);

    return { total, active, pending, closed };
  }
}