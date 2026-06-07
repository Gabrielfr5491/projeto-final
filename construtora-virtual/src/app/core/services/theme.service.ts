import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  darkMode = false;

  toggleTheme() {

    this.darkMode = !this.darkMode;

    document.body.classList.toggle(
      'dark-mode'
    );
  }
}