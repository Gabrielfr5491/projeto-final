import {
  Controller,
  Get
} from '@nestjs/common';

import {
  DashboardService
} from './dashboard.service';

@Controller('dashboard')
export class DashboardController {

  constructor(
    private readonly dashboardService:
    DashboardService
  ) {}

  @Get('resumo')
  resumo() {

    return this.dashboardService
      .resumo();

  }

  @Get('financeiro')
  dashboardFinanceiro() {

    return this.dashboardService
      .dashboardFinanceiro();

  }

  @Get('custos-por-obra')
  custosPorObra() {

    return this.dashboardService
      .custosPorObra();

  }

  @Get('evm')
  evm() {

    return this.dashboardService
      .evm();

  }

}

