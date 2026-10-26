"use client";

import { motion } from "motion/react";
import { ArrowLeft, Warning, Spinner, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  analisarDocumentacao,
  validarCPF,
  validarEmail,
  type DadosCliente,
  type ResultadoAnalise,
} from "@/lib/reprovacao";

const schema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().min(11, "CPF obrigatório"),
  rg: z.string().min(1, "RG obrigatório"),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  nascDia: z.string().min(1, "Dia obrigatório"),
  nascMes: z.string().min(1, "Mês obrigatório"),
  nascAno: z.string().min(4, "Ano obrigatório"),
  score: z.string().min(1, "Score obrigatório"),
  analiseRecente: z.string().min(1, "Campo obrigatório"),
  modalidadesAtivas: z.array(z.string()),
  tipoRenda: z.enum(["clt", "autonomo"]),
  rendaContracheque: z.union([z.number(), z.nan()]).optional(),
  profissao: z.string().optional(),
  contemDeclaracaoAtual: z.string().optional(),
  declaracaoPF: z.string().optional(),
  rendaAnualPF: z.union([z.number(), z.nan()]).optional(),
  declaracaoPJ: z.string().optional(),
  rendaAnualPJ: z.union([z.number(), z.nan()]).optional(),
  rendaBancaria: z.union([z.number(), z.nan()]).optional(),
});

type FormData = z.infer<typeof schema>;

interface FormularioConsultorProps {
  codigoCarta: string;
  onBack: () => void;
  onSuccess: () => void;
}

type AnaliseStep =
  | "form"
  | "ready"
  | "analyzing"
  | "reprovado" // Agora mostra tudo na mesma tela
  | "gerando_impressao"; // NOVO: tela final

