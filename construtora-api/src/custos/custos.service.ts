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
   * Lista custos com paginação e JOIN controlado na obra.
   * Nunca traz os campos base64 da Obra — apenas as colunas necessárias para exibição.
   *
   * GET /custos?page=1&limit=20
   */
  async findAll(pagination: PaginationDto): Promise<PaginatedResult<Custo>> {
    const { skip, take } = pagination.toQuery();

    const result = await this.custoRepository
      .createQueryBuilder('custo')
      .leftJoin('custo.obra', 'obra')
      // Seleciona só as colunas necessárias do custo
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
      .addOrderBy('custo.id', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return toPaginatedResult(result, pagination);
  }

  /**
   * Lista custos de uma obra específica, também sem base64.
   */
  async findByObra(obraId: number, pagination: PaginationDto): Promise<PaginatedResult<Custo>> {
    const { skip, take } = pagination.toQuery();

    const result = await this.custoRepository
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
      .addOrderBy('custo.id', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return toPaginatedResult(result, pagination);
  }

  findOne(id: number) {
    // findOne pode trazer o objeto completo — é chamado pontualmente
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
