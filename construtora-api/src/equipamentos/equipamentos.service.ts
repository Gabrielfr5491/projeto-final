import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Equipamento } from './entities/equipamento.entity';

import { CreateEquipamentoDto } from './dto/create-equipamento.dto';
import { UpdateEquipamentoDto } from './dto/update-equipamento.dto';

@Injectable()
export class EquipamentosService {

  constructor(
    @InjectRepository(Equipamento)
    private equipamentoRepository:
    Repository<Equipamento>
  ) {}

  create(
    createEquipamentoDto:
    CreateEquipamentoDto
  ) {

    const equipamento =
      this.equipamentoRepository.create(
        createEquipamentoDto
      );

    return this.equipamentoRepository.save(
      equipamento
    );

  }

  findAll() {

    return this.equipamentoRepository.find();

  }

  findOne(id: number) {

    return this.equipamentoRepository.findOne({
      where: { id }
    });

  }

  async update(
    id: number,
    updateEquipamentoDto:
    UpdateEquipamentoDto
  ) {

    await this.equipamentoRepository.update(
      id,
      updateEquipamentoDto
    );

    return this.findOne(id);

  }

  async remove(id: number) {

    await this.equipamentoRepository.delete(
      id
    );

    return {
      message:
      'Equipamento removido com sucesso'
    };

  }

}