export function FormularioConsultor({
  codigoCarta,
  onBack,
  onSuccess,
}: FormularioConsultorProps) {
  const [step, setStep] = useState<AnaliseStep>("form");
  const [resultado, setResultado] = useState<ResultadoAnalise | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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
    console.log("🚀 Formulário submetido!", data);

    // Montar dados do cliente
    const dados: DadosCliente = {
      nome: data.nome,
      cpf: data.cpf,
      rg: data.rg || "",
      telefone: data.telefone,
      email: data.email,
      nascimento: `${data.nascDia}/${data.nascMes}/${data.nascAno}`,
      score: data.score as any,
      analiseRecente: data.analiseRecente as any,
      modalidadesAtivas: data.modalidadesAtivas || [],
      tipoRenda: data.tipoRenda,
      rendaContracheque: data.rendaContracheque,
      profissao: data.profissao,
      contemDeclaracaoAtual: data.contemDeclaracaoAtual as any,
      declaracaoPF: data.declaracaoPF as any,
      rendaAnualPF: data.rendaAnualPF,
      declaracaoPJ: data.declaracaoPJ as any,
      rendaAnualPJ: data.rendaAnualPJ,
      rendaBancaria: data.rendaBancaria,
    };

    console.log("📋 Dados do cliente:", dados);

    // Salvar resultado para usar depois
    setResultado(analisarDocumentacao(dados));

    // Salvar no backend
    try {
      await fetch("/api/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "consultor",
          codigoCarta,
          dados,
        }),
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }

    // Ir para tela de "pronto para iniciar"
    setStep("ready");
  };

  const [showAlternativas, setShowAlternativas] = useState(false);
  const [showVerificando, setShowVerificando] = useState(false);
  const [showProtocolo, setShowProtocolo] = useState(false);

  const iniciarAnalise = () => {
    if (!resultado) return;

    console.log("⏳ Iniciando análise...");
    setStep("analyzing");

    // Análise (15 segundos)
    setTimeout(() => {
      console.log("📊 Mostrando resultado da análise...");
      setStep("reprovado");

      // Após 10 segundos, mostra "Verificando alternativas..."
      setTimeout(() => {
        console.log("💭 Mostrando alternativas...");
        setShowAlternativas(true);

        // Após mais 5 segundos, mostra "Verificando propostas..."
        setTimeout(() => {
          console.log("🔍 Mostrando verificação...");
          setShowVerificando(true);

          // Após 25 segundos, mostra botão do protocolo
          setTimeout(() => {
            console.log("✅ Protocolo disponível!");
            setShowProtocolo(true);
          }, 25000); // 25 segundos verificando
        }, 5000); // 5 segundos até começar a verificar
      }, 10000); // 10 segundos vendo a reprovação
    }, 15000); // 15 segundos analisando
  };

  const onError = (errors: any) => {
    console.error("❌ Erros de validação:", errors);
    alert("Por favor, preencha todos os campos obrigatórios corretamente.");
  };

  // Tela "Pronto para iniciar"
  if (step === "ready") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} weight="fill" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 mb-3">
          Dados Recebidos com Sucesso!
        </h3>
        <p className="text-zinc-600 mb-8">
          Agora vamos analisar a documentação do cliente.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={iniciarAnalise}
          className="px-8 py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-colors"
        >
          Gerar Análise da Documentação
        </motion.button>
      </motion.div>
    );
  }

  // Tela de análise
  if (step === "analyzing") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 mb-3">
          Gerando análise...
        </h3>
        <p className="text-zinc-600">
          Analisando documentação do cliente, aguarde.
        </p>
      </motion.div>
    );
  }

  // Tela "Gerando impressão" - aparece ao clicar no botão final
  if (step === "gerando_impressao") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
          <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
        <h3 className="text-3xl font-bold text-zinc-900 mb-3">
          Gerando impressão...
        </h3>
        <p className="text-zinc-600">
          Aguarde enquanto preparamos o documento
        </p>
      </motion.div>
    );
  }

  // Tela de reprovação - TUDO NA MESMA TELA COM DESIGN MELHORADO
  if (step === "reprovado" && resultado) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-4 space-y-4"
      >
        {/* Banner de Reprovação - DESIGN MELHORADO E COMPACTO */}
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-300 rounded-2xl p-5 shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center">
              <Warning size={22} weight="fill" className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-700 mb-0.5">
                {resultado.mensagem}
              </h3>
              <p className="text-xs text-red-600/80">
                A documentação não atende os requisitos mínimos
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-red-200">
            <p className="text-sm font-bold text-zinc-800 mb-3 flex items-center gap-2">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              Possíveis causas identificadas:
            </p>
            <ul className="space-y-2">
              {resultado.causas.map((causa, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-zinc-700"
                >
                  <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm leading-relaxed font-medium">
                    {causa}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-red-200">
              <p className="text-xs font-mono font-bold text-red-700">
                ERROR 4578 AF
              </p>
            </div>
          </div>
        </div>

        {/* Verificando alternativas - aparece após 10s */}
        {showAlternativas && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-2"
          >
            <p className="text-lg font-bold text-blue-700">
              Verificando alternativas para o seu perfil...
            </p>
          </motion.div>
        )}

        {/* Card de Verificação OU Protocolo - SUBSTITUIÇÃO, NÃO EMPILHAMENTO */}
        {showVerificando && !showProtocolo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-300 rounded-2xl p-6 text-center shadow-lg"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"></div>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">
              Verificando propostas alternativas…
            </h3>
            <p className="text-sm text-zinc-600">
              Aguarde enquanto buscamos a melhor opção para você
            </p>
          </motion.div>
        )}

        {/* Protocolo encontrado - SUBSTITUI o card de verificação */}
        {showProtocolo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-300 rounded-2xl p-6 text-center shadow-lg"
          >
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} weight="fill" className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">
              NOVO PROTOCOLO ALTERNATIVO ENCONTRADO
            </h3>
            <p className="text-base text-zinc-700 mb-6 max-w-xl mx-auto">
              Identificamos uma proposta alternativa que pode atender suas
              necessidades.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep("gerando_impressao")}
              className="px-8 py-3.5 bg-green-600 text-white text-base font-bold rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              Ver Proposta Alternativa
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Formulário
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-h-[70vh] overflow-y-auto pr-2"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} weight="bold" />
        <span className="font-semibold">Voltar</span>
      </button>

      <h2 className="text-3xl font-bold text-zinc-900 mb-3">
        Análise Completa
      </h2>
      <p className="text-zinc-600 mb-6">
        Preencha todos os dados para análise da carta{" "}
        <strong>{codigoCarta}</strong>
      </p>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            {...register("nome")}
            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
              placeholder="(00) 00000-0000"
            />
            {errors.telefone && (
              <p className="text-sm text-red-600 mt-1">
                {errors.telefone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
              placeholder="nome@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
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
              className="px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
              className="px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
              className="px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
        </div>

        {/* Score e Análise Recente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Nível de Score
            </label>
            <select
              {...register("score")}
              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
            >
              <option value="">Selecione</option>
              <option value="Alto">Alto</option>
              <option value="Regular">Regular</option>
              <option value="Baixo">Baixo</option>
            </select>
            {errors.score && (
              <p className="text-sm text-red-600 mt-1">
                {errors.score.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Análise nos últimos 3 meses?
            </label>
            <select
              {...register("analiseRecente")}
              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
            >
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
            {errors.analiseRecente && (
              <p className="text-sm text-red-600 mt-1">
                {errors.analiseRecente.message}
              </p>
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
                  className="w-5 h-5 text-purple-600 border-2 border-zinc-300 rounded focus:ring-purple-600"
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
            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
                className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
                  placeholder="R$ 0,00"
                />
              </div>
            )}

            {contemDeclaracaoAtual === "Não" &&
              declaracaoPF === "Não" &&
              declaracaoPJ === "Não" && (
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 mb-2">
                    Renda Bancária Líquida
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("rendaBancaria", { valueAsNumber: true })}
                    className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
                    placeholder="R$ 0,00"
                  />
                </div>
              )}
          </div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-colors mt-6"
        >
          Iniciar Análise
        </motion.button>
      </form>
    </motion.div>
  );
}
