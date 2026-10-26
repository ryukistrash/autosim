"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  SignOut,
  Link as LinkIcon,
  Copy,
  CheckCircle,
  Prohibit,
  Plus,
  PencilSimple,
  Trash,
  UploadSimple,
  X,
  Image as ImageIcon,
  Car as CarIcon,
} from "@phosphor-icons/react";
import { generateToken, listTokens } from "@/services/tokens";
import { siteTexts } from "@/data/texts";

interface Car {
  id: string;
  name: string;
  image: string;
  valor: number;
  descricao?: string;
}

interface Carta {
  codigo: string;
  tipo: "imovel" | "veiculo";
  banco: string;
  valorCredito: number;
  valorEntrada: number;
  prazo: number;
  parcela: number;
  dataCadastro?: string;
}

const BANCOS_DISPONIVEIS = [
  "GFT/Bradesco",
  "Volkswagen",
  "Banco do Brasil",
  "Promove",
  "Ademicon",
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"veiculos" | "images360" | "cartas" | "simulacoes" | "tokens">("veiculos");
  const [tokens, setTokens] = useState<any[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Veículos
  const [cars, setCars] = useState<Car[]>([]);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [showCarModal, setShowCarModal] = useState(false);

  // Imagens 360
  const [images360, setImages360] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Cartas contempladas
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [editingCarta, setEditingCarta] = useState<Carta | null>(null);
  const [showCartaModal, setShowCartaModal] = useState(false);

  // Simulações
  const [simulacoes, setSimulacoes] = useState<any[]>([]);

  useEffect(() => {
    // Verificar autenticação
    const auth = localStorage.getItem("admin_authenticated");
    if (auth !== "true") {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      loadTokens();
      loadCars();
      loadImages360();
      loadCartas();
      loadSimulacoes();
    }
  }, [router]);

  const loadTokens = async () => {
    const tokenList = await listTokens();
    setTokens(tokenList);
  };

  const loadCars = async () => {
    try {
      const response = await fetch("/api/admin/veiculos");
      const data = await response.json();
      if (data.success) {
        setCars(data.cars);
      }
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    }
  };

  const loadImages360 = async () => {
    try {
      const response = await fetch("/api/admin/images-360");
      const data = await response.json();
      if (data.success) {
        setImages360(data.images);
      }
    } catch (error) {
      console.error("Erro ao carregar imagens 360:", error);
    }
  };

  const loadCartas = async () => {
    try {
      const response = await fetch("/api/admin/cartas");
      const data = await response.json();
      if (data.success) {
        setCartas(data.cartas);
      }
    } catch (error) {
      console.error("Erro ao carregar cartas:", error);
    }
  };

  const loadSimulacoes = async () => {
    try {
      const response = await fetch("/api/admin/simulacoes");
      const data = await response.json();
      if (data.success) {
        setSimulacoes(data.simulacoes);
      }
    } catch (error) {
      console.error("Erro ao carregar simulações:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    router.push("/admin/login");
  };

  const handleGenerateToken = async () => {
    const newToken = await generateToken();
    await loadTokens();
    copyToClipboard(newToken);
  };

  const copyToClipboard = (token: string) => {
    const fullUrl = `${window.location.origin}/repasses/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Funções de veículos
  const handleSaveCar = async (car: Car) => {
    try {
      const response = await fetch("/api/admin/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ car }),
      });
      const data = await response.json();
      if (data.success) {
        setCars(data.cars);
        setShowCarModal(false);
        setEditingCar(null);
      }
    } catch (error) {
      console.error("Erro ao salvar veículo:", error);
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este veículo?")) return;

    try {
      const response = await fetch(`/api/admin/veiculos?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setCars(data.cars);
      }
    } catch (error) {
      console.error("Erro ao remover veículo:", error);
    }
  };

  // Upload de imagens
  const handleUpload = async (file: File, type: "car" | "360") => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        if (type === "360") {
          const newImages = [...images360, data.url];
          setImages360(newImages);
          await fetch("/api/admin/images-360", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ images: newImages }),
          });
        }
        return data.url;
      }
    } catch (error) {
      console.error("Erro no upload:", error);
    } finally {
      setUploading(false);
    }
    return null;
  };

  const handleRemoveImage360 = async (url: string) => {
    const newImages = images360.filter((img) => img !== url);
    setImages360(newImages);
    await fetch("/api/admin/images-360", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: newImages }),
    });
  };

  // Funções de cartas contempladas
  const handleSaveCarta = async (carta: Carta) => {
    try {
      const response = await fetch("/api/admin/cartas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carta }),
      });
      const data = await response.json();
      if (data.success) {
        setCartas(data.cartas);
        setShowCartaModal(false);
        setEditingCarta(null);
      }
    } catch (error) {
      console.error("Erro ao salvar carta:", error);
    }
  };

  const handleDeleteCarta = async (codigo: string) => {
    if (!confirm("Tem certeza que deseja remover esta carta?")) return;

    try {
      const response = await fetch(`/api/admin/cartas?codigo=${codigo}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setCartas(data.cartas);
      }
    } catch (error) {
      console.error("Erro ao remover carta:", error);
    }
  };

  const handleDeleteSimulacao = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta simulação?")) return;

    try {
      const response = await fetch(`/api/admin/simulacoes?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setSimulacoes(data.simulacoes);
      }
    } catch (error) {
      console.error("Erro ao remover simulação:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">
              Painel Administrativo
            </h1>
            <p className="text-zinc-600">
              Gerencie conteúdos e acesso ao catálogo
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-200 text-zinc-900 font-semibold rounded-full hover:bg-zinc-300 transition-colors"
          >
            <SignOut size={20} weight="bold" />
            Sair
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => setActiveTab("veiculos")}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === "veiculos"
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Veículos
          </button>
          <button
            onClick={() => setActiveTab("cartas")}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === "cartas"
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Cartas Contempladas
          </button>
          <button
            onClick={() => setActiveTab("simulacoes")}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === "simulacoes"
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Simulações
          </button>
          <button
            onClick={() => setActiveTab("images360")}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === "images360"
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Imagens 3D (360°)
          </button>
          <button
            onClick={() => setActiveTab("tokens")}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === "tokens"
                ? "bg-blue-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Links de Repasses
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          {activeTab === "veiculos" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">
                  Gerenciar Veículos
                </h2>
                <button
                  onClick={() => {
                    if (cars.length >= 6) {
                      alert("Você já atingiu o limite de 6 veículos cadastrados.");
                      return;
                    }
                    setEditingCar(null);
                    setShowCarModal(true);
                  }}
                  disabled={cars.length >= 6}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} weight="bold" />
                  Adicionar Veículo
                </button>
              </div>

              {cars.length >= 6 && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-800">
                    <strong>Limite atingido:</strong> Você já possui 6 veículos cadastrados (máximo permitido).
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {cars.map((car) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl"
                  >
                    <div className="w-24 h-24 bg-zinc-100 rounded-lg overflow-hidden shrink-0">
                      {car.image && (
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-zinc-900">{car.name}</p>
                      <p className="text-sm text-zinc-600">{car.descricao}</p>
                      <p className="text-sm text-blue-600 font-semibold mt-1">
                        Entrada: R$ {car.valor.toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCar(car);
                          setShowCarModal(true);
                        }}
                        className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                        aria-label="Editar"
                      >
                        <PencilSimple size={20} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                        aria-label="Remover"
                      >
                        <Trash size={20} className="text-red-600" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {cars.length === 0 && (
                  <div className="text-center py-12 text-zinc-500">
                    Nenhum veículo cadastrado. Clique em "Adicionar Veículo" para
                    criar o primeiro.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "cartas" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">
                  Gerenciar Cartas Contempladas
                </h2>
                <button
                  onClick={() => {
                    setEditingCarta(null);
                    setShowCartaModal(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} weight="bold" />
                  Adicionar Carta
                </button>
              </div>

              <div className="space-y-4">
                {cartas.map((carta) => (
                  <motion.div
                    key={carta.codigo}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 border border-zinc-200 rounded-xl"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Código</p>
                        <p className="font-mono font-semibold text-zinc-900">{carta.codigo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Tipo / Banco</p>
                        <p className="text-sm text-zinc-900">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mr-2 ${
                            carta.tipo === "imovel" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"
                          }`}>
                            {carta.tipo === "imovel" ? "Imóvel" : "Veículo"}
                          </span>
                          {carta.banco}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Crédito / Entrada</p>
                        <p className="text-sm text-zinc-900">
                          R$ {carta.valorCredito.toLocaleString("pt-BR")}
                          <br />
                          <span className="text-xs text-zinc-600">Entrada: R$ {carta.valorEntrada.toLocaleString("pt-BR")}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-semibold mb-1">Prazo / Parcela</p>
                        <p className="text-sm text-zinc-900">
                          {carta.prazo} meses
                          <br />
                          <span className="text-xs text-zinc-600">R$ {carta.parcela.toLocaleString("pt-BR")}/mês</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingCarta(carta);
                          setShowCartaModal(true);
                        }}
                        className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                        aria-label="Editar"
                      >
                        <PencilSimple size={20} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteCarta(carta.codigo)}
                        className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                        aria-label="Remover"
                      >
                        <Trash size={20} className="text-red-600" />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {cartas.length === 0 && (
                  <div className="text-center py-12 text-zinc-500">
                    Nenhuma carta cadastrada. Clique em "Adicionar Carta" para criar a primeira.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "simulacoes" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">
                  Simulações de Clientes
                </h2>
                <div className="text-sm text-zinc-600">
                  Total: <strong>{simulacoes.length}</strong> simulações
                </div>
              </div>

              <div className="space-y-4">
                {simulacoes.map((simulacao) => (
                  <motion.div
                    key={simulacao.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border border-zinc-200 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-zinc-900 text-lg">
                            {simulacao.cliente.nome}
                          </h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {simulacao.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-zinc-600">
                          <p>
                            <strong>CPF:</strong> {simulacao.cliente.cpf}
                          </p>
                          <p>
                            <strong>Telefone:</strong> {simulacao.cliente.telefone}
                          </p>
                          <p className="col-span-2">
                            <strong>E-mail:</strong> {simulacao.cliente.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSimulacao(simulacao.id)}
                        className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                        aria-label="Remover"
                      >
                        <Trash size={20} className="text-red-600" />
                      </button>
                    </div>

                    <div className="border-t border-zinc-200 pt-4">
                      <p className="text-xs text-zinc-500 uppercase font-semibold mb-3">
                        Dados da Simulação
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Valor do Veículo</p>
                          <p className="font-semibold text-zinc-900">
                            R$ {simulacao.dados.valor.toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Entrada</p>
                          <p className="font-semibold text-zinc-900">
                            R$ {simulacao.dados.entrada.toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Parcela Desejada</p>
                          <p className="font-semibold text-zinc-900">
                            R$ {simulacao.dados.parcelaDesejada.toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">Objetivo</p>
                          <p className="font-semibold text-zinc-900">
                            {simulacao.dados.objetivo === "curto-prazo" ? "Curto Prazo" : "Longo Prazo"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-zinc-50 rounded-lg p-4">
                        <p className="text-xs text-zinc-500 uppercase font-semibold mb-2">
                          Propostas Geradas
                        </p>
                        <div className="space-y-2">
                          {simulacao.propostas.map((proposta: any) => (
                            <div key={proposta.id} className="flex items-center justify-between text-sm">
                              <span className="font-medium text-zinc-900">
                                {proposta.nome}
                              </span>
                              <span className="text-zinc-600">
                                R$ {proposta.parcela.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-zinc-500 mt-4">
                        Cadastrado em {new Date(simulacao.dataCadastro).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {simulacoes.length === 0 && (
                  <div className="text-center py-12 text-zinc-500">
                    Nenhuma simulação cadastrada ainda.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "images360" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                  Imagens 3D (Visualizador 360°)
                </h2>
                <p className="text-zinc-600">
                  Faça upload das imagens que serão usadas na visualização 3D da
                  página inicial. As imagens devem estar em sequência para criar o
                  efeito de rotação.
                </p>
              </div>

              <div className="mb-6">
                <label className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-zinc-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                  <UploadSimple size={24} className="text-zinc-600" />
                  <span className="text-zinc-600 font-semibold">
                    {uploading ? "Enviando..." : "Clique para fazer upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      for (const file of files) {
                        await handleUpload(file, "360");
                      }
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {images360.map((url, index) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square bg-zinc-100 rounded-lg overflow-hidden group"
                  >
                    <img
                      src={url}
                      alt={`Frame ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveImage360(url)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded">
                      #{index + 1}
                    </div>
                  </motion.div>
                ))}

                {images360.length === 0 && (
                  <div className="col-span-4 text-center py-12 text-zinc-500">
                    Nenhuma imagem 3D enviada ainda. Faça upload das imagens para o
                    visualizador 360°.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "tokens" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-zinc-900">
                  Links de Acesso ao Catálogo
                </h2>
                <button
                  onClick={handleGenerateToken}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} weight="bold" />
                  Gerar Novo Link
                </button>
              </div>

              <div className="space-y-4">
                {tokens.map((token) => (
                  <motion.div
                    key={token.token}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border border-zinc-200 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <LinkIcon size={20} className="text-blue-600 shrink-0" />
                          <code className="text-sm text-zinc-600 font-mono truncate">
                            {window.location.origin}/repasses/{token.token}
                          </code>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                          <span>
                            Criado em{" "}
                            {new Date(token.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              token.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {token.isActive ? "Ativo" : "Desativado"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => copyToClipboard(token.token)}
                          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                          aria-label="Copiar link"
                        >
                          {copiedToken === token.token ? (
                            <CheckCircle size={20} weight="fill" className="text-green-600" />
                          ) : (
                            <Copy size={20} className="text-zinc-600" />
                          )}
                        </button>
                        {token.isActive && (
                          <button
                            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                            aria-label="Desativar link"
                          >
                            <Prohibit size={20} className="text-red-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {tokens.length === 0 && (
                  <div className="text-center py-12 text-zinc-500">
                    Nenhum link gerado ainda. Clique em "Gerar Novo Link" para
                    criar o primeiro.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Veículo */}
      {showCarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-zinc-900">
                {editingCar ? "Editar Veículo" : "Adicionar Veículo"}
              </h3>
              <button
                onClick={() => {
                  setShowCarModal(false);
                  setEditingCar(null);
                }}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-zinc-600" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                const car: Car = {
                  id: editingCar?.id || `car-${Date.now()}`,
                  name: formData.get("name") as string,
                  image: formData.get("image") as string,
                  valor: Number(formData.get("valor")),
                  descricao: formData.get("descricao") as string,
                };

                await handleSaveCar(car);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Nome do Veículo *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCar?.name}
                  required
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ex: Volkswagen Gol"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  name="descricao"
                  defaultValue={editingCar?.descricao}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ex: Clássico brasileiro renovado"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Valor de Entrada (R$) *
                </label>
                <input
                  type="number"
                  name="valor"
                  defaultValue={editingCar?.valor}
                  required
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Ex: 62000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">
                  Upload de Imagem
                </label>
                <div className="mb-2">
                  <label className="flex items-center justify-center gap-3 px-4 py-3 border-2 border-dashed border-zinc-300 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                    <UploadSimple size={20} className="text-zinc-600" />
                    <span className="text-sm text-zinc-600 font-semibold">
                      {uploading ? "Enviando..." : "Clique para fazer upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleUpload(file, "car");
                          if (url) {
                            const imageInput = document.querySelector(
                              'input[name="image"]'
                            ) as HTMLInputElement;
                            if (imageInput) imageInput.value = url;
                          }
                        }
                      }}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  name="image"
                  defaultValue={editingCar?.image}
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="/cars/exemplo.webp"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Ou insira o caminho da imagem manualmente
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {editingCar ? "Salvar Alterações" : "Adicionar Veículo"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCarModal(false);
                    setEditingCar(null);
                  }}
                  className="px-6 py-3 bg-zinc-200 text-zinc-900 font-semibold rounded-full hover:bg-zinc-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal de Carta Contemplada */}
      {showCartaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-zinc-900">
                {editingCarta ? "Editar Carta" : "Adicionar Carta Contemplada"}
              </h3>
              <button
                onClick={() => {
                  setShowCartaModal(false);
                  setEditingCarta(null);
                }}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-zinc-600" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                const carta: Carta = {
                  codigo: editingCarta?.codigo || "",
                  tipo: formData.get("tipo") as "imovel" | "veiculo",
                  banco: formData.get("banco") as string,
                  valorCredito: Number(formData.get("valorCredito")),
                  valorEntrada: Number(formData.get("valorEntrada")),
                  prazo: Number(formData.get("prazo")),
                  parcela: Number(formData.get("parcela")),
                };

                await handleSaveCarta(carta);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    Tipo *
                  </label>
                  <select
                    name="tipo"
                    defaultValue={editingCarta?.tipo}
                    required
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="imovel">Imóvel</option>
                    <option value="veiculo">Veículo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    Banco *
                  </label>
                  <select
                    name="banco"
                    defaultValue={editingCarta?.banco}
                    required
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Selecione o banco</option>
                    {BANCOS_DISPONIVEIS.map((banco) => (
                      <option key={banco} value={banco}>
                        {banco}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    Valor do Crédito (R$) *
                  </label>
                  <input
                    type="number"
                    name="valorCredito"
                    defaultValue={editingCarta?.valorCredito}
                    required
                    min="0"
                    max="500000"
                    step="1000"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ex: 250000"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Máximo: R$ 500.000
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    Valor de Entrada (R$) *
                  </label>
                  <input
                    type="number"
                    name="valorEntrada"
                    defaultValue={editingCarta?.valorEntrada}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ex: 50000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    Prazo (meses) *
                  </label>
                  <input
                    type="number"
                    name="prazo"
                    defaultValue={editingCarta?.prazo}
                    required
                    min="12"
                    max="180"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ex: 60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">
                    Valor da Parcela (R$) *
                  </label>
                  <input
                    type="number"
                    name="parcela"
                    defaultValue={editingCarta?.parcela}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Ex: 3500.00"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                >
                  {editingCarta ? "Salvar Alterações" : "Adicionar Carta"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCartaModal(false);
                    setEditingCarta(null);
                  }}
                  className="px-6 py-3 bg-zinc-200 text-zinc-900 font-semibold rounded-full hover:bg-zinc-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  );
}
