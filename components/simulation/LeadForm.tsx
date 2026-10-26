"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import { leadFormSchema, type LeadFormData } from "@/lib/validations";
import { formatCPF, formatPhone } from "@/lib/utils";
import { submitLead } from "@/services/leads";
import type { Proposal } from "@/data/proposals";

interface LeadFormProps {
  proposal: Proposal | null;
  onSuccess: () => void;
  onBack?: () => void;
}

export function LeadForm({ proposal, onSuccess, onBack }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      await submitLead(data);
      setSubmitSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} weight="fill" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 mb-4">
          Solicitação enviada com sucesso!
        </h3>
        <p className="text-zinc-600 max-w-[65ch] mx-auto">
          Nossa equipe entrará em contato em breve para dar continuidade à sua
          solicitação.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} weight="bold" />
          Voltar para propostas
        </button>
      )}

      <p className="text-zinc-600 mb-6">
        Preencha seus dados para que possamos entrar em contato e finalizar sua
        solicitação.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nome Completo */}
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-semibold text-zinc-900 mb-2"
          >
            Nome completo
          </label>
          <input
            id="nome"
            type="text"
            {...register("nome")}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.nome ? "border-red-500" : "border-zinc-300"
            }`}
            placeholder="João da Silva"
          />
          {errors.nome && (
            <p className="mt-2 text-sm text-red-600">{errors.nome.message}</p>
          )}
        </div>

        {/* CPF */}
        <div>
          <label
            htmlFor="cpf"
            className="block text-sm font-semibold text-zinc-900 mb-2"
          >
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            {...register("cpf")}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              setValue("cpf", formatted);
            }}
            maxLength={14}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.cpf ? "border-red-500" : "border-zinc-300"
            }`}
            placeholder="000.000.000-00"
            autoComplete="off"
          />
          {errors.cpf && (
            <p className="mt-2 text-sm text-red-600">{errors.cpf.message}</p>
          )}
        </div>

        {/* Telefone/WhatsApp */}
        <div>
          <label
            htmlFor="telefone"
            className="block text-sm font-semibold text-zinc-900 mb-2"
          >
            Telefone/WhatsApp
          </label>
          <input
            id="telefone"
            type="tel"
            {...register("telefone")}
            onChange={(e) => {
              const formatted = formatPhone(e.target.value);
              setValue("telefone", formatted);
            }}
            maxLength={15}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.telefone ? "border-red-500" : "border-zinc-300"
            }`}
            placeholder="(11) 99999-9999"
            autoComplete="tel"
            inputMode="numeric"
          />
          {errors.telefone && (
            <p className="mt-2 text-sm text-red-600">
              {errors.telefone.message}
            </p>
          )}
        </div>

        {/* E-mail */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-zinc-900 mb-2"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.email ? "border-red-500" : "border-zinc-300"
            }`}
            placeholder="seu@email.com.br"
            autoComplete="email"
            inputMode="email"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Consentimento LGPD */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("consentimento")}
              className={`mt-1 w-5 h-5 border-2 rounded focus:ring-2 focus:ring-blue-600 ${
                errors.consentimento ? "border-red-500" : "border-zinc-300"
              }`}
            />
            <span className="text-sm text-zinc-700 leading-relaxed">
              Autorizo o uso dos meus dados pessoais para que a AutoSim
              Financeira entre em contato comigo sobre esta solicitação,
              conforme a Lei Geral de Proteção de Dados.
            </span>
          </label>
          {errors.consentimento && (
            <p className="mt-2 text-sm text-red-600">
              {errors.consentimento.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="w-full py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando…" : "Enviar solicitação"}
        </motion.button>
      </form>
    </div>
  );
}
