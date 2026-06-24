import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { UsuarioService } from '../../../core/services/usuario.service';
import { ToastService } from '../../../core/services/toast.service';

interface CarouselSlide {
  image: string;
  tag: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent implements OnInit, OnDestroy {

  usuario = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };

  currentSlideIndex = 0;
  private carouselTimer: any;

  slides: CarouselSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200',
      tag: 'Implantação Rápida',
      title: 'Crie sua conta em segundos',
      description: 'Tenha acesso imediato a todas as ferramentas de controle orçamentário, gestão de funcionários e controladoria civil.'
    },
    {
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
      tag: 'Controle Financeiro',
      title: 'Reduza desperdícios de ponta a ponta',
      description: 'Acompanhe compras, estoque e custos classificados por obra para garantir o maior retorno sobre investimento.'
    }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.startCarouselRotation();
  }

  ngOnDestroy(): void {
    this.stopCarouselRotation();
  }

  private startCarouselRotation(): void {
    this.carouselTimer = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    }, 5000);
  }

  private stopCarouselRotation(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
  }

  setSlide(index: number): void {
    this.currentSlideIndex = index;
    this.stopCarouselRotation();
    this.startCarouselRotation();
  }

  registrar() {
    if (!this.usuario.nome || !this.usuario.email || !this.usuario.senha || !this.usuario.confirmarSenha) {
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

    // Default para Administrador do novo ambiente
    const novoUsuario = {
      nome: this.usuario.nome,
      email: this.usuario.email,
      senha: this.usuario.senha,
      perfil: 'Administrador'
    };

    this.usuarioService.adicionar(novoUsuario).subscribe({
      next: () => {
        this.toast.sucesso('Cadastro realizado com sucesso! Conecte-se para começar.');
        setTimeout(() => this.router.navigate(['/login']), 1800);
      },
      error: (erro) => {
        console.error(erro);
        this.toast.erro('Erro ao realizar o cadastro. Verifique se este e-mail já está cadastrado.');
      }
    });
  }

  private validarEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

}
