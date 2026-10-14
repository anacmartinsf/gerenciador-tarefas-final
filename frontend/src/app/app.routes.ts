import { Routes } from '@angular/router';
import { TarefasComponent } from './pages/tarefas/tarefas.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tarefas', pathMatch: 'full' },
  { path: 'tarefas', component: TarefasComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: '**', redirectTo: 'tarefas' }
];
