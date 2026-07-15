import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private sidebarCollapsed = new BehaviorSubject<boolean>(false);
  sidebarCollapsed$ = this.sidebarCollapsed.asObservable();

  private mobileSidebarOpen = new BehaviorSubject<boolean>(false);
  mobileSidebarOpen$ = this.mobileSidebarOpen.asObservable();

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    console.log('🏗️ LayoutService initialized');
    console.log('Is Browser?', this.isBrowser);
  }

  toggleSidebar() {
    const newValue = !this.sidebarCollapsed.value;
    console.log('🔄 Toggle Sidebar (desktop):', newValue);
    this.sidebarCollapsed.next(newValue);
  }

  setSidebarCollapsed(collapsed: boolean) {
    console.log('📐 Set Sidebar Collapsed:', collapsed);
    this.sidebarCollapsed.next(collapsed);
  }

  toggleMobileSidebar() {
    const currentValue = this.mobileSidebarOpen.value;
    const newValue = !currentValue;
    
    console.log('🍔 Toggle Mobile Sidebar');
    console.log('  Valor atual:', currentValue);
    console.log('  Novo valor:', newValue);
    console.log('  Window width:', this.isBrowser ? window.innerWidth : 'SSR');
    
    this.setMobileSidebarOpen(newValue);
  }

  setMobileSidebarOpen(open: boolean) {
    console.log('📱 Set Mobile Sidebar Open:', open);
    
    // Atualiza o observable
    this.mobileSidebarOpen.next(open);
    
    // Previne scroll do body quando sidebar está aberta (apenas no browser)
    if (this.isBrowser) {
      const body = document.body;
      const html = document.documentElement;
      
      if (open) {
        console.log('🔒 Bloqueando scroll do body');
        
        // Salva a posição atual do scroll
        const scrollY = window.scrollY;
        
        body.classList.add('sidebar-open');
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.width = '100%';
        body.style.top = `-${scrollY}px`;
        body.style.left = '0';
        
        // Armazena a posição do scroll
        body.dataset['scrollY'] = scrollY.toString();
        
      } else {
        console.log('🔓 Liberando scroll do body');
        
        // Recupera a posição do scroll
        const scrollY = parseInt(body.dataset['scrollY'] || '0', 10);
        
        body.classList.remove('sidebar-open');
        
        // FORÇA o body a ser scrollable novamente
        body.style.overflow = 'auto';
        body.style.position = 'relative';
        body.style.width = 'auto';
        body.style.height = 'auto';
        body.style.top = '0';
        body.style.left = '0';
        
        // Também força no html
        html.style.overflow = 'auto';
        
        // Restaura a posição do scroll
        window.scrollTo(0, scrollY);
        
        // Remove o dataset
        delete body.dataset['scrollY'];
      }
      
      console.log('Body classes:', body.className);
      console.log('Body overflow:', body.style.overflow);
      console.log('Body position:', body.style.position);
    }
  }

  // Método auxiliar para debug
  getState() {
    return {
      sidebarCollapsed: this.sidebarCollapsed.value,
      mobileSidebarOpen: this.mobileSidebarOpen.value,
      isBrowser: this.isBrowser
    };
  }
}
