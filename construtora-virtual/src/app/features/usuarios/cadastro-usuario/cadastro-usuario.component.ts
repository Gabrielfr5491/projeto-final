import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.scss'
})
export class CadastroUsuarioComponent {

  usuario = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    perfil: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toast: ToastService
  ) {}

  salvar() {
    if (!this.usuario.nome || !this.usuario.email || !this.usuario.senha || !this.usuario.confirmarSenha || !this.usuario.perfil) {
      this.toast.aviso('Todos os campos são obrigatórios.');
      return;
    }
    if (!this.validarEmail(this.usuario.email)) {
      this.toast.aviso('Por favor, insira um e-mail válido.');
      return;
    }
    if (this.usuario.senha !== this.usuario.confirmarSenha) {
      this.toast.aviso('As senhas não coincidem.');
      return;
    }

    const { confirmarSenha, ...dadosUsuario } = this.usuario;

    this.usuarioService.adicionar(dadosUsuario).subscribe({
      next: () => {
        this.toast.sucesso('Usuário cadastrado com sucesso!');
        setTimeout(() => this.router.navigate(['/usuarios']), 1500);
      },
      error: (erro) => {
        console.error(erro);
        this.toast.erro('Erro ao cadastrar usuário. Verifique se o e-mail já está em uso.');
      }
    });
  }

  cancelar() { this.router.navigate(['/usuarios']); }

  private validarEmail(email: string): boolean {
    return /\S+@\S+\.\S+/.test(email);
  }
}

