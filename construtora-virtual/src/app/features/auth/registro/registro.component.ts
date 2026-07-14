import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
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

  aceitouLgpd = false;

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
    private authService: AuthService,
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

    if (!this.aceitouLgpd) {
      this.toast.aviso('Você precisa aceitar a Política de Privacidade para continuar.');
      return;
    }

    this.authService
      .registro(this.usuario.nome, this.usuario.email, this.usuario.senha)
      .subscribe({
        next: (resposta: any) => {
          // Já faz login automático com o token retornado
          localStorage.setItem('token', resposta.access_token);
          localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
          this.toast.sucesso('Conta criada com sucesso! Bem-vindo.');
          this.router.navigate(['/dashboard']);
        },
        error: (erro) => {
          console.error(erro);
          const msg = erro?.error?.message ?? 'Erro ao realizar o cadastro.';
          this.toast.erro(msg);
        }
      });
  }

  private validarEmail(email: string): boolean {
    return /\S+@\S+\.\S+/.test(email);
  }
}
