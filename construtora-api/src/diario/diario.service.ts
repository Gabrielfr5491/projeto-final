import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DiarioEntrada } from './entities/diario-entrada.entity';
import { CreateDiarioEntradaDto } from './dto/create-diario-entrada.dto';
import { UpdateDiarioEntradaDto } from './dto/update-diario-entrada.dto';
import {
  PaginationDto,
  PaginatedResult,
  toPaginatedResult,
} from '../common/dto/pagination.dto';

// Colunas leves da obra — exclui modelo3dBase64, mapaEletricistaBase64, pdfClausulasBase64
const OBRA_SAFE_COLUMNS = [
  'obra.id',
  'obra.nome',
  'obra.cidade',
  'obra.estado',
  'obra.status',
] as const;

@Injectable()
export class DiarioService {

  constructor(
    @InjectRepository(DiarioEntrada)
    private diarioRepository: Repository<DiarioEntrada>,
  ) {}

  create(dto: CreateDiarioEntradaDto) {
    const entrada = this.diarioRepository.create(dto);
    return this.diarioRepository.save(entrada);
  }

  /**
   * Lista entradas do diário com paginação.
   * A coluna `descricao` (text longo) é omitida na listagem —
   * o frontend deve buscar o texto completo apenas no findOne.
   *
   * GET /diario?page=1&limit=20
   */
  async findAll(pagination: PaginationDto): Promise<PaginatedResult<DiarioEntrada>> {
    const { skip, take } = pagination.toQuery();

    const result = await this.diarioRepository
      .createQueryBuilder('entrada')
      .leftJoin('entrada.obra', 'obra')
      // descricao (text) é excluída da listagem — carregada só no detalhe
      .select([
        'entrada.id',
        'entrada.titulo',
        'entrada.data',
        'entrada.autor',
        'entrada.obraId',
        'entrada.createdAt',
        ...OBRA_SAFE_COLUMNS,
      ])
      .orderBy('entrada.data', 'DESC')
      .addOrderBy('entrada.id', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return toPaginatedResult(result, pagination);
  }

  /**
   * Lista entradas de uma obra específica com paginação.
   */
  async findByObra(obraId: number, pagination: PaginationDto): Promise<PaginatedResult<DiarioEntrada>> {
    const { skip, take } = pagination.toQuery();

    const result = await this.diarioRepository
      .createQueryBuilder('entrada')
      .leftJoin('entrada.obra', 'obra')
      .select([
        'entrada.id',
        'entrada.titulo',
        'entrada.data',
        'entrada.autor',
        'entrada.obraId',
        'entrada.createdAt',
        ...OBRA_SAFE_COLUMNS,
      ])
      .where('entrada.obraId = :obraId', { obraId })
      .orderBy('entrada.data', 'DESC')
      .addOrderBy('entrada.id', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return toPaginatedResult(result, pagination);
  }

  /**
   * Detalhe completo — traz descricao e obra completa (sem base64).
   */
  findOne(id: number) {
    return this.diarioRepository
      .createQueryBuilder('entrada')
      .leftJoin('entrada.obra', 'obra')
      .select([
        'entrada.id',
        'entrada.titulo',
        'entrada.descricao', // texto completo só no detalhe
        'entrada.data',
        'entrada.autor',
        'entrada.obraId',
        'entrada.createdAt',
        'entrada.updatedAt',
        'obra.id',
        'obra.nome',
        'obra.cidade',
        'obra.estado',
        'obra.status',
      ])
      .where('entrada.id = :id', { id })
      .getOne();
  }

  async update(id: number, dto: UpdateDiarioEntradaDto) {
    await this.diarioRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.diarioRepository.delete(id);
    return { message: 'Entrada removida com sucesso' };
  }
}
