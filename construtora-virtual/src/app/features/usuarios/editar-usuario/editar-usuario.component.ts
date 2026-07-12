import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss'
})
export class EditarUsuarioComponent implements OnInit {

  id!: number;
  carregando = true;
  salvando = false;

  usuario: any = {
    nome: '',
    email: '',
    perfil: ''
  };

  // Campos opcionais para troca de senha
  novaSenha = '';
  confirmarSenha = '';
  alterarSenha = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.usuarioService.buscarPorId(this.id).subscribe({
      next: (dados) => {
        this.usuario = {
          nome:   dados.nome,
          email:  dados.email,
          perfil: dados.perfil
        };
        this.carregando = false;
      },
      error: () => {
        this.toast.erro('Erro ao carregar dados do usuário.');
        this.router.navigate(['/usuarios']);
      }
    });
  }

  salvar(): void {
    if (!this.usuario.nome || !this.usuario.email || !this.usuario.perfil) {
      this.toast.aviso('Nome, e-mail e perfil são obrigatórios.');
      return;
    }

    if (!this.validarEmail(this.usuario.email)) {
      this.toast.aviso('Por favor, insira um e-mail válido.');
      return;
    }

    if (this.alterarSenha) {
      if (!this.novaSenha) {
        this.toast.aviso('Informe a nova senha.');
        return;
      }
      if (this.novaSenha !== this.confirmarSenha) {
        this.toast.aviso('As senhas não coincidem.');
        return;
      }
    }

    const payload: any = { ...this.usuario };
    if (this.alterarSenha && this.novaSenha) {
      payload.senha = this.novaSenha;
    }

    this.salvando = true;
    this.usuarioService.atualizar(this.id, payload).subscribe({
      next: () => {
        this.toast.sucesso('Usuário atualizado com sucesso!');
        setTimeout(() => this.router.navigate(['/usuarios']), 1500);
      },
      error: () => {
        this.salvando = false;
        this.toast.erro('Erro ao atualizar usuário. Verifique se o e-mail já está em uso.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }

  private validarEmail(email: string): boolean {
    return /\S+@\S+\.\S+/.test(email);
  }
}
