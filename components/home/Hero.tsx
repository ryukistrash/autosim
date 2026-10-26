"use client";

import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { siteTexts } from "@/data/texts";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-zinc-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-900 tracking-tight leading-none mb-6">
              {siteTexts.hero.title}
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed max-w-[65ch] mb-8">
              {siteTexts.hero.subtitle}
            </p>
            <motion.a
              href="#carros"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
            >
              {siteTexts.hero.ctaText}
              <ArrowRight size={20} weight="bold" />
            </motion.a>
          </motion.div>

          {/* Imagem do carro */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full aspect-[4/3]">
              <Image
                src="/car-render.png"
                alt="Veículo em destaque"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-zinc-300 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
