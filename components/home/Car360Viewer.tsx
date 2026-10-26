"use client";

import Image from "next/image";

export function Car360Viewer() {
  return (
    <div className="w-full">
      <div className="relative w-full max-w-4xl mx-auto">
        <Image
          src="/car-render.png"
          alt="Veículo em destaque"
          width={1200}
          height={800}
          className="w-full h-auto rounded-2xl shadow-2xl"
          priority
        />
      </div>
      <p className="text-sm text-zinc-500 text-center mt-6">
        Confira nossos veículos disponíveis
      </p>
    </div>
  );
}
