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
import { ThemeService } from '../../../core/services/theme.service';

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

  public chartSparkline: any;

  public chartSparklineMini: any;

  public chartRing: any;

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
    private dashboardService: DashboardService,
    private themeService: ThemeService
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

        this.carregarSparklineMini();

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
  const isDark = this.themeService.currentTheme === 'dark';
  const textColor = isDark ? '#8A8A8A' : '#6B6B6B';

  this.chartOptions = {

    series: [

      this.obrasConcluidas,

      this.obrasAndamento,

      this.obrasPlanejamento

    ],

    chart: {

      type: 'radialBar',
      height: 450,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeout',
        speed: 500
      }

    },

    labels: [

      'Concluídas',

      'Andamento',

      'Planejamento'

    ],

    // Paleta laranja/preto/cinza
    colors: [

      '#FF6B1A', // laranja principal
      '#5C5954', // cinza escuro
      '#A8A59E'  // cinza médio

    ],

    plotOptions: {

      radialBar: {

        hollow: { size: '70%' },
        track: { background: '#1A1A1A', strokeWidth: '100%' },
        dataLabels: {

          name: {
            fontSize: '14px',
            color: textColor,
            fontWeight: 500

          },

          value: {

            fontSize: '24px',
            fontWeight: 700,
            color: textColor,
            offsetY: 8

          }

        }

      }

    },
    stroke: { lineCap: 'round' },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#FFA05C'],
        stops: [0, 100]
      }
    }
  };

  // Carregar sparkline para orçamento
  this.carregarSparkline();

  // Carregar ring chart para produtividade
  this.carregarRingChart();

}


carregarGraficoFinanceiro() {
  const isDark = this.themeService.currentTheme === 'dark';
  const primaryColor = '#FF6B1A';
  const textColor = isDark ? '#8A8A8A' : '#6B6B6B';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

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
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeout',
        speed: 500
      }

    },

    stroke: {

      curve: 'smooth',

      width: 2

    },

    fill: {

      type: 'gradient',

      gradient: {

        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0,
        stops: [0, 100]

      },
      colors: [primaryColor]

    },

    markers: {

      size: 0,
      hover: {
        size: 4
      }

    },

    colors: ['#FF6B1A'],

    xaxis: {

      categories: [

        'Receitas',

        'Despesas',

        'Lucro'

      ],
      labels: {
        style: {
          colors: textColor,
          fontSize: '11px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: textColor,
          fontSize: '11px'
        }
      }
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 3
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      style: {
        fontSize: '12px'
      },
      x: {
        show: false
      },
      marker: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    }
  };

}


public chartKpi: any;

