import { type LeadFormData } from "@/lib/validations";

export async function submitLead(data: LeadFormData): Promise<{
  success: boolean;
  message: string;
}> {
  // Simula envio para API/CRM
  await new Promise((resolve) => setTimeout(resolve, 1200));

  console.log("Lead capturado:", data);

  return {
    success: true,
    message: "Seus dados foram enviados com sucesso! Nossa equipe entrará em contato em breve.",
  };
}
