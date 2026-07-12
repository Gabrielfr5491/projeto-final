import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { DiarioService } from './diario.service';
import { CreateDiarioEntradaDto } from './dto/create-diario-entrada.dto';
import { UpdateDiarioEntradaDto } from './dto/update-diario-entrada.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('diario')
export class DiarioController {

  constructor(private readonly diarioService: DiarioService) {}

  @Post()
  create(@Body() dto: CreateDiarioEntradaDto) {
    return this.diarioService.create(dto);
  }

  /**
   * GET /diario            → array completo (retrocompatível)
   * GET /diario?page=1&limit=20 → resposta paginada
   */
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.diarioService.findAll(pagination);
  }

  /**
   * GET /diario/obra/42            → array completo
   * GET /diario/obra/42?page=1&limit=20 → paginado
   */
  @Get('obra/:obraId')
  findByObra(
    @Param('obraId') obraId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.diarioService.findByObra(+obraId, pagination);
  }

  /** GET /diario/123 — detalhe completo com descricao */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDiarioEntradaDto) {
    return this.diarioService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diarioService.remove(+id);
  }
}
