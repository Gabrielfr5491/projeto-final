import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Material } from './entities/materiai.entity';

import { CreateMaterialDto } from './dto/create-materiai.dto';
import { UpdateMaterialDto } from './dto/update-materiai.dto';

@Injectable()
export class MateriaisService {

  constructor(
    @InjectRepository(Material)
    private materialRepository: Repository<Material>
  ) {}

  create(createMaterialDto: CreateMaterialDto) {

    const material =
      this.materialRepository.create(
        createMaterialDto
      );

    return this.materialRepository.save(
      material
    );

  }

  findAll() {
    return this.materialRepository.find();
  }

  findOne(id: number) {

    return this.materialRepository.findOne({
      where: { id }
    });

  }

  async update(
    id: number,
    updateMaterialDto: UpdateMaterialDto
  ) {

    await this.materialRepository.update(
      id,
      updateMaterialDto
    );

    return this.findOne(id);

  }

  async remove(id: number) {

    await this.materialRepository.delete(id);

    return {
      message: 'Material removido com sucesso'
    };

  }

}