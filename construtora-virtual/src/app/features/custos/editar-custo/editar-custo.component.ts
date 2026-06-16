import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CustoService } from '../../../core/services/custo.service';
import { Custo } from '../../../models/custo';

@Component({
  selector: 'app-editar-custo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './editar-custo.component.html',
  styleUrl: './editar-custo.component.scss'
})
export class EditarCustoComponent implements OnInit {

  custoId!: number;
  
  custo = {
    id: 0,
    descricao: '',
    categoria: '',
    valor: 0,
    data: '',
    obra: '',
    tipo: ''
  };

  constructor(
    private custoService: CustoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Captura o ID que passamos na rota (/editar-custo/:id)
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.custoId = Number(idParam);
      this.carregarCusto();
    }
  }

  carregarCusto() {
    // Busca o custo específico no service para preencher o formulário
    this.custoService.buscarPorId(this.custoId).subscribe({
      next: (dados: any) => {
        this.custo = dados;
        // Se a sua data vier no formato ISO do banco (Ex: 2026-06-15T00:00:00), 
        // talvez precise dar um .split('T')[0] para o <input type="date"> aceitar.
        if (this.custo.data) {
          this.custo.data = this.custo.data.split('T')[0];
        }
      },
      error: () => {
        alert('Erro ao carregar os dados do custo.');
        this.router.navigate(['/custos']);
      }
    });
  }

  atualizar() {
    // Chama o método de atualizar do seu service (ajuste o nome se for diferente, ex: editar/alterar)
    this.custoService.atualizar(this.custoId, this.custo).subscribe({
      next: () => {
        alert('Custo atualizado com sucesso!');
        this.router.navigate(['/custos']);
      },
      error: () => {
        alert('Erro ao atualizar o custo.');
      }
    });
  }
}