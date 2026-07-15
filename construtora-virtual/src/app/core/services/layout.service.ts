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
      
      if (open) {
        console.log('🔒 Bloqueando scroll do body');
        body.classList.add('sidebar-open');
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.width = '100%';
        body.style.height = '100%';
        body.style.top = '0';
        body.style.left = '0';
      } else {
        console.log('🔓 Liberando scroll do body');
        body.classList.remove('sidebar-open');
        body.style.overflow = '';
        body.style.position = '';
        body.style.width = '';
        body.style.height = '';
        body.style.top = '';
        body.style.left = '';
      }
      
      console.log('Body classes:', body.className);
      console.log('Body overflow:', body.style.overflow);
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
