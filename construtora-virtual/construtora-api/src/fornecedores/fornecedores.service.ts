import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Fornecedor } from './entities/fornecedore.entity';

import { CreateFornecedorDto } from './dto/create-fornecedore.dto';
import { UpdateFornecedorDto } from './dto/update-fornecedore.dto';

@Injectable()
export class FornecedoresService {

  constructor(
    @InjectRepository(Fornecedor)
    private fornecedorRepository:
    Repository<Fornecedor>
  ) {}

  create(
    createFornecedorDto:
    CreateFornecedorDto
  ) {

    const fornecedor =
      this.fornecedorRepository.create(
        createFornecedorDto
      );

    return this.fornecedorRepository.save(
      fornecedor
    );

  }

  findAll() {

    return this.fornecedorRepository.find();

  }

  findOne(id: number) {

    return this.fornecedorRepository.findOne({
      where: { id }
    });

  }

  async update(
    id: number,
    updateFornecedorDto:
    UpdateFornecedorDto
  ) {

    await this.fornecedorRepository.update(
      id,
      updateFornecedorDto
    );

    return this.findOne(id);

  }

  async remove(id: number) {

    await this.fornecedorRepository.delete(
      id
    );

    return {
      message:
      'Fornecedor removido com sucesso'
    };

  }

}