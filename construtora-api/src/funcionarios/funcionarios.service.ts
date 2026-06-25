import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Funcionario } from './entities/funcionario.entity';

import { CreateFuncionarioDto } from './dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto';

@Injectable()
export class FuncionariosService {

  constructor(
    @InjectRepository(Funcionario)
    private funcionarioRepository:
    Repository<Funcionario>
  ) {}

  create(
    createFuncionarioDto:
    CreateFuncionarioDto
  ) {

    const funcionario =
      this.funcionarioRepository.create(
        createFuncionarioDto
      );

    return this.funcionarioRepository.save(
      funcionario
    );

  }

  findAll() {

    return this.funcionarioRepository.find();

  }

  findOne(id: number) {

    return this.funcionarioRepository.findOne({
      where: { id }
    });

  }

  async update(
    id: number,
    updateFuncionarioDto:
    UpdateFuncionarioDto
  ) {

    await this.funcionarioRepository.update(
      id,
      updateFuncionarioDto
    );

    return this.findOne(id);

  }

  async remove(id: number) {

    await this.funcionarioRepository.delete(
      id
    );

    return {
      message:
      'Funcionário removido com sucesso'
    };

  }

}