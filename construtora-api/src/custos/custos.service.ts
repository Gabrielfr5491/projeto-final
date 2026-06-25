import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Custo } from './entities/custo.entity';

import { CreateCustoDto } from './dto/create-custo.dto';
import { UpdateCustoDto } from './dto/update-custo.dto';

@Injectable()
export class CustosService {

  constructor(
    @InjectRepository(Custo)
    private custoRepository:
    Repository<Custo>
  ) {}

  create(createCustoDto: CreateCustoDto) {

    const custo =
      this.custoRepository.create(
        createCustoDto
      );

    return this.custoRepository.save(
      custo
    );

  }

  findAll() {

    return this.custoRepository.find();

  }

  findOne(id: number) {

    return this.custoRepository.findOne({
      where: { id }
    });

  }

  async update(
    id: number,
    updateCustoDto: UpdateCustoDto
  ) {

    await this.custoRepository.update(
      id,
      updateCustoDto
    );

    return this.findOne(id);

  }

  async remove(id: number) {

    await this.custoRepository.delete(id);

    return {
      message:
      'Custo removido com sucesso'
    };

  }

}