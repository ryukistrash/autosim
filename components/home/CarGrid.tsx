"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { type Car } from "@/data/cars";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

interface CarGridProps {
  onCarSelect?: (carId: string) => void;
}

export function CarGrid({ onCarSelect }: CarGridProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCars() {
      try {
        const response = await fetch("/api/admin/veiculos");
        const data = await response.json();
        if (data.success) {
          setCars(data.cars);
        }
      } catch (error) {
        console.error("Erro ao carregar veículos:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCars();
  }, []);

  return (
    <section id="carros" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            Escolha seu próximo veículo
          </h2>
          <p className="text-lg text-zinc-600 max-w-[65ch] mx-auto">
            Confira nossa seleção de veículos e simule as condições de pagamento
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <CarCard car={car} onSelect={onCarSelect} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CarCard({
  car,
  onSelect,
}: {
  car: Car;
  onSelect?: (carId: string) => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Imagem */}
      <div className="aspect-[4/3] bg-gradient-to-br from-zinc-100 to-zinc-50 relative overflow-hidden">
        {!imageError ? (
          <Image
            src={car.image}
            alt={car.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-zinc-400 text-sm px-4 text-center">
              {car.name}
            </p>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-zinc-900 mb-2">{car.name}</h3>
        {car.descricao && (
          <p className="text-sm text-zinc-600 mb-4">{car.descricao}</p>
        )}
        <p className="text-2xl font-bold text-blue-600 mb-6">
          Entrada de {formatCurrency(car.valor)}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect?.(car.id)}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
        >
          Simular
        </motion.button>
      </div>
    </div>
  );
}
