import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isBrowser: boolean;
  private isDark: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    if (this.isBrowser) {
      // Recupera o tema salvo ou usa o padrão do sistema operacional do usuário
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      this.isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      this.applyTheme();
    }
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    if (this.isBrowser) {
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      this.applyTheme();
    }
  }

  private applyTheme(): void {
    if (!this.isBrowser) return;

    const root = document.documentElement; // Pega a tag <html>
    if (this.isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  get currentTheme(): string {
    return this.isDark ? 'dark' : 'light';
  }
}