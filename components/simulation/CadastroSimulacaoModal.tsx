"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CadastroSimulacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (dados: any) => void;
}

const schema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  cpf: z.string().min(11, "CPF obrigatório"),
  rg: z.string().min(5, "RG obrigatório"),
  telefone: z.string().min(10, "Telefone obrigatório"),
  email: z.string().email("E-mail inválido"),
  nascDia: z.string().min(1, "Dia obrigatório"),
  nascMes: z.string().min(1, "Mês obrigatório"),
  nascAno: z.string().min(1, "Ano obrigatório"),
  score: z.string().min(1, "Score obrigatório"),
  analiseRecente: z.string().min(1, "Campo obrigatório"),
  modalidadesAtivas: z.array(z.string()),
  tipoRenda: z.enum(["clt", "autonomo"]),
  rendaContracheque: z.number().optional(),
  profissao: z.string().optional(),
  contemDeclaracaoAtual: z.string().optional(),
  declaracaoPF: z.string().optional(),
  rendaAnualPF: z.number().optional(),
  declaracaoPJ: z.string().optional(),
  rendaAnualPJ: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

export function CadastroSimulacaoModal({
  isOpen,
  onClose,
  onSuccess,
}: CadastroSimulacaoModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      modalidadesAtivas: [],
      tipoRenda: "clt",
    },
  });

  const tipoRenda = watch("tipoRenda");
  const contemDeclaracaoAtual = watch("contemDeclaracaoAtual");
  const declaracaoPF = watch("declaracaoPF");
  const declaracaoPJ = watch("declaracaoPJ");

  const handleClose = () => {
    setSuccess(false);
    reset();
    onClose();
  };

  // Máscaras
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setValue("cpf", value);
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 5) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    }
    setValue("telefone", value.trim());
  };

  const onSubmit = async (data: FormData) => {
    console.log("✅ Formulário válido, enviando dados:", data);
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSuccess(true);
    setTimeout(() => {
      onSuccess(data);
      setLoading(false);
      handleClose();
    }, 1500);
  };

  const onError = (errors: any) => {
    console.error("❌ Erros de validação:", errors);
    console.log("📋 Campos com erro:", Object.keys(errors));

    // Se não há erros mas chegou aqui, pode ser problema de evento
    if (Object.keys(errors).length === 0) {
      console.log("⚠️ Nenhum erro encontrado, mas onError foi chamado");
      return;
    }

    alert("Por favor, preencha todos os campos obrigatórios corretamente.");
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

              {/* Conteúdo */}
              <div className="p-8">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={48} weight="fill" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-900 mb-3">
                      Análise enviada!
                    </h3>
                    <p className="text-zinc-600">
                      Iniciando sua simulação...
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-zinc-900 mb-3 pr-12">
                        Análise Completa
                      </h2>
                      <p className="text-zinc-600">
                        Preencha todos os dados para análise
                      </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      {/* Nome Completo */}
                      <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          {...register("nome")}
                          className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                          placeholder="Nome completo"
                        />
                        {errors.nome && (
                          <p className="text-sm text-red-600 mt-1">{errors.nome.message}</p>
                        )}
                      </div>

                      {/* CPF e RG */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-zinc-700 mb-2">
                            CPF
                          </label>
                          <input
                            type="text"
                            {...register("cpf")}
                            onChange={handleCPFChange}
                            maxLength={14}
                            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                            placeholder="000.000.000-00"
                          />
                          {errors.cpf && (
                            <p className="text-sm text-red-600 mt-1">{errors.cpf.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-zinc-700 mb-2">
                            RG
                          </label>
                          <input
                            type="text"
                            {...register("rg")}
                            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                            placeholder="00.000.000-0"
                          />
                          {errors.rg && (
                            <p className="text-sm text-red-600 mt-1">{errors.rg.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Telefone e Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-zinc-700 mb-2">
                            Telefone (WhatsApp)
                          </label>
                          <input
                            type="text"
                            {...register("telefone")}
                            onChange={handleTelefoneChange}
                            maxLength={15}
                            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                            placeholder="(00) 00000-0000"
                          />
                          {errors.telefone && (
                            <p className="text-sm text-red-600 mt-1">{errors.telefone.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-zinc-700 mb-2">
                            E-mail
                          </label>
                          <input
                            type="email"
                            {...register("email")}
                            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                            placeholder="nome@email.com"
                          />
                          {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Data de Nascimento */}
                      <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">
                          Data de Nascimento
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <select
                            {...register("nascDia")}
                            className="px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                          >
                            <option value="">Dia</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                              <option key={d} value={String(d).padStart(2, "0")}>
                                {String(d).padStart(2, "0")}
                              </option>
                            ))}
                          </select>

                          <select
                            {...register("nascMes")}
                            className="px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                          >
                            <option value="">Mês</option>
                            {[
                              "Janeiro",
                              "Fevereiro",
                              "Março",
                              "Abril",
                              "Maio",
                              "Junho",
                              "Julho",
                              "Agosto",
                              "Setembro",
                              "Outubro",
                              "Novembro",
                              "Dezembro",
                            ].map((m, i) => (
                              <option key={i} value={String(i + 1).padStart(2, "0")}>
                                {m}
                              </option>
                            ))}
                          </select>

                          <select
                            {...register("nascAno")}
                            className="px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                          >
                            <option value="">Ano</option>
                            {Array.from(
                              { length: 97 },
                              (_, i) => new Date().getFullYear() - i
                            ).map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                        {(errors.nascDia || errors.nascMes || errors.nascAno) && (
                          <p className="text-sm text-red-600 mt-1">Data de nascimento completa é obrigatória</p>
                        )}
                      </div>

                      {/* Score e Análise Recente */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-zinc-700 mb-2">
                            Nível de Score
                          </label>
                          <select
                            {...register("score")}
                            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                          >
                            <option value="">Selecione</option>
                            <option value="Alto">Alto</option>
                            <option value="Regular">Regular</option>
                            <option value="Baixo">Baixo</option>
                          </select>
                          {errors.score && (
                            <p className="text-sm text-red-600 mt-1">{errors.score.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-zinc-700 mb-2">
                            Análise nos últimos 3 meses?
                          </label>
                          <select
                            {...register("analiseRecente")}
                            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                          >
                            <option value="">Selecione</option>
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                          </select>
                          {errors.analiseRecente && (
                            <p className="text-sm text-red-600 mt-1">{errors.analiseRecente.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Modalidades Ativas */}
                      <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">
                          Teve alguma das modalidades ativas?
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {["Financiamento", "Consórcio", "Empréstimo"].map((mod) => (
                            <label key={mod} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                value={mod}
                                {...register("modalidadesAtivas")}
                                className="w-5 h-5 text-blue-600 border-2 border-zinc-300 rounded focus:ring-blue-600"
                              />
                              <span className="text-sm text-zinc-700">{mod}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Tipo de Renda */}
                      <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-2">
                          Autônomo ou Carteira Assinada
                        </label>
                        <select
                          {...register("tipoRenda")}
                          className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                        >
                          <option value="clt">Carteira Assinada</option>
                          <option value="autonomo">Autônomo</option>
                        </select>
                      </div>

                      {/* Campos CLT */}
                      {tipoRenda === "clt" && (
                        <div className="space-y-4 p-4 bg-zinc-50 rounded-xl">
                          <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                              Renda Líquida no Contracheque
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              {...register("rendaContracheque", { valueAsNumber: true })}
                              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                              placeholder="R$ 0,00"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                              Profissão
                            </label>
                            <input
                              type="text"
                              {...register("profissao")}
                              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                            />
                          </div>
                        </div>
                      )}

                      {/* Campos Autônomo */}
                      {tipoRenda === "autonomo" && (
                        <div className="space-y-4 p-4 bg-zinc-50 rounded-xl">
                          <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                              Contém Declaração Atual?
                            </label>
                            <select
                              {...register("contemDeclaracaoAtual")}
                              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                            >
                              <option value="">Selecione</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                              Declaração Pessoa Física?
                            </label>
                            <select
                              {...register("declaracaoPF")}
                              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                            >
                              <option value="">Selecione</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </div>

                          {declaracaoPF === "Sim" && (
                            <div>
                              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Valor da Renda Anual PF
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                {...register("rendaAnualPF", { valueAsNumber: true })}
                                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                                placeholder="R$ 0,00"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-2">
                              Declaração Pessoa Jurídica?
                            </label>
                            <select
                              {...register("declaracaoPJ")}
                              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                            >
                              <option value="">Selecione</option>
                              <option value="Sim">Sim</option>
                              <option value="Não">Não</option>
                            </select>
                          </div>

                          {declaracaoPJ === "Sim" && (
                            <div>
                              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                                Valor da Renda Anual PJ
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                {...register("rendaAnualPJ", { valueAsNumber: true })}
                                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                                placeholder="R$ 0,00"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Botão Submit */}
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                      >
                        {loading ? "Processando..." : "Iniciar Simulação"}
                      </motion.button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
