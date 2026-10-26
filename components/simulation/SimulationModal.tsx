"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "@phosphor-icons/react";
import { ProposalCard } from "./ProposalCard";
import { LeadForm } from "./LeadForm";
import { simulateProposal } from "@/services/simulation";
import { featuredCars } from "@/data/cars";
import type { Proposal } from "@/data/proposals";
import type { SimulationData } from "@/lib/validations";

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId?: string;
}

export function SimulationModal({
  isOpen,
  onClose,
  carId,
}: SimulationModalProps) {
  const [step, setStep] = useState<"initial" | "proposals" | "form">("proposals");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const car = carId ? featuredCars.find((c) => c.id === carId) : null;

  const handleSimulate = async (data: SimulationData) => {
    setIsLoading(true);
    try {
      const results = await simulateProposal(data, "card");
      setProposals(results);
      setStep("proposals");
    } catch (error) {
      console.error("Erro ao simular:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProposalSelect = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setStep("form");
  };

  const handleClose = () => {
    setStep("proposals");
    setProposals([]);
    setSelectedProposal(null);
    onClose();
  };

  // Simula automaticamente com valores padrão ao abrir
  useState(() => {
    if (isOpen && car && proposals.length === 0) {
      handleSimulate({
        carId: car.id,
        valor: car.valor,
        entrada: 0,
        parcelaDesejada: 1500,
      });
    }
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900">
                    {car ? `Simulação: ${car.name}` : "Simulação"}
                  </h2>
                  {step === "form" && selectedProposal && (
                    <p className="text-sm text-zinc-600 mt-1">
                      {selectedProposal.nome} selecionada
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                  aria-label="Fechar"
                >
                  <X size={24} weight="bold" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-zinc-600 font-medium">
                        Calculando propostas…
                      </p>
                    </div>
                  </div>
                ) : step === "proposals" && proposals.length > 0 ? (
                  <div>
                    <p className="text-zinc-600 mb-6">
                      Confira as propostas disponíveis para o veículo escolhido
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {proposals.map((proposal) => (
                        <ProposalCard
                          key={proposal.id}
                          proposal={proposal}
                          onSelect={() => handleProposalSelect(proposal)}
                          showType={false}
                        />
                      ))}
                    </div>
                  </div>
                ) : step === "form" ? (
                  <LeadForm
                    proposal={selectedProposal}
                    onSuccess={handleClose}
                    onBack={() => setStep("proposals")}
                  />
                ) : null}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
