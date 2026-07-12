import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Custo } from './entities/custo.entity';
import { CreateCustoDto } from './dto/create-custo.dto';
import { UpdateCustoDto } from './dto/update-custo.dto';
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
  'obra.orcamento',
  'obra.dataInicio',
  'obra.dataPrevista',
] as const;

@Injectable()
export class CustosService {

  constructor(
    @InjectRepository(Custo)
    private custoRepository: Repository<Custo>,
  ) {}

  create(createCustoDto: CreateCustoDto) {
    const custo = this.custoRepository.create(createCustoDto);
    return this.custoRepository.save(custo);
  }

  /**
   * Lista custos com JOIN controlado na obra (sem campos base64).
   *
   * - Sem parâmetros → retorna array simples (retrocompatível com o frontend existente)
   * - Com page/limit  → retorna envelope paginado { data, total, page, limit, totalPages }
   *
   * GET /custos
   * GET /custos?page=1&limit=20
   */
  async findAll(pagination?: PaginationDto): Promise<Custo[] | PaginatedResult<Custo>> {
    const qb = this.custoRepository
      .createQueryBuilder('custo')
      .leftJoin('custo.obra', 'obra')
      .select([
        'custo.id',
        'custo.descricao',
        'custo.categoria',
        'custo.valor',
        'custo.data',
        'custo.tipo',
        'custo.obraId',
        ...OBRA_SAFE_COLUMNS,
      ])
      .orderBy('custo.data', 'DESC')
      .addOrderBy('custo.id', 'DESC');

    // Sem paginação → array simples (mantém compatibilidade com o frontend)
    if (!pagination?.page) {
      return qb.getMany();
    }

    const { skip, take } = pagination.toQuery();
    const result = await qb.skip(skip).take(take).getManyAndCount();
    return toPaginatedResult(result, pagination);
  }

  /**
   * Lista custos de uma obra específica, sem campos base64.
   *
   * GET /custos/por-obra/42
   * GET /custos/por-obra/42?page=1&limit=20
   */
  async findByObra(
    obraId: number,
    pagination?: PaginationDto,
  ): Promise<Custo[] | PaginatedResult<Custo>> {
    const qb = this.custoRepository
      .createQueryBuilder('custo')
      .leftJoin('custo.obra', 'obra')
      .select([
        'custo.id',
        'custo.descricao',
        'custo.categoria',
        'custo.valor',
        'custo.data',
        'custo.tipo',
        'custo.obraId',
        ...OBRA_SAFE_COLUMNS,
      ])
      .where('custo.obraId = :obraId', { obraId })
      .orderBy('custo.data', 'DESC')
      .addOrderBy('custo.id', 'DESC');

    if (!pagination?.page) {
      return qb.getMany();
    }

    const { skip, take } = pagination.toQuery();
    const result = await qb.skip(skip).take(take).getManyAndCount();
    return toPaginatedResult(result, pagination);
  }

  findOne(id: number) {
    return this.custoRepository.findOne({
      where: { id },
      relations: ['obra'],
    });
  }

  async update(id: number, updateCustoDto: UpdateCustoDto) {
    await this.custoRepository.update(id, updateCustoDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.custoRepository.delete(id);
    return { message: 'Custo removido com sucesso' };
  }
}
