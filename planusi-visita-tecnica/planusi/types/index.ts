export interface Relatorio {
  id: string;
  sequencial: number;
  ano: number;
  data_visita: string;
  cliente: string;
  os: string;
  elaborado_por: string;
  created_at: string;
}

export interface NovoRelatorioForm {
  data_visita: string;
  cliente: string;
  os: string;
}
