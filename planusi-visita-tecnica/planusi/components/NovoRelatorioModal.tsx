"use client";

import { useState } from "react";
import type { NovoRelatorioForm } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (form: NovoRelatorioForm) => Promise<void>;
}

const EMPTY_FORM: NovoRelatorioForm = {
  data_visita: "",
  cliente: "",
  os: "",
};

export default function NovoRelatorioModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState<NovoRelatorioForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setError(null);
    onClose();
  }

  async function handleSave(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(form);
      setForm(EMPTY_FORM);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) handleClose();
  }

  const inputClass =
    "w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700 transition-colors">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-base">
            Novo Relatório
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none transition-colors"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Data da Visita
            </label>
            <input
              type="date"
              name="data_visita"
              value={form.data_visita}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Cliente
            </label>
            <input
              type="text"
              name="cliente"
              value={form.cliente}
              onChange={handleChange}
              placeholder="Nome do cliente"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              OS
            </label>
            <input
              type="text"
              name="os"
              value={form.os}
              onChange={handleChange}
              placeholder="Número da OS"
              required
              className={inputClass}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="flex-1 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#003087] hover:bg-[#002060] disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
            >
              {saving ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
