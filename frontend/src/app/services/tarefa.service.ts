import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa } from '../models/tarefa';

@Injectable({ providedIn: 'root' })
export class TarefaService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/tarefas';
  listar(): Observable<Tarefa[]> { return this.http.get<Tarefa[]>(this.url); }
  buscar(id: string): Observable<Tarefa> { return this.http.get<Tarefa>(`${this.url}/${id}`); }
  criar(tarefa: Tarefa): Observable<Tarefa> { return this.http.post<Tarefa>(this.url, tarefa); }
  atualizar(id: string, tarefa: Tarefa): Observable<Tarefa> { return this.http.put<Tarefa>(`${this.url}/${id}`, tarefa); }
  excluir(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
