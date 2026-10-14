import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <header class="topbar">
      <div class="brand"><span class="brand-mark">✓</span><span>Organiza<span class="brand-light">ê</span></span></div>
      <nav aria-label="Navegação principal">
        <a routerLink="/tarefas" routerLinkActive="active">Tarefas</a>
        <a routerLink="/categorias" routerLinkActive="active">Categorias</a>
      </nav>
      <span class="top-note">Organize seu dia</span>
    </header>
    <main class="page"><router-outlet /></main>
    <footer>Gerenciador de tarefas · Projeto acadêmico ADS</footer>
  `
})
export class AppComponent {}
