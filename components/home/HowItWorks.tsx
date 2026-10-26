"use client";

import { motion } from "motion/react";
import { siteTexts } from "@/data/texts";
import {
  MagnifyingGlass,
  Calculator,
  ChartBar,
  CheckCircle
} from "@phosphor-icons/react";

const icons = [MagnifyingGlass, Calculator, ChartBar, CheckCircle];

export function HowItWorks() {
  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
            {siteTexts.howItWorks.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteTexts.howItWorks.steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative"
              >
                <div className="text-center">
                  {/* Número */}
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                    {index + 1}
                  </div>

                  {/* Ícone */}
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon size={40} weight="duotone" />
                  </div>

                  {/* Conteúdo */}
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Linha conectora (desktop) */}
                {index < siteTexts.howItWorks.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-zinc-200" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
