import { logout } from "@/app/actions/auth";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="bg-[#003087] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        {/* Logo — fundo branco preservado no dark mode */}
        <div className="bg-white rounded-lg px-3 py-1.5 shrink-0">
          <img src="/logo.png" alt="Planusi" className="h-9 select-none" />
        </div>

        {/* Title */}
        <div className="flex-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 leading-none mb-0.5">
            Controle de Numeração para Emissão de
          </p>
          <p className="text-base font-bold uppercase tracking-wide leading-none">
            Relatório de Visita Técnica
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <ThemeToggle />

          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                />
              </svg>
              Sair
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
