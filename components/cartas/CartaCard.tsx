"use client";

import { motion } from "motion/react";
import { Copy, CreditCard } from "@phosphor-icons/react";
import { useState } from "react";
import type { CartaContemplada } from "@/lib/scraper";

interface CartaCardProps {
  carta: CartaContemplada;
  onSolicitar: (codigoCarta: string) => void;
}

export function CartaCard({ carta, onSolicitar }: CartaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(carta.codigoCota);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const logoMap: { [key: string]: string } = {
    "Volkswagen": "/logos/volkswagen.png",
    "Promove": "/logos/promove.png",
    "Ademicon": "/logos/ademicon.png",
    "GFT/Bradesco": "/logos/gft-bradesco.png",
    "Itaú": "/logos/itau.png",
    "Banco do Brasil": "/logos/banco-do-brasil.jpg",
    "Caixa": "/logos/caixa.png",
    "Magalu": "/logos/magalu.jpg",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border-2 border-zinc-200 rounded-2xl p-6 hover:border-blue-600 transition-colors"
    >
      {/* Cabeçalho com código e categoria */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={20} weight="duotone" className="text-blue-600" />
            <span className="text-sm font-semibold text-zinc-500">
              Código da Carta
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-zinc-900">
              {carta.codigoCota}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-zinc-100 rounded-lg transition-colors"
              title="Copiar código"
            >
              <Copy
                size={18}
                weight={copied ? "fill" : "regular"}
                className={copied ? "text-green-600" : "text-zinc-400"}
              />
            </button>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            carta.categoria === "Imóvel"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          {carta.categoria}
        </div>
      </div>

      {/* Informações principais */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-zinc-600">Crédito</span>
          <span className="text-xl font-bold text-green-600">
            {formatCurrency(carta.credito)}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-zinc-600">Entrada</span>
          <span className="text-lg font-semibold text-zinc-900">
            {formatCurrency(carta.entrada)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-200">
          <div>
            <span className="text-xs text-zinc-500 block mb-1">Parcelas</span>
            <span className="text-sm font-semibold text-zinc-900">
              {carta.numeroParcelas}x de {formatCurrency(carta.valorParcela)}
            </span>
          </div>
          <div>
            <span className="text-xs text-zinc-500 block mb-1">
              Saldo Devedor
            </span>
            <span className="text-sm font-semibold text-zinc-900">
              {formatCurrency(carta.saldoDevedor)}
            </span>
          </div>
        </div>
        {carta.valorTotal && (
          <div className="flex justify-between items-baseline pt-3 border-t border-zinc-200 bg-blue-50 rounded-lg px-3 py-2 mt-3">
            <span className="text-sm font-semibold text-zinc-700">Valor Total</span>
            <span className="text-lg font-bold text-blue-900">
              {formatCurrency(carta.valorTotal)}
            </span>
          </div>
        )}
      </div>

      {/* Administradora com Logo */}
      <div className="mb-4 pb-4 border-b border-zinc-200">
        <span className="text-xs text-zinc-500 block mb-2">Administradora</span>
        <div className="flex items-center justify-center bg-zinc-50 rounded-lg p-3">
          <img
            src={logoMap[carta.administradora] || "/logos/volkswagen.png"}
            alt={carta.administradora}
            className="h-8 object-contain"
          />
        </div>
      </div>

      {/* Botão de ação */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSolicitar(carta.codigoCota)}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
      >
        Quero uma carta contemplada
      </motion.button>

      {/* Status e referência (se existir) */}
      {carta.referenciaGarantia && (
        <div className="mt-3 text-xs text-zinc-400 text-center">
          Ref: {carta.referenciaGarantia}
        </div>
      )}
    </motion.div>
  );
}
