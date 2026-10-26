"use client";

import { motion } from "motion/react";
import { CheckCircle } from "@phosphor-icons/react";
import { formatCurrency } from "@/lib/utils";
import type { Proposal } from "@/data/proposals";

interface ProposalCardProps {
  proposal: Proposal;
  onSelect: () => void;
  showType?: boolean;
}

export function ProposalCard({
  proposal,
  onSelect,
  showType = false,
}: ProposalCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative bg-white border-2 rounded-2xl p-6 ${
        proposal.destaque
          ? "border-blue-600 shadow-lg shadow-blue-600/10"
          : "border-zinc-200"
      }`}
    >
      {proposal.destaque && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
          Recomendada
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 mb-2">
          {showType ? proposal.nome : proposal.nome}
        </h3>
      </div>

      <div className="mb-6">
        <p className="text-sm text-zinc-600 mb-2">Parcela mensal</p>
        <p className="text-3xl font-bold text-zinc-900">
          {formatCurrency(proposal.parcela)}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {proposal.caracteristicas.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircle
              size={20}
              weight="fill"
              className="text-green-600 shrink-0 mt-0.5"
            />
            <span className="text-sm text-zinc-700">{item}</span>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSelect}
        className={`w-full py-3 font-semibold rounded-full transition-colors ${
          proposal.destaque
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
        }`}
      >
        Escolher esta proposta
      </motion.button>

      <div className="mt-4 pt-4 border-t border-zinc-200">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-600">Valor total</span>
          <span className="font-semibold text-zinc-900">
            {formatCurrency(proposal.valorTotal)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
