"use client";

import { motion } from "motion/react";
import { ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { DadosClienteSimplificado } from "@/lib/reprovacao";

const schema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z
    .string()
    .min(11, "CPF inválido")
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido"),
  valorCredito: z.number().min(1000, "Valor mínimo: R$ 1.000"),
  entradaDisponivel: z.number().min(0, "Entrada não pode ser negativa"),
  parcelasDesejadas: z
    .number()
    .min(6, "Mínimo 6 parcelas")
    .max(120, "Máximo 120 parcelas"),
});

type FormData = z.infer<typeof schema>;

interface FormularioClienteProps {
  codigoCarta: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function FormularioCliente({
  codigoCarta,
  onBack,
  onSuccess,
}: FormularioClienteProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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

  const handleCurrencyChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "valorCredito" | "entradaDisponivel"
  ) => {
    const value = parseFloat(e.target.value) || 0;
    setValue(field, value);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const dados: DadosClienteSimplificado = {
        nome: data.nome,
        cpf: data.cpf,
        telefone: data.telefone,
        valorCredito: data.valorCredito,
        entradaDisponivel: data.entradaDisponivel,
        parcelasDesejadas: data.parcelasDesejadas,
      };

      const response = await fetch("/api/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "cliente",
          codigoCarta,
          dados,
        }),
      });

      if (!response.ok) throw new Error("Erro ao enviar solicitação");

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} weight="fill" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 mb-3">
          Solicitação enviada!
        </h3>
        <p className="text-zinc-600">
          Entraremos em contato em breve com mais informações.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} weight="bold" />
        <span className="font-semibold">Voltar</span>
      </button>

      <h2 className="text-3xl font-bold text-zinc-900 mb-3">
        Dados do Cliente
      </h2>
      <p className="text-zinc-600 mb-6">
        Preencha suas informações para solicitar a carta{" "}
        <strong>{codigoCarta}</strong>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            {...register("nome")}
            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
            placeholder="Seu nome completo"
          />
          {errors.nome && (
            <p className="text-sm text-red-600 mt-1">{errors.nome.message}</p>
          )}
        </div>

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
              <p className="text-sm text-red-600 mt-1">
                {errors.telefone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Valor do Crédito Desejado
          </label>
          <input
            type="number"
            step="0.01"
            {...register("valorCredito", { valueAsNumber: true })}
            className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
            placeholder="Ex: 50000"
          />
          {errors.valorCredito && (
            <p className="text-sm text-red-600 mt-1">
              {errors.valorCredito.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Entrada Disponível
            </label>
            <input
              type="number"
              step="0.01"
              {...register("entradaDisponivel", { valueAsNumber: true })}
              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              placeholder="Ex: 10000"
            />
            {errors.entradaDisponivel && (
              <p className="text-sm text-red-600 mt-1">
                {errors.entradaDisponivel.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">
              Parcelas Desejadas
            </label>
            <input
              type="number"
              {...register("parcelasDesejadas", { valueAsNumber: true })}
              className="w-full px-4 py-3 border-2 border-zinc-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              placeholder="Ex: 48"
            />
            {errors.parcelasDesejadas && (
              <p className="text-sm text-red-600 mt-1">
                {errors.parcelasDesejadas.message}
              </p>
            )}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loading ? "Enviando..." : "Enviar Solicitação"}
        </motion.button>
      </form>
    </motion.div>
  );
}
