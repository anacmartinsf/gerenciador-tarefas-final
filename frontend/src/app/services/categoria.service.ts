import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/categorias';
  listar(): Observable<Categoria[]> { return this.http.get<Categoria[]>(this.url); }
  criar(categoria: Categoria): Observable<Categoria> { return this.http.post<Categoria>(this.url, categoria); }
  atualizar(id: string, categoria: Categoria): Observable<Categoria> { return this.http.put<Categoria>(`${this.url}/${id}`, categoria); }
  excluir(id: string): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
