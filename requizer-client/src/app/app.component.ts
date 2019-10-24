import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private is_dark_mode: boolean

  constructor() {
    this.is_dark_mode = false
  }

  toggleDarkMode() {
    this.is_dark_mode = !this.is_dark_mode
  }
}
