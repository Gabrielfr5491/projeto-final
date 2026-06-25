import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';

import { CustosService } from './custos.service';

import { CreateCustoDto } from './dto/create-custo.dto';
import { UpdateCustoDto } from './dto/update-custo.dto';

@Controller('custos')
export class CustosController {

  constructor(
    private readonly custosService:
    CustosService
  ) {}

  @Post()
  create(
    @Body()
    createCustoDto:
    CreateCustoDto
  ) {

    return this.custosService.create(
      createCustoDto
    );

  }

  @Get()
  findAll() {

    return this.custosService.findAll();

  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string
  ) {

    return this.custosService.findOne(
      +id
    );

  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateCustoDto:
    UpdateCustoDto
  ) {

    return this.custosService.update(
      +id,
      updateCustoDto
    );

  }

  @Delete(':id')
  remove(
    @Param('id')
    id: string
  ) {

    return this.custosService.remove(
      +id
    );

  }

}