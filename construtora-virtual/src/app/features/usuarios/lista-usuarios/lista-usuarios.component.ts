import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.scss'
})
export class ListaUsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  filtro = '';
  carregando = false;

  constructor(
    private usuarioService: UsuarioService,
    private toast: ToastService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.usuarioService.listar().subscribe({
      next: (dados) => {
        this.usuarios = dados;
        this.carregando = false;
      },
      error: () => {
        this.toast.erro('Erro ao carregar usuários.');
        this.carregando = false;
      }
    });
  }

  get usuariosFiltrados(): Usuario[] {
    const q = this.filtro.toLowerCase();
    if (!q) return this.usuarios;
    return this.usuarios.filter(u =>
      u.nome.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.perfil.toLowerCase().includes(q)
    );
  }

  isAdmin(): boolean {
    const perfil = this.auth.getUsuario()?.perfil?.toLowerCase();
    return perfil === 'admin';
  }

  perfilClass(perfil: string): string {
    const p = perfil?.toLowerCase();
    if (p === 'admin') return 'badge--admin';
    if (p === 'gerente') return 'badge--gerente';
    return 'badge--comum';
  }

  excluir(id: number | undefined) {
    if (!id) return;
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    this.usuarioService.excluir(id).subscribe({
      next: () => {
        this.toast.sucesso('Usuário excluído com sucesso.');
        this.carregar();
      },
      error: () => this.toast.erro('Erro ao excluir usuário.')
    });
  }
}
