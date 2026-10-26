import { z } from "zod";
import { validateCPF } from "./utils";

export const leadFormSchema = z.object({
  nome: z.string().min(3, "Nome completo é obrigatório"),
  cpf: z
    .string()
    .min(11, "CPF inválido")
    .refine(validateCPF, "CPF inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  consentimento: z.boolean().refine((val) => val === true, {
    message: "Você precisa consentir com o uso dos dados",
  }),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

export const simulationSchema = z.object({
  carId: z.string().optional(),
  valor: z.number().min(1000, "Valor mínimo de R$ 1.000"),
  entrada: z.number().min(5000, "Valor mínimo de entrada é R$ 5.000"),
  parcelaDesejada: z.number().min(400, "Valor mínimo de parcela é R$ 400"),
  objetivo: z.enum(["curto-prazo", "longo-prazo"]).optional(),
});

export type SimulationData = z.infer<typeof simulationSchema>;
