import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DiarioEntrada } from './entities/diario-entrada.entity';
import { CreateDiarioEntradaDto } from './dto/create-diario-entrada.dto';
import { UpdateDiarioEntradaDto } from './dto/update-diario-entrada.dto';

@Injectable()
export class DiarioService {

  constructor(
    @InjectRepository(DiarioEntrada)
    private diarioRepository:
    Repository<DiarioEntrada>
  ) {}

  create(dto: CreateDiarioEntradaDto) {

    const entrada =
      this.diarioRepository.create(dto);

    return this.diarioRepository.save(
      entrada
    );

  }

  findAll() {

    return this.diarioRepository.find({
      order: { data: 'DESC', id: 'DESC' }
    });

  }

  findByObra(obraId: number) {

    return this.diarioRepository.find({
      where: { obraId },
      order: { data: 'DESC', id: 'DESC' }
    });

  }

  findOne(id: number) {

    return this.diarioRepository.findOne({
      where: { id }
    });

  }

  async update(
    id: number,
    dto: UpdateDiarioEntradaDto
  ) {

    await this.diarioRepository.update(
      id,
      dto
    );

    return this.findOne(id);

  }

  async remove(id: number) {

    await this.diarioRepository.delete(id);

    return {
      message: 'Entrada removida com sucesso'
    };

  }

}
