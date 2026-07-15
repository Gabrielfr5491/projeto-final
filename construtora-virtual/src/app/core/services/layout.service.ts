import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private sidebarCollapsed = new BehaviorSubject<boolean>(false);
  sidebarCollapsed$ = this.sidebarCollapsed.asObservable();

  private mobileSidebarOpen = new BehaviorSubject<boolean>(false);
  mobileSidebarOpen$ = this.mobileSidebarOpen.asObservable();

  toggleSidebar() {
    this.sidebarCollapsed.next(!this.sidebarCollapsed.value);
  }

  setSidebarCollapsed(collapsed: boolean) {
    this.sidebarCollapsed.next(collapsed);
  }

  toggleMobileSidebar() {
    const newValue = !this.mobileSidebarOpen.value;
    console.log('🍔 Toggle Mobile Sidebar:', newValue);
    this.setMobileSidebarOpen(newValue);
  }

  setMobileSidebarOpen(open: boolean) {
    console.log('📱 Set Mobile Sidebar:', open);
    this.mobileSidebarOpen.next(open);
    
    // Previne scroll do body quando sidebar mobile está aberta
    if (typeof document !== 'undefined') {
      if (open) {
        document.body.classList.add('sidebar-open');
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      } else {
        document.body.classList.remove('sidebar-open');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }
    }
  }
}
