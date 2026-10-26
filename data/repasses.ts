export interface RepasseVehicle {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  km: number;
  valor: number;
  imagem: string;
  descricao: string;
  destaque?: boolean;
  combustivel: string;
  cambio: string;
  cor: string;
}

// Mock de veículos de repasse
export const repasseVehicles: RepasseVehicle[] = [
  {
    id: "repasse-1",
    marca: "Toyota",
    modelo: "Corolla XEi",
    ano: 2021,
    km: 35000,
    valor: 95000,
    imagem: "/cars/corolla.webp",
    descricao: "Sedan executivo, único dono, revisões em dia",
    destaque: true,
    combustivel: "Flex",
    cambio: "Automático",
    cor: "Prata",
  },
  {
    id: "repasse-2",
    marca: "Honda",
    modelo: "Civic EXL",
    ano: 2020,
    km: 42000,
    valor: 88000,
    imagem: "/cars/civic.webp",
    descricao: "Completo, top de linha, impecável",
    combustivel: "Flex",
    cambio: "CVT",
    cor: "Preto",
  },
  {
    id: "repasse-3",
    marca: "Jeep",
    modelo: "Compass Sport",
    ano: 2022,
    km: 28000,
    valor: 115000,
    imagem: "/cars/compass.webp",
    descricao: "SUV moderno, perfeito estado",
    destaque: true,
    combustivel: "Flex",
    cambio: "Automático",
    cor: "Branco",
  },
  {
    id: "repasse-4",
    marca: "Volkswagen",
    modelo: "T-Cross Highline",
    ano: 2021,
    km: 31000,
    valor: 98000,
    imagem: "/cars/tcross.webp",
    descricao: "SUV compacto, multimídia, câmera de ré",
    combustivel: "Flex",
    cambio: "Automático",
    cor: "Cinza",
  },
  {
    id: "repasse-5",
    marca: "Hyundai",
    modelo: "Creta Prestige",
    ano: 2020,
    km: 45000,
    valor: 85000,
    imagem: "/cars/creta.webp",
    descricao: "SUV familiar, econômico, espaçoso",
    combustivel: "Flex",
    cambio: "Automático",
    cor: "Vermelho",
  },
  {
    id: "repasse-6",
    marca: "Chevrolet",
    modelo: "Tracker Premier",
    ano: 2021,
    km: 38000,
    valor: 92000,
    imagem: "/cars/tracker.webp",
    descricao: "Design moderno, tecnologia embarcada",
    combustivel: "Turbo",
    cambio: "Automático",
    cor: "Azul",
  },
];
