import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../models/categoria';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categorias', standalone: true, imports: [CommonModule, FormsModule],
  template: `
    <section class="page-heading"><div><p class="eyebrow">ORGANIZE POR TIPO</p><h1>Categorias</h1><p class="subtitle">Separe suas atividades por assunto para encontrar tudo com facilidade.</p></div><button class="button primary" type="button" (click)="abrirNova()">＋ Nova categoria</button></section>
    <div *ngIf="mensagem" class="notice success">{{ mensagem }}</div><div *ngIf="erro" class="notice error">{{ erro }}</div>
    <section *ngIf="formAberto" class="panel form-panel"><div class="panel-heading"><div><p class="eyebrow">{{ editandoId ? 'ATUALIZAÇÃO' : 'NOVA ORGANIZAÇÃO' }}</p><h2>{{ editandoId ? 'Editar categoria' : 'Cadastrar categoria' }}</h2></div><button class="icon-button" type="button" (click)="cancelar()" aria-label="Fechar">×</button></div>
      <form (ngSubmit)="salvar()" #form="ngForm"><div class="form-grid"><label class="field full">Nome *<input name="nome" [(ngModel)]="rascunho.nome" required maxlength="100" placeholder="Ex.: Faculdade"></label><label class="field full">Descrição<textarea name="descricao" [(ngModel)]="rascunho.descricao" maxlength="255" rows="3" placeholder="Para que serve esta categoria?"></textarea></label></div><div class="form-actions"><button class="button secondary" type="button" (click)="cancelar()">Cancelar</button><button class="button primary" type="submit" [disabled]="form.invalid || salvando">{{ salvando ? 'Salvando...' : 'Salvar categoria' }}</button></div></form>
    </section>
    <section class="panel list-panel"><div class="list-toolbar"><div><h2>Minhas categorias</h2><p class="subtitle">{{ categorias.length }} {{ categorias.length === 1 ? 'categoria cadastrada' : 'categorias cadastradas' }}</p></div><button class="button secondary small" (click)="carregar()" type="button">↻ Atualizar</button></div>
      <div *ngIf="carregando" class="empty-state">Carregando categorias...</div>
      <div *ngIf="!carregando && categorias.length === 0" class="empty-state"><span class="empty-icon">▦</span><strong>Nenhuma categoria cadastrada</strong><span>Crie uma categoria para organizar suas tarefas.</span><button class="button primary" type="button" (click)="abrirNova()">Criar categoria</button></div>
      <div *ngIf="!carregando && categorias.length > 0" class="category-grid"><article class="category-card" *ngFor="let categoria of categorias"><div class="category-symbol">▦</div><div class="category-card-content"><h3>{{ categoria.nome }}</h3><p>{{ categoria.descricao || 'Sem descrição' }}</p></div><div class="category-actions"><button class="text-button" type="button" (click)="editar(categoria)">Editar</button><button class="text-button danger-text" type="button" (click)="excluir(categoria)">Excluir</button></div></article></div>
    </section>
  `
})
export class CategoriasComponent implements OnInit {
  private service = inject(CategoriaService);
  categorias: Categoria[] = [];
  carregando = false;
  salvando = false;
  formAberto = false;
  editandoId: string | null = null;
  mensagem = '';
  erro = '';
  rascunho: Categoria = this.novaCategoria();
  ngOnInit(): void { this.carregar(); }
  novaCategoria(): Categoria { return { nome: '', descricao: '' }; }
  carregar(): void { this.carregando = true; this.erro = ''; this.service.listar().subscribe({ next: dados => { this.categorias = dados; this.carregando = false; }, error: () => { this.erro = 'Não foi possível carregar as categorias. Confira se o backend e o MongoDB estão funcionando.'; this.carregando = false; } }); }
  abrirNova(): void { this.rascunho = this.novaCategoria(); this.editandoId = null; this.formAberto = true; this.erro = ''; this.mensagem = ''; }
  editar(categoria: Categoria): void { this.rascunho = { ...categoria }; this.editandoId = categoria.id ?? null; this.formAberto = true; this.erro = ''; this.mensagem = ''; }
  cancelar(): void { this.formAberto = false; this.editandoId = null; }
  salvar(): void {
    if (!this.rascunho.nome.trim()) return;
    this.salvando = true; this.erro = ''; this.mensagem = '';
    const pedido = this.editandoId ? this.service.atualizar(this.editandoId, this.rascunho) : this.service.criar(this.rascunho);
    pedido.subscribe({ next: () => { this.mensagem = this.editandoId ? 'Categoria atualizada com sucesso.' : 'Categoria cadastrada com sucesso.'; this.salvando = false; this.cancelar(); this.carregar(); }, error: e => { this.erro = e?.error?.erro || 'Não foi possível salvar a categoria.'; this.salvando = false; } });
  }
  excluir(categoria: Categoria): void {
    if (!categoria.id || !confirm(`Deseja excluir a categoria "${categoria.nome}"?`)) return;
    this.erro = ''; this.mensagem = '';
    this.service.excluir(categoria.id).subscribe({ next: () => { this.mensagem = 'Categoria excluída.'; this.carregar(); }, error: e => this.erro = e?.error?.erro || 'Não foi possível excluir. Confira se existem tarefas vinculadas a esta categoria.' });
  }
}
