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

import { CustosService } from './custos.service';
import { CreateCustoDto } from './dto/create-custo.dto';
import { UpdateCustoDto } from './dto/update-custo.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('custos')
export class CustosController {

  constructor(private readonly custosService: CustosService) {}

  @Post()
  create(@Body() createCustoDto: CreateCustoDto) {
    return this.custosService.create(createCustoDto);
  }

  /**
   * GET /custos            → array completo (retrocompatível)
   * GET /custos?page=1&limit=20 → resposta paginada
   */
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.custosService.findAll(pagination);
  }

  /**
   * GET /custos/por-obra/42            → array completo
   * GET /custos/por-obra/42?page=1&limit=20 → paginado
   */
  @Get('por-obra/:obraId')
  findByObra(
    @Param('obraId') obraId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.custosService.findByObra(+obraId, pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.custosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustoDto: UpdateCustoDto) {
    return this.custosService.update(+id, updateCustoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.custosService.remove(+id);
  }
}
