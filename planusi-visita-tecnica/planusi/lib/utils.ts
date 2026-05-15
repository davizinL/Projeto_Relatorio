export function formatNumero(sequencial: number, ano: number): string {
  return sequencial.toString().padStart(4, "0") + "-" + ano.toString().slice(-2);
}
