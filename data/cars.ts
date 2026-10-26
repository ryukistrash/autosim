export interface Car {
  id: string;
  name: string;
  image: string;
  valor: number;
  descricao?: string;
}

export const featuredCars: Car[] = [
  {
    id: "voyage",
    name: "Volkswagen Voyage",
    image: "/cars/voyage.webp",
    valor: 65000,
    descricao: "Sedã completo e confortável",
  },
  {
    id: "onix",
    name: "Chevrolet Onix",
    image: "/cars/onix.webp",
    valor: 72000,
    descricao: "O preferido dos brasileiros",
  },
  {
    id: "hb20",
    name: "Hyundai HB20",
    image: "/cars/hb20.webp",
    valor: 68000,
    descricao: "Design moderno e tecnologia",
  },
  {
    id: "argo",
    name: "Fiat Argo",
    image: "/cars/argo.webp",
    valor: 70000,
    descricao: "Estilo italiano e performance",
  },
  {
    id: "kwid",
    name: "Renault Kwid",
    image: "/cars/kwid.webp",
    valor: 58000,
    descricao: "Compacto e econômico",
  },
  {
    id: "gol",
    name: "Volkswagen Gol",
    image: "/cars/gol.webp",
    valor: 62000,
    descricao: "Clássico brasileiro renovado",
  },
];