carregarGraficoKpi() {
  const isDark = this.themeService.currentTheme === 'dark';
  const primaryColor = '#FF6B1A';
  const textColor = isDark ? '#8A8A8A' : '#6B6B6B';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

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
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeout',
        speed: 500
      }
    },

    plotOptions: {

      bar: {

        horizontal: true,
        borderRadius: 4,
        borderRadiusApplication: 'end',
        columnWidth: '45%'

      }

    },

    colors: ['#FF6B1A'],

    xaxis: {

      categories: [

        'Funcionários',

        'Fornecedores',

        'Materiais',

        'Equipamentos'

      ],
      labels: {
        style: {
          colors: textColor,
          fontSize: '11px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: textColor,
          fontSize: '11px'
        }
      }
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 3
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      style: {
        fontSize: '12px'
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    }
  };

}

  chartCustosCategoria: any;

  carregarGraficoCustosCategoria(
  dados: any
) {
  const isDark = this.themeService.currentTheme === 'dark';
  const textColor = isDark ? '#8A8A8A' : '#6B6B6B';

  const categorias =
    Object.keys(
      dados.custosPorCategoria
    );

  const valores =
    Object.values(
      dados.custosPorCategoria
    );

  // Paleta laranja/cinza para donut
  const donutColors = [
    '#FF6B1A', // laranja principal
    '#E55A0F', // laranja escuro
    '#FFA36D', // laranja claro
    '#5C5954', // cinza escuro
    '#A8A59E', // cinza médio
    '#7A7770'  // cinza mais claro
  ];

  this.chartCustosCategoria = {

    series: valores,

    chart: {

      type: 'donut',
      height: 500,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeout',
        speed: 500
      }

    },

    labels: categorias,

    colors: donutColors,

    legend: {

      position: 'bottom',
      fontSize: '12px',
      labels: {
        colors: '#8A8A8A'
      },
      markers: {
        width: 8,
        height: 8
      }

    },

    stroke: {

      width: 2,
      colors: ['#0D0D0D'],
      lineCap: 'round'

    },

    dataLabels: {

      enabled: false

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
              color: textColor,
              fontSize: '14px',
              fontWeight: 500,
              formatter: () =>

                'R$ ' +

                Number(
                  dados.totalCustos
                ).toLocaleString(
                  'pt-BR'
                )

            },
            value: {
              color: textColor,
              fontSize: '24px',
              fontWeight: 700
            }

          }

        }

      }

    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      style: {
        fontSize: '12px'
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

  get produtividadeGeral(): number {
    return this.totalObras > 0 
      ? Math.round((this.obrasConcluidas / this.totalObras) * 100) 
      : 0;
  }

  // Sparkline para orçamento consolidado
  carregarSparkline() {
    const isDark = this.themeService.currentTheme === 'dark';
    const primaryColor = '#FF6B1A';
    const gradientColor = '#FFA05C';
    
    // Dados simulados de tendência (6 meses)
    const tendencia = [
      this.orcamentoTotal * 0.85,
      this.orcamentoTotal * 0.88,
      this.orcamentoTotal * 0.90,
      this.orcamentoTotal * 0.92,
      this.orcamentoTotal * 0.95,
      this.orcamentoTotal
    ];

    this.chartSparkline = {
      series: [{
        name: 'Orçamento',
        data: tendencia
      }],
      chart: {
        type: 'area',
        height: 60,
        sparkline: { enabled: true },
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 500
        }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0,
          stops: [0, 100]
        },
        colors: [primaryColor]
      },
      colors: [primaryColor],
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        x: { show: false },
        marker: { show: false }
      },
      grid: { show: false }
    };
  }

  // Mini sparkline para cards numéricos
  carregarSparklineMini() {
    const isDark = this.themeService.currentTheme === 'dark';
    const primaryColor = '#FF6B1A';
    
    // Dados simulados de tendência (5 pontos)
    const tendencia = [12, 15, 13, 18, this.resumo.receitas || 0];

    this.chartSparklineMini = {
      series: [{
        name: 'Tendência',
        data: tendencia
      }],
      chart: {
        type: 'line',
        height: 30,
        sparkline: { enabled: true },
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 500
        }
      },
      stroke: {
        curve: 'smooth',
        width: 1.5
      },
      colors: [primaryColor],
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        x: { show: false },
        marker: { show: false }
      },
      grid: { show: false }
    };
  }

  // Ring chart para produtividade geral
  carregarRingChart() {
    const isDark = this.themeService.currentTheme === 'dark';
    const trackColor = isDark ? '#1A1A1A' : '#E8E6E1';
    const textColor = isDark ? '#FAFAF7' : '#121212';
    const primaryColor = '#FF6B1A';
    const gradientColor = '#FFA05C';

    this.chartRing = {
      series: [this.produtividadeGeral],
      chart: {
        type: 'radialBar',
        height: 180,
        toolbar: { show: false },
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 500
        }
      },
      plotOptions: {
        radialBar: {
          hollow: { size: '70%' },
          track: { background: trackColor, strokeWidth: '100%' },
          dataLabels: {
            name: { show: false },
            value: {
              color: textColor,
              fontSize: '28px',
              fontWeight: 700,
              offsetY: 8,
              formatter: (val: number) => `${val}%`
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: [gradientColor],
          stops: [0, 100]
        }
      },
      stroke: { lineCap: 'round' },
      colors: [primaryColor]
    };
  }

}

