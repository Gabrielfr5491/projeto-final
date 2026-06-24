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
    this.mobileSidebarOpen.next(!this.mobileSidebarOpen.value);
  }

  setMobileSidebarOpen(open: boolean) {
    this.mobileSidebarOpen.next(open);
  }
}
