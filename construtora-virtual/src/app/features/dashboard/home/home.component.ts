import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels
} from 'ng-apexcharts';

import { ObraService } from '../../../core/services/obra.service';
import { DashboardService } from '../../../core/services/dashboard.service';

import { Obra } from '../../../models/obra';

registerLocaleData(localePt);

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    }
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  obras: Obra[] = [];

  public chartOptions: any;

  public chartFinanceiro: any;

  collapsed = false;

  resumo: any = {

    obras: 0,

    funcionarios: 0,

    fornecedores: 0,

    materiais: 0,

    equipamentos: 0,

    receitas: 0,

    despesas: 0,

    lucro: 0

  };

  constructor(
    private obraService: ObraService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {

    this.obraService
      .listar()
      .subscribe({

        next: (dados) => {

          this.obras = dados;

          this.carregarGrafico();

        },

        error: (erro) => {

          console.error(
            'Erro ao carregar obras',
            erro
          );

        }

      });

    this.dashboardService
    .resumo()
    .subscribe({

      next: (dados) => {

        this.resumo = dados;

        this.carregarGraficoFinanceiro();

        this.carregarGraficoKpi();

      },

      error: (erro) => {

        console.error(
          'Erro ao carregar dashboard',
          erro
        );

      }

    });


    this.dashboardService
  .financeiro()
  .subscribe({

    next: (dados) => {

      this.carregarGraficoCustosCategoria(
        dados
      );

    },

    error: (erro) => {

      console.error(
        erro
      );

    }

  });

  }

  


carregarGrafico() {

  this.chartOptions = {

    series: [

      this.obrasConcluidas,

      this.obrasAndamento,

      this.obrasPlanejamento

    ],

    chart: {

      type: 'radialBar',

      height: 450

    },

    labels: [

      'Concluídas',

      'Andamento',

      'Planejamento'

    ],

    colors: [

      '#22c55e',

      '#3b82f6',

      '#f59e0b'

    ],

    plotOptions: {

      radialBar: {

        hollow: {

          size: '30%'

        },

        dataLabels: {

          name: {

            fontSize: '16px'

          },

          value: {

            fontSize: '24px',

            fontWeight: 700

          }

        }

      }

    }

  };

}


carregarGraficoFinanceiro() {

  this.chartFinanceiro = {

    series: [

      {

        name: 'Financeiro',

        data: [

          this.resumo.receitas,

          this.resumo.despesas,

          this.resumo.lucro

        ]

      }

    ],

    chart: {

      type: 'area',

      height: 450,

      toolbar: {

        show: false

      }

    },

    stroke: {

      curve: 'smooth',

      width: 5

    },

    fill: {

      type: 'gradient',

      gradient: {

        shadeIntensity: 1,

        opacityFrom: .7,

        opacityTo: .1

      }

    },

    markers: {

      size: 8

    },

    colors: [

      '#2563eb'

    ],

    xaxis: {

      categories: [

        'Receitas',

        'Despesas',

        'Lucro'

      ]

    }

  };

}


public chartKpi: any;

carregarGraficoKpi() {

  this.chartKpi = {

    series: [

      {

        name: 'Quantidade',

        data: [

          this.resumo.funcionarios,

          this.resumo.fornecedores,

          this.resumo.materiais,

          this.resumo.equipamentos

        ]

      }

    ],

    chart: {

      type: 'bar',

      height: 450,

      toolbar: {

        show: false

      }

    },

    plotOptions: {

      bar: {

        horizontal: true,

        borderRadius: 10

      }

    },

    colors: [

      '#6366f1'

    ],

    xaxis: {

      categories: [

        'Funcionários',

        'Fornecedores',

        'Materiais',

        'Equipamentos'

      ]

    }

  };

}

  chartCustosCategoria: any;

  carregarGraficoCustosCategoria(
  dados: any
) {

  const categorias =
    Object.keys(
      dados.custosPorCategoria
    );

  const valores =
    Object.values(
      dados.custosPorCategoria
    );

  this.chartCustosCategoria = {

    series: valores,

    chart: {

      type: 'donut',

      height: 500

    },

    labels: categorias,

    colors: [

      '#2563eb',
      '#22c55e',
      '#f59e0b',
      '#ef4444',
      '#8b5cf6',
      '#06b6d4'

    ],

    legend: {

      position: 'bottom',

      fontSize: '16px'

    },

    stroke: {

      width: 3

    },

    dataLabels: {

      enabled: true

    },

    plotOptions: {

      pie: {

        donut: {

          size: '70%',

          labels: {

            show: true,

            total: {

              show: true,

              label: 'Total',

              formatter: () =>

                'R$ ' +

                Number(
                  dados.totalCustos
                ).toLocaleString(
                  'pt-BR'
                )

            }

          }

        }

      }

    }

  };

}





  get totalObras() {

    return this.obras.length;

  }

  get obrasPlanejamento() {

    return this.obras
      .filter(
        o => o.status === 'Planejamento'
      )
      .length;

  }

  get obrasConcluidas() {

    return this.obras
      .filter(
        o =>
          o.status === 'Concluída' ||
          o.status === 'Concluido'
      )
      .length;

  }

  get obrasAndamento() {

    return this.obras
      .filter(
        o =>
          o.status === 'Em andamento' ||
          o.status === 'Em Andamento'
      )
      .length;

  }

  get orcamentoTotal() {

    return this.obras.reduce(

      (total, obra) =>

        total +
        Number(obra.orcamento),

      0

    );

  }

}

