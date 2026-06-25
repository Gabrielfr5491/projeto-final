import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Obra } from './entities/obra.entity';

import { CreateObraDto } from './dto/create-obra.dto';
import { UpdateObraDto } from './dto/update-obra.dto';

@Injectable()
export class ObrasService {

  constructor(
    @InjectRepository(Obra)
    private obraRepository: Repository<Obra>,
  ) {}

  create(createObraDto: CreateObraDto) {

    const obra =
      this.obraRepository.create(
        createObraDto
      );

    return this.obraRepository.save(
      obra
    );
  }

  findAll() {

    return this.obraRepository.find();

  }

  findOne(id: number) {

    return this.obraRepository.findOne({
      where: { id }
    });

  }

  async update(
    id: number,
    updateObraDto: UpdateObraDto
  ) {

    await this.obraRepository.update(
      id,
      updateObraDto
    );

    return this.findOne(id);

  }

  async remove(id: number) {

    await this.obraRepository.delete(id);

    return {
      message: 'Obra removida com sucesso'
    };

  }

}