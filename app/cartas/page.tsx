"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Funnel, ArrowsClockwise } from "@phosphor-icons/react";
import { CartaCard } from "@/components/cartas/CartaCard";
import { SolicitacaoModal } from "@/components/cartas/SolicitacaoModal";
import type { CartaContemplada } from "@/lib/scraper";

type TipoCarta = "todos" | "imovel" | "veiculo";

export default function CartasPage() {
  const [cartas, setCartas] = useState<CartaContemplada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<TipoCarta>("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [cartaSelecionada, setCartaSelecionada] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchCartas = async (tipo: TipoCarta, forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const url = `/api/cartas?tipo=${tipo}${forceRefresh ? "&refresh=true" : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao carregar cartas");
      }

      const data = await response.json();

      if (data.success) {
        setCartas(data.data);
        setLastUpdate(new Date(data.meta.timestamp));
      } else {
        throw new Error(data.error || "Erro desconhecido");
      }
    } catch (err) {
      console.error("Erro:", err);
      setError(
        err instanceof Error ? err.message : "Erro ao carregar cartas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartas(filtro);
  }, [filtro]);

  const handleSolicitar = (codigoCarta: string) => {
    setCartaSelecionada(codigoCarta);
    setModalOpen(true);
  };

  const handleRefresh = () => {
    fetchCartas(filtro, true);
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            Cartas de Crédito Contempladas
          </h1>
          <p className="text-lg text-zinc-600 max-w-[65ch] mx-auto">
            Adquira seu veículo ou imóvel com carta contemplada e economize nos
            juros
          </p>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Funnel size={20} weight="duotone" className="text-zinc-500" />
              <span className="text-sm font-semibold text-zinc-700">
                Filtrar por categoria:
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-2 bg-zinc-100 rounded-full p-1">
                {(
                  [
                    { value: "todos", label: "Todos" },
                    { value: "imovel", label: "Imóvel" },
                    { value: "veiculo", label: "Veículo" },
                  ] as const
                ).map((opcao) => (
                  <button
                    key={opcao.value}
                    onClick={() => setFiltro(opcao.value)}
                    className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                      filtro === opcao.value
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-transparent text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {opcao.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors disabled:opacity-50"
                title="Atualizar listagem"
              >
                <ArrowsClockwise
                  size={20}
                  weight="bold"
                  className={`text-zinc-600 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-100 animate-pulse rounded-2xl h-80"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center"
          >
            <p className="text-red-700 font-semibold mb-4">{error}</p>
            <button
              onClick={() => fetchCartas(filtro)}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </motion.div>
        )}

        {/* Empty */}
        {!loading && !error && cartas.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-50 border-2 border-zinc-200 rounded-2xl p-12 text-center"
          >
            <p className="text-zinc-600 text-lg mb-2">
              Nenhuma carta encontrada
            </p>
            <p className="text-zinc-500 text-sm">
              Tente alterar os filtros ou voltar mais tarde
            </p>
          </motion.div>
        )}

        {/* Grid de cartas */}
        {!loading && !error && cartas.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {cartas.map((carta, index) => (
                <motion.div
                  key={carta.codigoCota || `carta-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.05 * index,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <CartaCard carta={carta} onSolicitar={handleSolicitar} />
                </motion.div>
              ))}
            </motion.div>

            {/* Footer com informações */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-center text-sm text-zinc-500 space-y-2"
            >
              <p>
                Exibindo <strong className="text-zinc-700">{cartas.length}</strong>{" "}
                {cartas.length === 1 ? "carta" : "cartas"} contempladas
              </p>
              {lastUpdate && (
                <p>
                  Última atualização:{" "}
                  {lastUpdate.toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              )}
              <p className="text-xs pt-2 border-t border-zinc-200 max-w-2xl mx-auto mt-4">
                Dados obtidos de{" "}
                <a
                  href="https://contempladas.contempladasbrasil.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Contempladas Brasil
                </a>
                . Os valores e disponibilidade podem sofrer alterações.
              </p>
            </motion.div>
          </>
        )}
      </div>

      {/* Modal */}
      <SolicitacaoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        codigoCarta={cartaSelecionada}
      />
    </main>
  );
}
