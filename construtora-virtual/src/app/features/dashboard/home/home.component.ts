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
  public chartEVM: any;
  public evmSeries: { pv: number[]; ev: number[]; ac: number[] } | null = null;
  public custosObraData: {
    obras: string[];
    entradas: number[];
    saidas: number[];
    totais: number[];
  } | null = null;

  public chartSparkline: any;
  public chartSparklineMini: any;
  public chartRing: any;
  public chartCustosCategoria: any;

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

    // Obras — independente, nunca bloqueia os outros
    this.obraService.listar().subscribe({
      next: (dados) => {
        this.obras = dados;
        this.carregarGrafico();
      },
      error: (erro) => {
        console.error('Erro ao carregar obras', erro);
      }
    });

    // Resumo — independente
    this.dashboardService.resumo().subscribe({
      next: (dados) => {
        this.resumo = dados;
        this.carregarSparklineMini();
      },
      error: (erro) => {
        console.error('Erro ao carregar resumo', erro);
      }
    });

    // Financeiro (donut) — independente
    this.dashboardService.financeiro().subscribe({
      next: (dados) => {
        this.carregarGraficoCustosCategoria(dados);
      },
      error: (erro) => {
        console.error('Erro ao carregar financeiro', erro);
      }
    });

    // EVM — dados reais do banco (PV, AC, EV por mês)
    this.dashboardService.evm().subscribe({
      next: (dados) => {
        this.evmSeries = { pv: dados.pv, ev: dados.ev, ac: dados.ac };
        this.carregarGraficoEVM(dados);
      },
      error: (erro) => {
        console.error('Erro ao carregar EVM', erro);
      }
    });

    // Custos por obra — ainda usado para outros fins futuros
    this.dashboardService.custosPorObra().subscribe({
      next: (dados) => {
        this.custosObraData = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar custos por obra', erro);
      }
    });

  }

  carregarGrafico() {
    const isDark = this.themeService.currentTheme === 'dark';
    const textColor = isDark ? '#C8C5BE' : '#4A4845';
    const trackColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

    const total = this.totalObras || 1;
    const concluidas = Math.round((this.obrasConcluidas / total) * 100);
    const andamento = Math.round((this.obrasAndamento / total) * 100);
    const planejamento = Math.round((this.obrasPlanejamento / total) * 100);

    this.chartOptions = {
      series: [concluidas, andamento, planejamento],
      chart: {
        type: 'radialBar',
        height: 380,
        toolbar: { show: false },
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 900,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 500 }
        }
      },
      labels: ['Concluídas', 'Em Andamento', 'Planejamento'],
      colors: ['#FF6B1A', '#A855F7', '#06B6D4'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          gradientToColors: ['#FFA05C', '#C084FC', '#67E8F9'],
          stops: [0, 100]
        }
      },
      stroke: { lineCap: 'round', width: 0 },
      plotOptions: {
        radialBar: {
          hollow: { size: '30%', background: 'transparent', margin: 5 },
          track: {
            background: trackColor,
            strokeWidth: '100%',
            margin: 8,
            dropShadow: { enabled: false }
          },
          dataLabels: {
            name: {
              fontSize: '13px',
              color: textColor,
              fontWeight: 600,
              offsetY: -8
            },
            value: {
              fontSize: '22px',
              fontWeight: 800,
              color: textColor,
              offsetY: 4,
              formatter: (val: number) => `${val}%`
            },
            total: {
              show: true,
              label: 'Produtividade',
              color: textColor,
              fontSize: '11px',
              fontWeight: 600,
              formatter: () => `${this.produtividadeGeral}%`
            }
          }
        }
      },
      legend: { show: false }
    };

    this.carregarSparkline();
    this.carregarRingChart();
  }

  get obraComMaiorCusto(): string {
    if (!this.custosObraData || !this.custosObraData.obras.length) return '—';
    const idx = this.custosObraData.totais.indexOf(
      Math.max(...this.custosObraData.totais)
    );
    return this.custosObraData.obras[idx] ?? '—';
  }

  get totalCustoReal(): number {
    if (!this.custosObraData) return 0;
    return this.custosObraData.totais.reduce((a, b) => a + b, 0);
  }

  // SPI: Schedule Performance Index = EV / PV (>1 adiantado, <1 atrasado)
  get spi(): number {
    if (!this.evmSeries) return 0;
    const ev = this.evmSeries.ev;
    const pv = this.evmSeries.pv;
    const last = ev.length - 1;
    return pv[last] > 0 ? +(ev[last] / pv[last]).toFixed(2) : 0;
  }

  // CPI: Cost Performance Index = EV / AC (>1 abaixo do custo, <1 estourado)
  get cpi(): number {
    if (!this.evmSeries) return 0;
    const ev = this.evmSeries.ev;
    const ac = this.evmSeries.ac;
    const last = ev.length - 1;
    return ac[last] > 0 ? +(ev[last] / ac[last]).toFixed(2) : 0;
  }

  carregarGraficoEVM(dados: {
    meses: string[];
    pv: number[];
    ac: number[];
    ev: number[];
  }) {
    const isDark    = this.themeService.currentTheme === 'dark';
    const textColor = isDark ? '#C8C5BE' : '#4A4845';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

    // Sem dados: não renderizar
    if (!dados.meses.length) {
      this.chartEVM = null;
      return;
    }

    // Atualizar evmSeries com dados reais para SPI/CPI
    this.evmSeries = { pv: dados.pv, ev: dados.ev, ac: dados.ac };

    // Índice do mês "atual" = último mês com AC > 0 (mês com custo real)
    let idxAtual = dados.ac.length - 1;
    for (let i = dados.ac.length - 1; i >= 0; i--) {
      if (dados.ac[i] > 0) { idxAtual = i; break; }
    }
    const mesAtual = dados.meses[idxAtual] ?? dados.meses[dados.meses.length - 1];

    const fmt = (val: number) => {
      if (val >= 1_000_000) return 'R$ ' + (val / 1_000_000).toFixed(2) + 'M';
      if (val >= 1_000)     return 'R$ ' + (val / 1_000).toFixed(0) + 'k';
      return 'R$ ' + val.toLocaleString('pt-BR');
    };

    this.chartEVM = {
      series: [
        { name: 'Custo Real (AC)', data: dados.ac },
        { name: 'Previsto (PV)',   data: dados.pv },
        { name: 'Realizado (EV)',  data: dados.ev }
      ],

      chart: {
        type: 'area',
        height: 360,
        toolbar: { show: false },
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000,
          animateGradually: { enabled: true, delay: 150 },
          dynamicAnimation: { enabled: true, speed: 500 }
        }
      },

      // AC = laranja (cor primária do site), PV = cinza, EV = âmbar tracejado
      colors: ['#FF6B1A', '#94A3B8', '#F59E0B'],

      stroke: {
        curve: 'smooth',
        width: [2.5, 2, 2],
        dashArray: [0, 0, 6]
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0.4,
          opacityFrom: [0.28, 0.12, 0.08],
          opacityTo:   [0.02, 0.02, 0.02],
          stops: [0, 90]
        }
      },

      markers: {
        size: [5, 0, 4],
        colors: ['#FF6B1A', '#94A3B8', '#F59E0B'],
        strokeColors: isDark ? '#1C1C1C' : '#FFFFFF',
        strokeWidth: 2.5,
        hover: { size: 7 }
      },

      xaxis: {
        categories: dados.meses,
        labels: {
          style: { colors: textColor, fontSize: '12px', fontWeight: 600 },
          rotate: dados.meses.length > 8 ? -35 : 0
        },
        axisBorder: { show: false },
        axisTicks:  { show: false },
        crosshairs: {
          stroke: { color: '#FF6B1A', width: 1.5, dashArray: 4 }
        }
      },

      yaxis: {
        labels: {
          style: { colors: textColor, fontSize: '11px' },
          formatter: fmt
        }
      },

      grid: {
        borderColor: gridColor,
        strokeDashArray: 4,
        padding: { left: 8, right: 8 }
      },

      legend: {
        position: 'bottom',
        fontSize: '12px',
        fontWeight: 700,
        offsetY: 6,
        labels: { colors: textColor, useSeriesColors: true },
        markers: { width: 28, height: 4, radius: 2 },
        itemMargin: { horizontal: 16, vertical: 4 }
      },

      tooltip: {
        theme: isDark ? 'dark' : 'light',
        shared: true,
        intersect: false,
        style: { fontSize: '13px' },
        y: { formatter: (val: number) => 'R$ ' + val.toLocaleString('pt-BR') }
      },

      dataLabels: { enabled: false },

      annotations: {
        xaxis: [{
          x: mesAtual,
          borderColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)',
          borderWidth: 1.5,
          strokeDashArray: 4,
          label: {
            text: 'Atual',
            style: {
              color: textColor,
              background: isDark ? '#2A2A2A' : '#F8F7F5',
              fontSize: '10px',
              fontWeight: 700
            }
          }
        }]
      }
    };
  }

  carregarGraficoCustosCategoria(dados: any) {
    const isDark = this.themeService.currentTheme === 'dark';
    const textColor = isDark ? '#C8C5BE' : '#4A4845';
    const bgCard = isDark ? '#1C1C1C' : '#FFFFFF';

    const categorias = Object.keys(dados.custosPorCategoria);
    const valores = Object.values(dados.custosPorCategoria);

    const donutColors = [
      '#FF6B1A', '#A855F7', '#06B6D4',
      '#10B981', '#F59E0B', '#EF4444'
    ];

    this.chartCustosCategoria = {
      series: valores,
      chart: {
        type: 'donut',
        height: 380,
        toolbar: { show: false },
        background: 'transparent',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 900,
          animateGradually: { enabled: true, delay: 100 },
          dynamicAnimation: { enabled: true, speed: 500 }
        }
      },
      labels: categorias,
      colors: donutColors,
      legend: {
        position: 'bottom',
        fontSize: '13px',
        fontWeight: 600,
        offsetY: 8,
        labels: { colors: textColor, useSeriesColors: false },
        markers: { width: 10, height: 10, radius: 5 },
        itemMargin: { horizontal: 12, vertical: 6 }
      },
      stroke: { width: 3, colors: [bgCard], lineCap: 'round' },
      dataLabels: {
        enabled: true,
        style: { fontSize: '11px', fontWeight: 700, colors: ['#fff'] },
        dropShadow: { enabled: false },
        formatter: (val: number) => `${val.toFixed(0)}%`
      },
      plotOptions: {
        pie: {
          expandOnClick: true,
          donut: {
            size: '65%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontWeight: 600,
                color: textColor,
                offsetY: -10
              },
              value: {
                show: true,
                fontSize: '26px',
                fontWeight: 800,
                color: textColor,
                offsetY: 6,
                formatter: (val: string) =>
                  'R$ ' + Number(val).toLocaleString('pt-BR')
              },
              total: {
                show: true,
                showAlways: false,
                label: 'Total Custos',
                color: textColor,
                fontSize: '12px',
                fontWeight: 600,
                formatter: () =>
                  'R$ ' + Number(dados.totalCustos).toLocaleString('pt-BR')
              }
            }
          }
        }
      },
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        style: { fontSize: '13px' },
        y: {
          formatter: (val: number) =>
            'R$ ' + val.toLocaleString('pt-BR')
        }
      }
    };
  }

  get totalObras() {
    return this.obras.length;
  }

  get obrasPlanejamento() {
    return this.obras.filter(o => o.status === 'Planejamento').length;
  }

  get obrasConcluidas() {
    return this.obras.filter(
      o => o.status === 'Concluída' || o.status === 'Concluido'
    ).length;
  }

  get obrasAndamento() {
    return this.obras.filter(
      o => o.status === 'Em andamento' || o.status === 'Em Andamento'
    ).length;
  }

  get orcamentoTotal() {
    return this.obras.reduce(
      (total, obra) => total + Number(obra.orcamento),
      0
    );
  }

  get produtividadeGeral(): number {
    return this.totalObras > 0
      ? Math.round((this.obrasConcluidas / this.totalObras) * 100)
      : 0;
  }

  carregarSparkline() {
    const isDark = this.themeService.currentTheme === 'dark';
    const primaryColor = '#FF6B1A';

    const tendencia = [
      this.orcamentoTotal * 0.85,
      this.orcamentoTotal * 0.88,
      this.orcamentoTotal * 0.90,
      this.orcamentoTotal * 0.92,
      this.orcamentoTotal * 0.95,
      this.orcamentoTotal
    ];

    this.chartSparkline = {
      series: [{ name: 'Orçamento', data: tendencia }],
      chart: {
        type: 'area',
        height: 60,
        sparkline: { enabled: true },
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeout', speed: 500 }
      },
      stroke: { curve: 'smooth', width: 2 },
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

  carregarSparklineMini() {
    const isDark = this.themeService.currentTheme === 'dark';
    const primaryColor = '#FF6B1A';
    const tendencia = [12, 15, 13, 18, this.resumo.receitas || 0];

    this.chartSparklineMini = {
      series: [{ name: 'Tendência', data: tendencia }],
      chart: {
        type: 'line',
        height: 30,
        sparkline: { enabled: true },
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeout', speed: 500 }
      },
      stroke: { curve: 'smooth', width: 1.5 },
      colors: [primaryColor],
      tooltip: {
        theme: isDark ? 'dark' : 'light',
        x: { show: false },
        marker: { show: false }
      },
      grid: { show: false }
    };
  }

  carregarRingChart() {
    const isDark = this.themeService.currentTheme === 'dark';
    const trackColor = isDark ? '#1A1A1A' : '#E8E6E1';
    const textColor = isDark ? '#FAFAF7' : '#121212';
    const primaryColor = '#FF6B1A';

    this.chartRing = {
      series: [this.produtividadeGeral],
      chart: {
        type: 'radialBar',
        height: 180,
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeout', speed: 500 }
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
          gradientToColors: ['#FFA05C'],
          stops: [0, 100]
        }
      },
      stroke: { lineCap: 'round' },
      colors: [primaryColor]
    };
  }

}
