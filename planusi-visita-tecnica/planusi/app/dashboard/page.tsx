"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search, Plus } from "lucide-react";
import Header from "@/components/Header";
import RelatorioTable from "@/components/RelatorioTable";
import NovoRelatorioModal from "@/components/NovoRelatorioModal";
import type { Relatorio, NovoRelatorioForm } from "@/types";
import type { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("relatorios_visita")
        .select("*")
        .eq("elaborado_por", user!.id)
        .order("sequencial", { ascending: false });

      if (error) {
        setFetchError("Não foi possível carregar os relatórios.");
      } else {
        const rows = data ?? [];
        setRelatorios(rows);

        const uuids = [...new Set(rows.map((r) => r.elaborado_por).filter(Boolean))];
        if (uuids.length > 0) {
          const { data: users } = await supabase.rpc("get_user_names", {
            user_ids: uuids,
          });
          const map: Record<string, string> = {};
          users?.forEach((u: { id: string; full_name: string }) => {
            map[u.id] = u.full_name;
          });
          setUserNames(map);
        }
      }

      setLoading(false);
    }

    init();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja apagar este relatório?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("relatorios_visita").delete().eq("id", id);
    if (error) {
      alert("Não foi possível apagar o relatório.");
      return;
    }
    setRelatorios((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleSave(form: NovoRelatorioForm) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("relatorios_visita")
      .insert({
        data_visita: form.data_visita,
        cliente: form.cliente,
        os: form.os,
        elaborado_por: user!.id,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    setRelatorios((prev) => [data, ...prev]);

    if (user && !userNames[user.id]) {
      const { data: users } = await supabase.rpc("get_user_names", {
        user_ids: [user.id],
      });
      if (users?.[0]) {
        setUserNames((prev) => ({ ...prev, [users[0].id]: users[0].full_name }));
      }
    }
  }

  const filtered = relatorios.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.cliente.toLowerCase().includes(q) ||
      r.os.toLowerCase().includes(q)
    );
  });

  const countLabel = loading
    ? "Carregando…"
    : search.trim() && filtered.length !== relatorios.length
    ? `${filtered.length} de ${relatorios.length} registro${relatorios.length !== 1 ? "s" : ""}`
    : relatorios.length === 0
    ? "Nenhum registro cadastrado"
    : `${relatorios.length} registro${relatorios.length !== 1 ? "s" : ""}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Título */}
        <div className="mb-3">
          <h2 className="text-slate-700 dark:text-slate-100 font-semibold text-base">
            Relatórios
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">{countLabel}</p>
        </div>

        {/* Toolbar: busca + botão */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por Cliente ou OS..."
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition"
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            disabled={loading}
            className="flex items-center gap-2 bg-[#003087] hover:bg-[#002060] disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Novo Relatório
          </button>
        </div>

        {fetchError && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {fetchError}
          </div>
        )}

        <RelatorioTable
          relatorios={filtered}
          loading={loading}
          userNames={userNames}
          onDelete={handleDelete}
        />
      </main>

      <NovoRelatorioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
