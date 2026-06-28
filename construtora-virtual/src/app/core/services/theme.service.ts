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
    
    if (this.isBrowser) {      const savedTheme = localStorage.getItem('theme');
      this.isDark = savedTheme ? savedTheme === 'dark' : true;
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

    const root = document.documentElement;
    if (this.isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }

  get currentTheme(): string {
    return this.isDark ? 'dark' : 'light';
  }
}