import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarefa } from '../../models/tarefa';
import { Categoria } from '../../models/categoria';
import { TarefaService } from '../../services/tarefa.service';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-tarefas', standalone: true, imports: [CommonModule, FormsModule],
  template: `
    <section class="page-heading">
      <div><p class="eyebrow">SEU DIA, EM ORDEM</p><h1>Minhas tarefas</h1><p class="subtitle">Acompanhe o que precisa ser feito, uma coisa de cada vez.</p></div>
      <button class="button primary" type="button" (click)="abrirNova()">＋ Nova tarefa</button>
    </section>
    <div class="stats-row">
      <div class="stat-card"><span class="stat-label">Todas</span><strong>{{ tarefas.length }}</strong></div>
      <div class="stat-card"><span class="stat-label">Pendentes</span><strong>{{ contar('PENDENTE') }}</strong></div>
      <div class="stat-card"><span class="stat-label">Em andamento</span><strong>{{ contar('EM_ANDAMENTO') }}</strong></div>
      <div class="stat-card"><span class="stat-label">Concluídas</span><strong>{{ contar('CONCLUIDA') }}</strong></div>
    </div>
    <div *ngIf="mensagem" class="notice success">{{ mensagem }}</div>
    <div *ngIf="erro" class="notice error">{{ erro }}</div>
    <section *ngIf="formAberto" class="panel form-panel">
      <div class="panel-heading"><div><p class="eyebrow">{{ editandoId ? 'ATUALIZAÇÃO' : 'NOVA ATIVIDADE' }}</p><h2>{{ editandoId ? 'Editar tarefa' : 'Cadastrar tarefa' }}</h2></div><button class="icon-button" type="button" (click)="cancelarForm()" aria-label="Fechar">×</button></div>
      <form (ngSubmit)="salvar()" #form="ngForm">
        <div class="form-grid">
          <label class="field full">Título *<input name="titulo" [(ngModel)]="rascunho.titulo" required maxlength="150" placeholder="Ex.: Entregar atividade de Angular"></label>
          <label class="field full">Descrição<textarea name="descricao" [(ngModel)]="rascunho.descricao" maxlength="500" rows="2" placeholder="Anotações sobre a tarefa"></textarea></label>
          <label class="field">Status<select name="status" [(ngModel)]="rascunho.status" required><option value="PENDENTE">Pendente</option><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDA">Concluída</option></select></label>
          <label class="field">Data de vencimento<input type="date" name="dataVencimento" [(ngModel)]="rascunho.dataVencimento"></label>
          <label class="field full">Categoria<select name="categoriaId" [(ngModel)]="rascunho.categoriaId"><option [ngValue]="null">Sem categoria</option><option *ngFor="let categoria of categorias" [ngValue]="categoria.id">{{ categoria.nome }}</option></select><small *ngIf="categorias.length === 0">Cadastre uma categoria na aba Categorias, se desejar.</small></label>
        </div>
        <div class="form-actions"><button class="button secondary" type="button" (click)="cancelarForm()">Cancelar</button><button class="button primary" type="submit" [disabled]="form.invalid || salvando">{{ salvando ? 'Salvando...' : 'Salvar tarefa' }}</button></div>
      </form>
    </section>
    <section class="panel list-panel">
      <div class="list-toolbar"><div><h2>Lista de tarefas</h2><p class="subtitle">{{ tarefas.length }} {{ tarefas.length === 1 ? 'item cadastrado' : 'itens cadastrados' }}</p></div><button class="button secondary small" (click)="carregar()" type="button">↻ Atualizar</button></div>
      <div *ngIf="carregando" class="empty-state">Carregando tarefas...</div>
      <div *ngIf="!carregando && tarefas.length === 0" class="empty-state"><span class="empty-icon">☷</span><strong>Nenhuma tarefa por aqui</strong><span>Adicione sua primeira tarefa para começar.</span><button class="button primary" (click)="abrirNova()" type="button">Criar tarefa</button></div>
      <div *ngIf="!carregando && tarefas.length > 0" class="task-list">
        <article class="task-item" *ngFor="let tarefa of tarefas">
          <div class="task-check" [class.done]="tarefa.status === 'CONCLUIDA'">{{ tarefa.status === 'CONCLUIDA' ? '✓' : '•' }}</div>
          <div class="task-content"><h3 [class.completed-title]="tarefa.status === 'CONCLUIDA'">{{ tarefa.titulo }}</h3><p *ngIf="tarefa.descricao">{{ tarefa.descricao }}</p><div class="task-meta"><span class="status" [ngClass]="classeStatus(tarefa.status)">{{ textoStatus(tarefa.status) }}</span><span *ngIf="tarefa.dataVencimento">◷ {{ formatarData(tarefa.dataVencimento) }}</span><span *ngIf="nomeCategoria(tarefa.categoriaId)" class="category-chip">{{ nomeCategoria(tarefa.categoriaId) }}</span></div></div>
          <div class="task-actions"><button type="button" class="text-button" (click)="editar(tarefa)">Editar</button><button type="button" class="text-button danger-text" (click)="excluir(tarefa)">Excluir</button></div>
        </article>
      </div>
    </section>
  `
})
export class TarefasComponent implements OnInit {
  private tarefaService = inject(TarefaService);
  private categoriaService = inject(CategoriaService);
  tarefas: Tarefa[] = [];
  categorias: Categoria[] = [];
  carregando = false;
  salvando = false;
  formAberto = false;
  editandoId: string | null = null;
  mensagem = '';
  erro = '';
  rascunho: Tarefa = this.novaTarefa();

