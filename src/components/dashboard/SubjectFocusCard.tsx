/**
 * SubjectFocusCard Component
 * Konu odağı kartı
 */

"use client";

import React from "react";
import { Card } from "@/components/shared/Card";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { Button } from "@/components/shared/Button";

export function SubjectFocusCard() {
  // Örnek veri - gerçek implementasyonda study plan'dan gelecek
  const subject = "Tarih";
  const topic = "Türk-İslam Devletleri";
  const progress = 42;

  return (
    <section className="px-6 pb-6">
      <Card variant="lavender" padding="lg" className="relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-200/50 blur-xl dark:bg-purple-900/30" />
        
        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              auto_stories
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">
              Konu Odağı
            </span>
          </div>
          <h3 className="mb-1 text-xl font-bold text-text-main dark:text-white">
            {subject}
          </h3>
          <p className="text-sm font-medium text-text-sub dark:text-gray-400">
            {topic}
          </p>
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs font-medium text-text-sub">
              <span>İlerleme</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar percentage={progress} height="md" color="bg-purple-500" />
          </div>
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            className="mt-5 bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            icon="arrow_forward"
            iconPosition="right"
          >
            Çalışmaya Devam Et
          </Button>
        </div>
      </Card>
    </section>
  );
}
