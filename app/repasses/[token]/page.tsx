"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { LockKey, Funnel } from "@phosphor-icons/react";
import { validateToken } from "@/services/tokens";
import { repasseVehicles, type RepasseVehicle } from "@/data/repasses";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

function RepassesContent() {
  const params = useParams();
  const token = params.token as string;
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [filter, setFilter] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      const valid = await validateToken(token);
      setIsValid(valid);
      setIsValidating(false);
    };
    checkToken();
  }, [token]);

  if (isValidating) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600 font-medium">Validando acesso…</p>
        </div>
      </main>
    );
  }

  if (!isValid) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white pt-24 pb-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-md px-4"
        >
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <LockKey size={40} weight="duotone" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Acesso negado</h1>
          <p className="text-zinc-300 leading-relaxed mb-8">
            O link de acesso ao catálogo de repasses é inválido, expirado ou foi
            desativado. Entre em contato conosco para obter um novo link.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 font-semibold rounded-full hover:bg-zinc-100 transition-colors"
          >
            Voltar para o site
          </a>
        </motion.div>
      </main>
    );
  }

  const filteredVehicles = repasseVehicles.filter((vehicle) => {
    const matchesFilter = filter === "todos" || vehicle.marca === filter;
    const matchesSearch =
      searchTerm === "" ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const marcas = Array.from(new Set(repasseVehicles.map((v) => v.marca)));

  return (
    <main className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
            Catálogo de Repasses
          </h1>
          <p className="text-lg text-zinc-600">
            Veículos selecionados com condições especiais
          </p>
        </motion.div>

        {/* Filtros e Busca */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="bg-zinc-50 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Busca */}
              <div>
                <label htmlFor="search" className="sr-only">
                  Buscar veículo
                </label>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por marca ou modelo…"
                  className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Filtro por marca */}
              <div>
                <label htmlFor="filter" className="sr-only">
                  Filtrar por marca
                </label>
                <div className="relative">
                  <Funnel
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white appearance-none"
                  >
                    <option value="todos">Todas as marcas</option>
                    {marcas.map((marca) => (
                      <option key={marca} value={marca}>
                        {marca}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid de veículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <VehicleCard vehicle={vehicle} />
            </motion.div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-zinc-600 text-lg">
              Nenhum veículo encontrado com os filtros aplicados.
            </p>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function RepassesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-zinc-600 font-medium">Carregando…</p>
          </div>
        </main>
      }
    >
      <RepassesContent />
    </Suspense>
  );
}

function VehicleCard({ vehicle }: { vehicle: RepasseVehicle }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
      {vehicle.destaque && (
        <div className="bg-blue-600 text-white text-xs font-bold px-4 py-2 text-center">
          Destaque
        </div>
      )}

      {/* Imagem */}
      <div className="aspect-[4/3] bg-gradient-to-br from-zinc-100 to-zinc-50 relative">
        {!imageError ? (
          <Image
            src={vehicle.imagem}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-zinc-400 text-sm px-4 text-center">
              {vehicle.marca}
              <br />
              {vehicle.modelo}
            </p>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-zinc-900 mb-2">
          {vehicle.marca} {vehicle.modelo}
        </h3>
        <p className="text-sm text-zinc-600 mb-4">{vehicle.descricao}</p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <span className="text-zinc-500">Ano:</span>{" "}
            <span className="font-semibold text-zinc-900">{vehicle.ano}</span>
          </div>
          <div>
            <span className="text-zinc-500">KM:</span>{" "}
            <span className="font-semibold text-zinc-900">
              {vehicle.km.toLocaleString("pt-BR")}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Câmbio:</span>{" "}
            <span className="font-semibold text-zinc-900">{vehicle.cambio}</span>
          </div>
          <div>
            <span className="text-zinc-500">Cor:</span>{" "}
            <span className="font-semibold text-zinc-900">{vehicle.cor}</span>
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-4 mb-4">
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(vehicle.valor)}
          </p>
        </div>

        <button
          onClick={() => alert('Entre em contato através dos canais disponíveis no rodapé do site.')}
          className="block w-full py-3 bg-blue-600 text-white text-center font-semibold rounded-full hover:bg-blue-700 transition-colors"
        >
          Tenho interesse
        </button>
      </div>
    </div>
  );
}
