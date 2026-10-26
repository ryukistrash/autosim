"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { simulationSchema, type SimulationData } from "@/lib/validations";
import { simulateProposal } from "@/services/simulation";
import { CadastroSimulacaoModal } from "@/components/simulation/CadastroSimulacaoModal";
import { CheckCircle } from "@phosphor-icons/react";
import type { Proposal } from "@/data/proposals";

type Step = "form" | "loading" | "proposals" | "generating";

export default function SimulacaoPage() {
  const [step, setStep] = useState<Step>("form");
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [showCadastroModal, setShowCadastroModal] = useState(false);
  const [pendingSimulationData, setPendingSimulationData] = useState<SimulationData | null>(null);
  const [dadosCliente, setDadosCliente] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SimulationData>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      valor: 70000,
      entrada: 10000,
      parcelaDesejada: 1500,
      objetivo: "curto-prazo",
    },
  });

  const onSubmit = async (data: SimulationData) => {
    // Ao clicar em Simular, salva os dados e abre o modal de cadastro
    setPendingSimulationData(data);
    setShowCadastroModal(true);
  };

  const handleCadastroSuccess = async (dadosCliente: any) => {
    // Após completar o cadastro, fecha o modal e inicia a simulação
    setShowCadastroModal(false);
    setDadosCliente(dadosCliente);

    if (pendingSimulationData) {
      setStep("loading");

      // Aguarda 15 segundos antes de mostrar as propostas
      await new Promise(resolve => setTimeout(resolve, 15000));

      try {
        const results = await simulateProposal(pendingSimulationData, "simulacao");
        setProposals(results);
        setStep("proposals");

        // Salvar simulação completa com dados do cliente
        const simulacao = {
          id: `sim-${Date.now()}`,
          cliente: dadosCliente,
          dados: pendingSimulationData,
          propostas: results,
          dataCadastro: new Date().toISOString(),
          status: "pendente",
        };

        await fetch("/api/admin/simulacoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ simulacao }),
        });
      } catch (error) {
        console.error("Erro ao simular:", error);
        setStep("form");
      }
    }
  };

  const handleCadastroClose = () => {
    setShowCadastroModal(false);
    setPendingSimulationData(null);
  };

  const toggleProposal = (id: string) => {
    setSelectedProposals(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleColocarAnalise = () => {
    if (selectedProposals.length > 0) {
      setStep("generating");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-50 to-blue-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            Simulador de Propostas
          </h1>
          <p className="text-lg text-zinc-600 max-w-[65ch] mx-auto">
            Informe o valor desejado, entrada e parcela para receber propostas
            personalizadas
          </p>
        </motion.div>

        {/* Formulário de Simulação */}
        {step === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                Dados da simulação
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Objetivo */}
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-3">
                    Qual seu objetivo?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="curto-prazo"
                        {...register("objetivo")}
                        className="sr-only peer"
                      />
                      <div className="w-full p-4 border-2 border-zinc-200 rounded-xl peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center">
                        <p className="font-semibold text-zinc-900">Curto Prazo</p>
                        <p className="text-sm text-zinc-600 mt-1">Menor custo</p>
                      </div>
                    </label>
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="longo-prazo"
                        {...register("objetivo")}
                        className="sr-only peer"
                      />
                      <div className="w-full p-4 border-2 border-zinc-200 rounded-xl peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center">
                        <p className="font-semibold text-zinc-900">Longo Prazo</p>
                        <p className="text-sm text-zinc-600 mt-1">Menor parcela</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Valor do veículo */}
                <div>
                  <label
                    htmlFor="valor"
                    className="block text-sm font-semibold text-zinc-900 mb-2"
                  >
                    Valor do veículo
                  </label>
                  <input
                    id="valor"
                    type="number"
                    step="1000"
                    {...register("valor", { valueAsNumber: true })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      errors.valor ? "border-red-500" : "border-zinc-300"
                    }`}
                    placeholder="R$ 70.000"
                  />
                  {errors.valor && (
                    <p className="mt-2 text-sm text-red-600">{errors.valor.message}</p>
                  )}
                </div>

                {/* Entrada */}
                <div>
                  <label
                    htmlFor="entrada"
                    className="block text-sm font-semibold text-zinc-900 mb-2"
                  >
                    Valor de entrada
                  </label>
                  <input
                    id="entrada"
                    type="number"
                    step="1000"
                    {...register("entrada", { valueAsNumber: true })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      errors.entrada ? "border-red-500" : "border-zinc-300"
                    }`}
                    placeholder="R$ 10.000"
                  />
                  {errors.entrada && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.entrada.message}
                    </p>
                  )}
                </div>

                {/* Parcela Desejada */}
                <div>
                  <label
                    htmlFor="parcelaDesejada"
                    className="block text-sm font-semibold text-zinc-900 mb-2"
                  >
                    Valor da parcela desejada
                  </label>
                  <input
                    id="parcelaDesejada"
                    type="number"
                    step="100"
                    {...register("parcelaDesejada", { valueAsNumber: true })}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      errors.parcelaDesejada ? "border-red-500" : "border-zinc-300"
                    }`}
                    placeholder="R$ 1.500"
                  />
                  {errors.parcelaDesejada && (
                    <p className="mt-2 text-sm text-red-600">{errors.parcelaDesejada.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                >
                  Simular
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl shadow-xl p-8 flex items-center justify-center min-h-[400px]"
            >
              <div className="text-center">
                <p className="text-zinc-600">
                  Preencha os dados ao lado e clique em <strong>Simular</strong>{" "}
                  para ver as propostas disponíveis.
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Loading - 15 segundos */}
        {step === "loading" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">
              Simulação de Propostas
            </h3>
            <p className="text-zinc-600">
              Análise em andamento
            </p>
          </motion.div>
        )}

        {/* Propostas - Seleção Múltipla */}
        {step === "proposals" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-zinc-900 mb-3">
                Selecione as Propostas para Análise
              </h2>
              <p className="text-zinc-600">
                Escolha uma ou mais propostas que deseja analisar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {proposals.map((proposal) => {
                const isSelected = selectedProposals.includes(proposal.id);
                const logoMap: { [key: string]: string[] } = {
                  autofinanciamento: [
                    "/logos/autofinanciamento.png",
                    "/logos/autofinanciamento-2.png"
                  ],
                  "carta-credito": [
                    "/logos/carta-credito.png",
                    "/logos/carta-credito-2.jpg"
                  ],
                  financiamento: [
                    "/logos/financiamento-bv.png",
                    "/logos/financiamento-pan.png"
                  ],
                };

                return (
                  <motion.div
                    key={proposal.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleProposal(proposal.id)}
                    className={`relative cursor-pointer bg-white rounded-2xl shadow-lg transition-all overflow-hidden ${
                      isSelected
                        ? "ring-4 ring-blue-500 shadow-xl"
                        : "hover:shadow-xl"
                    }`}
                  >
                    {/* Checkbox - Top Right */}
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-zinc-300"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle size={18} weight="fill" className="text-white" />
                        )}
                      </div>
                    </div>

                    {/* Header com Logo */}
                    <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 p-6 border-b border-zinc-200">
                      <div className="flex items-center justify-center mb-4">
                        <h3 className="text-2xl font-bold text-zinc-900">
                          {proposal.nome}
                        </h3>
                      </div>
                      {/* Logos dos Bancos */}
                      <div className="flex items-center justify-center gap-4">
                        {logoMap[proposal.id].map((logo, idx) => (
                          <img
                            key={idx}
                            src={logo}
                            alt={`${proposal.nome} ${idx + 1}`}
                            className="h-10 object-contain"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Detalhes da Proposta */}
                    <div className="p-6 space-y-4">
                      {/* Valor do Crédito */}
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-xs font-semibold text-blue-600 mb-1">
                          VALOR DO CRÉDITO
                        </p>
                        <p className="text-2xl font-bold text-blue-900">
                          {proposal.valorCredito.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>

                      {/* Grid de Informações */}
                      <div className="space-y-3">
                        {/* Entrada */}
                        <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                          <span className="text-sm font-medium text-zinc-600">
                            Entrada
                          </span>
                          <span className="text-base font-bold text-zinc-900">
                            {proposal.entrada.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>

                        {/* Parcela */}
                        <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                          <span className="text-sm font-medium text-zinc-600">
                            Valor da Parcela
                          </span>
                          <span className="text-base font-bold text-zinc-900">
                            {proposal.parcela.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>

                        {/* Prazo */}
                        <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                          <span className="text-sm font-medium text-zinc-600">
                            Prazo
                          </span>
                          <span className="text-base font-bold text-zinc-900">
                            {proposal.prazo}x meses
                          </span>
                        </div>

                        {/* Valor Final */}
                        <div className="flex justify-between items-center py-3 bg-zinc-50 rounded-lg px-3 mt-2">
                          <span className="text-sm font-semibold text-zinc-700">
                            Valor Final
                          </span>
                          <span className="text-lg font-bold text-zinc-900">
                            {proposal.valorFinal.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Botão Colocar para Análise */}
            <motion.button
              whileHover={{ scale: selectedProposals.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: selectedProposals.length > 0 ? 0.98 : 1 }}
              onClick={handleColocarAnalise}
              disabled={selectedProposals.length === 0}
              className="w-full max-w-2xl mx-auto block py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-full hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
            >
              {selectedProposals.length > 0
                ? `Colocar para Análise (${selectedProposals.length} ${
                    selectedProposals.length === 1 ? "proposta" : "propostas"
                  })`
                : "Selecione ao menos uma proposta"}
            </motion.button>
          </motion.div>
        )}

        {/* Gerando Impressão */}
        {step === "generating" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-16 text-center max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-8" />
            <h3 className="text-3xl font-bold text-zinc-900 mb-4">
              Gerando impressão...
            </h3>
            <p className="text-lg text-zinc-600">
              Aguarde enquanto preparamos o documento
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal de Cadastro - aparece ANTES da simulação */}
      <CadastroSimulacaoModal
        isOpen={showCadastroModal}
        onClose={handleCadastroClose}
        onSuccess={handleCadastroSuccess}
      />
    </main>
  );
}
