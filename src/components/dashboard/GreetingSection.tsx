/**
 * GreetingSection Component
 * Hoş geldin mesajı ve motivasyon
 */

"use client";

import React from "react";
import { getGreeting } from "@/utils/formatters";

interface GreetingSectionProps {
  userName?: string;
}

export function GreetingSection({ userName = "Zehra" }: GreetingSectionProps) {
  const greeting = getGreeting();

  return (
    <section className="px-6 pt-2 pb-6">
      <h1 className="text-3xl font-bold tracking-tight text-text-main dark:text-white">
        {greeting}, {userName} 👋
      </h1>
      <p className="mt-2 text-base font-normal text-text-sub">
        Hadi bugünkü hedeflerini tamamlayalım.
      </p>
    </section>
  );
}
