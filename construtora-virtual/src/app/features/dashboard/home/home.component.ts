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
import { Obra } from '../../../models/obra';

// Registra a localização em português para os Pipes (R$ e %) funcionarem perfeitamente
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
  imports: [CommonModule,NgApexchartsModule],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  obras: Obra[] = [];

  public chartOptions: any;
  
  collapsed: boolean = false;

  constructor(
    private obraService: ObraService
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

}
      carregarGrafico() {

  this.chartOptions = {

    series: [
      {
        name: 'Quantidade',
        data: [
          this.obrasPlanejamento,
          this.obrasAndamento,
          this.obrasConcluidas
        ]
      }
    ],

    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },

    dataLabels: {
      enabled: true
    },

    xaxis: {
      categories: [
        'Planejamento',
        'Andamento',
        'Concluídas'
      ]
    }

  };

}
  // Seus métodos analíticos reativos mantidos intactos:
  get totalObras() {
    return this.obras.length;
  }

  get obrasPlanejamento() {
    return this.obras
      .filter(o => o.status === 'Planejamento')
      .length;
  }

  get obrasConcluidas() {
    return this.obras
      .filter(o => o.status === 'Concluída' || o.status === 'Concluido')
      .length;
  }

  get obrasAndamento() {
    return this.obras
      .filter(o => o.status === 'Em andamento' || o.status === 'Em Andamento')
      .length;
  }

  get orcamentoTotal() {
    return this.obras.reduce(
      (total, obra) => total + Number(obra.orcamento),
      0
    );
  }
}