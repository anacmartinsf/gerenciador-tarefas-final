export interface Tarefa {
  id?: string;
  titulo: string;
  descricao: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  dataVencimento: string | null;
  categoriaId: string | null;
}
