import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private is_dark_mode: boolean
  private prefersDark: any

  constructor() {
    this.is_dark_mode = false;
    // Use matchMedia to check the user preference
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.autoDarkMode(this.prefersDark.matches);
    // Listen for changes to the prefers-color-scheme media query
    this.prefersDark.addListener((mediaQuery) => this.autoDarkMode(mediaQuery.matches));

    // this.is_dark_mode = false
  }

  autoDarkMode(_set) {
    this.is_dark_mode = _set
  }

  toggleDarkMode(_override) {
    this.is_dark_mode = !this.is_dark_mode
  }
}
