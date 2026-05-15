"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

type LoginState = { error: string } | null;

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null
  );

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Planusi" className="h-14 select-none" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-center text-slate-500 text-xs font-semibold uppercase tracking-widest mb-6">
            Acesse sua conta
          </h1>

          {state?.error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Senha
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#003087] hover:bg-[#002060] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 text-sm transition-colors mt-2"
            >
              {pending ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Planusi © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
