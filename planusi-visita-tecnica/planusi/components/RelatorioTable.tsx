import { Trash2 } from "lucide-react";
import type { Relatorio } from "@/types";
import { formatNumero } from "@/lib/utils";

interface Props {
  relatorios: Relatorio[];
  loading?: boolean;
  userNames: Record<string, string>;
  onDelete?: (id: string) => void;
}

const COLUMNS = ["Nº", "Data", "Cliente", "OS", "Elaborado Por", ""];

export default function RelatorioTable({ relatorios, loading, userNames, onDelete }: Props) {
  function resolveElaboradoPor(uuid: string): string {
    return userNames[uuid] ?? uuid.slice(0, 8) + "…";
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#003087] text-white">
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="text-left font-semibold px-5 py-3 uppercase tracking-wider text-xs whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-400 text-sm">
                  Carregando…
                </td>
              </tr>
            ) : relatorios.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-slate-300 dark:text-slate-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                      Nenhum relatório encontrado
                    </span>
                    <span className="text-xs text-slate-300 dark:text-slate-600">
                      Clique em &quot;Novo Relatório&quot; para começar
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              relatorios.map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-t border-slate-100 dark:border-slate-700 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors ${
                    i % 2 === 0
                      ? "bg-white dark:bg-slate-800"
                      : "bg-slate-50/60 dark:bg-slate-800/60"
                  }`}
                >
                  <td className="px-5 py-3 font-mono font-semibold text-[#003087] dark:text-blue-400 whitespace-nowrap">
                    {formatNumero(r.sequencial, r.ano)}
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-white whitespace-nowrap">
                    {r.data_visita
                      ? new Date(r.data_visita + "T00:00:00").toLocaleDateString("pt-BR")
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-700 dark:text-white">{r.cliente || "—"}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-white whitespace-nowrap">{r.os || "—"}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-red-400 font-medium">
                    {r.elaborado_por ? resolveElaboradoPor(r.elaborado_por) : "—"}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {onDelete && (
                      <button
                        onClick={() => onDelete(r.id)}
                        className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Apagar relatório"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {relatorios.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">
          {relatorios.length} registro{relatorios.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
