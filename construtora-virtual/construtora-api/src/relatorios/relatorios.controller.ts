import {
  Controller,
  Get
} from '@nestjs/common';

import {
  RelatoriosService
} from './relatorios.service';

@Controller('relatorios')
export class RelatoriosController {

  constructor(

    private readonly relatoriosService:
    RelatoriosService

  ) {}

  @Get('custos-obra')
  custosPorObra() {

    return this.relatoriosService
      .custosPorObra();

  }

}