  ngOnInit(): void { this.carregar(); this.carregarCategorias(); }
  novaTarefa(): Tarefa { return { titulo: '', descricao: '', status: 'PENDENTE', dataVencimento: null, categoriaId: null }; }
  carregar(): void {
    this.carregando = true; this.erro = '';
    this.tarefaService.listar().subscribe({ next: dados => { this.tarefas = dados; this.carregando = false; }, error: () => { this.erro = 'Não foi possível carregar as tarefas. Confira se o backend e o MongoDB estão funcionando.'; this.carregando = false; } });
  }
  carregarCategorias(): void { this.categoriaService.listar().subscribe({ next: dados => this.categorias = dados, error: () => this.erro = 'Não foi possível carregar as categorias.' }); }
  abrirNova(): void { this.rascunho = this.novaTarefa(); this.editandoId = null; this.formAberto = true; this.mensagem = ''; this.erro = ''; }
  editar(tarefa: Tarefa): void { this.rascunho = { ...tarefa }; this.editandoId = tarefa.id ?? null; this.formAberto = true; this.mensagem = ''; this.erro = ''; }
  cancelarForm(): void { this.formAberto = false; this.editandoId = null; }
  salvar(): void {
    if (!this.rascunho.titulo.trim()) return;
    this.salvando = true; this.erro = ''; this.mensagem = '';
    const dados: Tarefa = { ...this.rascunho, categoriaId: this.rascunho.categoriaId || null, dataVencimento: this.rascunho.dataVencimento || null };
    const pedido = this.editandoId ? this.tarefaService.atualizar(this.editandoId, dados) : this.tarefaService.criar(dados);
    pedido.subscribe({ next: () => { this.mensagem = this.editandoId ? 'Tarefa atualizada com sucesso.' : 'Tarefa cadastrada com sucesso.'; this.salvando = false; this.cancelarForm(); this.carregar(); }, error: e => { this.erro = e?.error?.erro || 'Não foi possível salvar a tarefa.'; this.salvando = false; } });
  }
  excluir(tarefa: Tarefa): void {
    if (!tarefa.id || !confirm(`Deseja excluir a tarefa "${tarefa.titulo}"?`)) return;
    this.erro = ''; this.mensagem = '';
    this.tarefaService.excluir(tarefa.id).subscribe({ next: () => { this.mensagem = 'Tarefa excluída.'; this.carregar(); }, error: e => this.erro = e?.error?.erro || 'Não foi possível excluir a tarefa.' });
  }
  contar(status: string): number { return this.tarefas.filter(t => t.status === status).length; }
  nomeCategoria(id: string | null): string { return this.categorias.find(c => c.id === id)?.nome ?? ''; }
  textoStatus(status: string): string { return status === 'CONCLUIDA' ? 'Concluída' : status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Pendente'; }
  classeStatus(status: string): string { return status === 'CONCLUIDA' ? 'status-done' : status === 'EM_ANDAMENTO' ? 'status-progress' : 'status-pending'; }
  formatarData(data: string): string { return data.split('-').reverse().join('/'); }
}
