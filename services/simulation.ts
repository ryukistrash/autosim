import { generateProposals, type Proposal } from "@/data/proposals";
import { type SimulationData } from "@/lib/validations";

export async function simulateProposal(
  data: SimulationData,
  tipo: "card" | "simulacao"
): Promise<Proposal[]> {
  // Simula delay de API - 15 segundos para simulação completa
  const delay = tipo === "simulacao" ? 15000 : 800;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return generateProposals({
    valor: data.valor,
    entrada: data.entrada,
    parcelaDesejada: data.parcelaDesejada,
    tipo,
  });
}

export async function simulateProposalByCarId(
  carId: string,
  data: Partial<SimulationData>
): Promise<Proposal[]> {
  // Simula busca do valor do carro pelo ID
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Aqui virá a lógica real de buscar o carro
  const valor = data.valor || 70000;
  const entrada = data.entrada || 0;
  const parcelaDesejada = data.parcelaDesejada || 1500;

  return generateProposals({
    valor,
    entrada,
    parcelaDesejada,
    tipo: "card",
  });
}
