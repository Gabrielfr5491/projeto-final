import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';

import { DiarioService } from './diario.service';
import { CreateDiarioEntradaDto } from './dto/create-diario-entrada.dto';
import { UpdateDiarioEntradaDto } from './dto/update-diario-entrada.dto';

@Controller('diario')
export class DiarioController {

  constructor(
    private readonly diarioService: DiarioService
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateDiarioEntradaDto
  ) {

    return this.diarioService.create(dto);

  }

  @Get()
  findAll() {

    return this.diarioService.findAll();

  }

  @Get('obra/:obraId')
  findByObra(
    @Param('obraId')
    obraId: string
  ) {

    return this.diarioService.findByObra(
      +obraId
    );

  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string
  ) {

    return this.diarioService.findOne(+id);

  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateDiarioEntradaDto
  ) {

    return this.diarioService.update(
      +id,
      dto
    );

  }

  @Delete(':id')
  remove(
    @Param('id')
    id: string
  ) {

    return this.diarioService.remove(+id);

  }

}
