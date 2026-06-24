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
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  email = '';
  senha = '';

  // Controles do Carrossel Premium
  currentSlideIndex = 0;
  private carouselTimer: any;

  // Imagens conceituais de engenharia civil pesada e arquitetura
  slides: CarouselSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1200',
      tag: 'Infraestrutura',
      title: 'Modelagem de Alta Performance',
      description: 'Acompanhe o cronograma físico-financeiro e a evolução estrutural de suas obras em tempo real com precisão milimétrica.'
    },
    {
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
      tag: 'Arquitetura Corporativa',
      title: 'Engenharia de Valor e Escopo',
      description: 'Otimize a alocação de insumos, o controle patrimonial e reduza o desperdício operacional de forma inteligente.'
    },
    {
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200',
      tag: 'Controladoria Digital',
      title: 'Decisões Baseadas em Dados',
      description: 'Painéis consolidados para diretores e engenheiros de campo tomarem decisões ágeis que garantem a margem de lucro.'
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

  // Ativa a rotação automática dos slides a cada 5 segundos
  private startCarouselRotation(): void {
    this.carouselTimer = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  // Limpa o timer para evitar lentidão ou memory leak no Angular
  private stopCarouselRotation(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
  }

  private nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
  }

  // Permite ao usuário clicar nas barras indicadoras inferiores (Dots)
  setSlide(index: number): void {
    this.currentSlideIndex = index;
    this.stopCarouselRotation(); // Reseta o tempo para o usuário ler sem pressa
    this.startCarouselRotation();
  }

  entrar() {

  this.authService
    .login(
      this.email,
      this.senha
    )
    .subscribe({

      next: (resposta: any) => {

  localStorage.setItem(
    'token',
    resposta.access_token
  );

  localStorage.setItem(
    'usuario',
    JSON.stringify(
      resposta.usuario
    )
  );

  this.router.navigate([
    '/dashboard'
  ]);

},

      error: (erro) => {
        console.error(erro);
        this.toast.erro('E-mail ou senha inválidos.');
      }

    });

  }
}