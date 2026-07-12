import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Obra } from './entities/obra.entity';
import { CreateObraDto } from './dto/create-obra.dto';
import { UpdateObraDto } from './dto/update-obra.dto';

// Colunas seguras para listagem — exclui campos base64 pesados
const OBRA_LIST_COLUMNS: (keyof Obra)[] = [
  'id',
  'nome',
  'endereco',
  'cidade',
  'estado',
  'dataInicio',
  'dataPrevista',
  'status',
  'orcamento',
  'modelo3dNome',
  'modelo3dFormato',
  'mapaEletricistaNome',
  'pdfClausulasNome',
];

@Injectable()
export class ObrasService {

  constructor(
    @InjectRepository(Obra)
    private obraRepository: Repository<Obra>,
  ) {}

  create(createObraDto: CreateObraDto) {
    const obra = this.obraRepository.create(createObraDto);
    return this.obraRepository.save(obra);
  }

  /**
   * Listagem sem os campos base64 (modelo3d, mapaEletricista, pdfClausulas).
   * O frontend de listagem nunca precisa desses dados — apenas o detalhe da obra.
   */
  findAll() {
    return this.obraRepository
      .createQueryBuilder('obra')
      .select(OBRA_LIST_COLUMNS.map(c => `obra.${c}`))
      .getMany();
  }

  /**
   * Detalhe completo — inclui os campos base64 para exibição do modelo 3D,
   * mapa elétrico e PDF de cláusulas.
   */
  findOne(id: number) {
    return this.obraRepository.findOne({ where: { id } });
  }

  async update(id: number, updateObraDto: UpdateObraDto) {
    await this.obraRepository.update(id, updateObraDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.obraRepository.delete(id);
    return { message: 'Obra removida com sucesso' };
  }
}
