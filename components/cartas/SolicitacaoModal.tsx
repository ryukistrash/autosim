"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, User, UserCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { FormularioCliente } from "./FormularioCliente";
import { FormularioConsultor } from "./FormularioConsultor";

interface SolicitacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  codigoCarta: string;
}

type Step = "escolha" | "cliente" | "consultor";

export function SolicitacaoModal({
  isOpen,
  onClose,
  codigoCarta,
}: SolicitacaoModalProps) {
  const [step, setStep] = useState<Step>("escolha");

  const handleClose = () => {
    setStep("escolha");
    onClose();
  };

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
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8 relative"
            >
              {/* Botão fechar */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors z-10"
              >
                <X size={24} weight="bold" className="text-zinc-600" />
              </button>

              {/* Conteúdo do modal */}
              <div className="p-8">
                {step === "escolha" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-3xl font-bold text-zinc-900 mb-3 pr-12">
                      Como deseja prosseguir?
                    </h2>
                    <p className="text-zinc-600 mb-8">
                      Escolha a opção que melhor se adequa ao seu perfil
                    </p>

                    <div className="text-center mb-6">
                      <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                        Carta: {codigoCarta}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Opção Cliente */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep("cliente")}
                        className="p-6 border-2 border-zinc-200 rounded-2xl hover:border-blue-600 hover:bg-blue-50/50 transition-all text-left group"
                      >
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <User size={28} weight="duotone" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">
                          Sou Cliente
                        </h3>
                        <p className="text-sm text-zinc-600">
                          Preencha um formulário simplificado com suas
                          informações básicas
                        </p>
                      </motion.button>

                      {/* Opção Consultor */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep("consultor")}
                        className="p-6 border-2 border-zinc-200 rounded-2xl hover:border-purple-600 hover:bg-purple-50/50 transition-all text-left group"
                      >
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <UserCircle size={28} weight="duotone" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 mb-2">
                          Sou Consultor
                        </h3>
                        <p className="text-sm text-zinc-600">
                          Realize uma análise completa da documentação do
                          cliente
                        </p>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === "cliente" && (
                  <FormularioCliente
                    codigoCarta={codigoCarta}
                    onBack={() => setStep("escolha")}
                    onSuccess={handleClose}
                  />
                )}

                {step === "consultor" && (
                  <FormularioConsultor
                    codigoCarta={codigoCarta}
                    onBack={() => setStep("escolha")}
                    onSuccess={handleClose}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
