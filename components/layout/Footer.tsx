"use client";

import Link from "next/link";
import { siteTexts } from "@/data/texts";

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Sobre */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              {siteTexts.company.name}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-[65ch]">
              {siteTexts.company.tagline}
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/simulacao"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Simulação
                </Link>
              </li>
              <li>
                <Link
                  href="/cartas"
                  className="text-sm hover:text-blue-400 transition-colors"
                >
                  Cartas Contempladas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 mt-12 pt-8">
          <p className="text-sm text-zinc-500 text-center">
            2026 {siteTexts.company.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
