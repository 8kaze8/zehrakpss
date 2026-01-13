/**
 * Study Plan Data
 * Çalışma planı verisi - Ocak 2026'ten Temmuz 2026'e kadar
 */

import type { StudyPlan } from "@/types";

export const studyPlan: StudyPlan = {
  startDate: "2026-01-13",
  endDate: "2026-07-31",
  months: [
    {
      month: "OCAK",
      year: 2026,
      weeks: [
        {
          weekNumber: 3,
          dateRange: {
            start: "2026-01-13",
            end: "2026-01-19",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 15,
            speedQuestions: 15,
          },
          subjects: {
            tarih: "Türk-İslam Devletleri",
            cografya: "Coğrafi Konum (M. Eğit)",
            matematik: "Rasyonel Sayılar & Ondalık",
            turkce: "Dil Bilgisi (Sözcük Yapısı)",
          },
          weeklyGoal: "Mat Deneme Analizi (10 Boş)",
        },
        {
          weekNumber: 4,
          dateRange: {
            start: "2026-01-20",
            end: "2026-01-26",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 15,
            speedQuestions: 15,
          },
          subjects: {
            tarih: "Osmanlı Kültür & Medeniyet",
            cografya: "Yer Şekilleri (Dağ, Ova)",
            matematik: "Üslü & Köklü Sayılar",
            turkce: "Dil Bilgisi (Ses Bilgisi)",
          },
          weeklyGoal: "1 Adet Türkçe Branş Denemesi",
        },
      ],
    },
    {
      month: "ŞUBAT",
      year: 2026,
      weeks: [
        {
          weekNumber: 1,
          dateRange: {
            start: "2026-01-29",
            end: "2026-02-04",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 15,
            speedQuestions: 15,
          },
          subjects: {
            tarih: "Osmanlı Kuruluş & Yükselme",
            cografya: "Yer Şekilleri (Plato, Su)",
            matematik: "Basit Eşitsizlik & Mutlak",
            turkce: "Dil Bilgisi (Yazım & Nokta)",
          },
          weeklyGoal: "1 Adet Tarih Branş Denemesi",
        },
        {
          weekNumber: 2,
          dateRange: {
            start: "2026-02-05",
            end: "2026-02-11",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 15,
            speedQuestions: 15,
          },
          subjects: {
            tarih: "Osmanlı Duraklama & Gerileme",
            cografya: "İklim ve Bitki Örtüsü",
            matematik: "Çarpanlara Ayırma & Denklem",
            turkce: "Sözel Mantık Başlangıç",
          },
          weeklyGoal: "1 Adet Genel Kültür Denemesi",
        },
        {
          weekNumber: 3,
          dateRange: {
            start: "2026-02-12",
            end: "2026-02-18",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 15,
            speedQuestions: 15,
          },
          subjects: {
            tarih: "Osmanlı Dağılma (Islahatlar)",
            cografya: "Nüfus ve Yerleşme",
            matematik: "Oran - Orantı",
            turkce: "Sözel Mantık Uygulama",
          },
          weeklyGoal: "1 Adet Matematik Branş Denemesi",
        },
        {
          weekNumber: 4,
          dateRange: {
            start: "2026-02-19",
            end: "2026-02-25",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 15,
            speedQuestions: 10,
          },
          subjects: {
            tarih: "XX. YY Başında Osmanlı",
            cografya: "Türkiye'de Göç",
            matematik: "PROBLEMLER (Sayı-Kesir)",
            turkce: "Paragraf Hız Denemesi",
          },
          weeklyGoal: "1 Adet Genel Yetenek Denemesi",
        },
      ],
    },
    {
      month: "MART",
      year: 2026,
      weeks: [
        {
          weekNumber: 1,
          dateRange: {
            start: "2026-02-26",
            end: "2026-03-03",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 20,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "I. Dünya Savaşı & Mondros",
            cografya: "Tarım ve Hayvancılık",
            matematik: "PROBLEMLER (Sayı-Kesir)",
            turkce: "Türkçe Genel Tekrar",
          },
          weeklyGoal: "1 Adet Türkiye Geneli Deneme",
        },
        {
          weekNumber: 2,
          dateRange: {
            start: "2026-03-04",
            end: "2026-03-10",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 20,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "MİLLİ MÜCADELE HAZIRLIK",
            cografya: "Madenler ve Enerji",
            matematik: "PROBLEMLER (Yaş-İşçi)",
            turkce: "Dil Bilgisi Soru Kampı",
          },
          weeklyGoal: "Mart Check-up Denemesi",
        },
        {
          weekNumber: 3,
          dateRange: {
            start: "2026-03-11",
            end: "2026-03-17",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 20,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "KONGRELER VE GENELGELER",
            cografya: "Sanayi ve Ticaret",
            matematik: "PROBLEMLER (Yüzde-Kar)",
            turkce: "Dil Bilgisi Soru Kampı",
          },
          weeklyGoal: "2 Adet Matematik Branş Denemesi",
        },
        {
          weekNumber: 4,
          dateRange: {
            start: "2026-03-18",
            end: "2026-03-24",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 20,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "I. TBMM DÖNEMİ",
            cografya: "Ulaşım ve Turizm",
            matematik: "PROBLEMLER (Karışım-Hız)",
            turkce: "Sözel Mantık İleri",
          },
          weeklyGoal: "1 Adet Tarih Branş Denemesi",
        },
      ],
    },
    {
      month: "NİSAN",
      year: 2026,
      weeks: [
        {
          weekNumber: 1,
          dateRange: {
            start: "2026-03-25",
            end: "2026-03-31",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 20,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "MUHAREBELER (CEPHELER)",
            cografya: "Coğrafya Genel Tekrar",
            matematik: "PROBLEMLER (Grafik)",
            turkce: "Paragraf Soru Avı",
          },
          weeklyGoal: "1 Adet TG Deneme",
        },
        {
          weekNumber: 2,
          dateRange: {
            start: "2026-04-01",
            end: "2026-04-07",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 20,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "MUDANYA VE LOZAN",
            cografya: "Coğrafya Branş Denemesi",
            matematik: "Kümeler & Veri Analizi",
            turkce: "Cümle Ögeleri",
          },
          weeklyGoal: "2 Adet Coğrafya Branş Denemesi",
        },
        {
          weekNumber: 3,
          dateRange: {
            start: "2026-04-08",
            end: "2026-04-14",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 20,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "ATATÜRK İNKILAPLARI - 1",
            cografya: "Coğrafya Branş Denemesi",
            matematik: "Fonksiyonlar & İşlem",
            turkce: "Cümle Türleri",
          },
          weeklyGoal: "2 Adet Matematik Branş Denemesi",
        },
        {
          weekNumber: 4,
          dateRange: {
            start: "2026-04-15",
            end: "2026-04-21",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 20,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "ATATÜRK İNKILAPLARI - 2",
            cografya: "Coğrafya Soru Kampı",
            matematik: "PERMÜTASYON & KOMB.",
            turkce: "Anlatım Bozuklukları",
          },
          weeklyGoal: "2 Adet Tarih Branş Denemesi",
        },
      ],
    },
    {
      month: "MAYIS",
      year: 2026,
      weeks: [
        {
          weekNumber: 1,
          dateRange: {
            start: "2026-04-22",
            end: "2026-04-28",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 0,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "Atatürk İlkeleri & Dış Pol.",
            cografya: "Karma Soru Çözümü",
            matematik: "OLASILIK",
            turkce: "TEMEL HUKUK BİLGİSİ",
          },
          weeklyGoal: "Branş Deneme Haftası",
        },
        {
          weekNumber: 2,
          dateRange: {
            start: "2026-04-29",
            end: "2026-05-05",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 0,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "Çağdaş Türk ve Dünya - 1",
            cografya: "Coğrafya Soru Avı",
            matematik: "GEOMETRİ (Açılar)",
            turkce: "ANAYASA TARİHİ",
          },
          weeklyGoal: "1 Adet TG Deneme",
        },
        {
          weekNumber: 3,
          dateRange: {
            start: "2026-05-06",
            end: "2026-05-12",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 0,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "Çağdaş Türk ve Dünya - 2",
            cografya: "Coğrafya Soru Avı",
            matematik: "GEOMETRİ (Üçgenler)",
            turkce: "YASAMA & YÜRÜTME",
          },
          weeklyGoal: "2 Adet Genel Deneme",
        },
        {
          weekNumber: 4,
          dateRange: {
            start: "2026-05-13",
            end: "2026-05-19",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 0,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "Tarih Genel Tekrar",
            cografya: "Karma Deneme Çözümü",
            matematik: "Geometri (Dörtgenler)",
            turkce: "YARGI & İDARE HUKUKU",
          },
          weeklyGoal: "2 Adet Genel Deneme",
        },
      ],
    },
    {
      month: "HAZİRAN",
      year: 2026,
      weeks: [
        {
          weekNumber: 1,
          dateRange: {
            start: "2026-05-20",
            end: "2026-05-26",
          },
          dailyRoutine: {
            paragraphs: 20,
            problems: 0,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "Tarih Soru Avı",
            cografya: "Coğrafya Genel Tekrar",
            matematik: "Matematik Genel Tekrar",
            turkce: "Vatandaşlık Soru Avı",
          },
          weeklyGoal: "Eksik Konu Kapama",
        },
        {
          weekNumber: 2,
          dateRange: {
            start: "2026-05-27",
            end: "2026-06-02",
          },
          dailyRoutine: {
            paragraphs: 0,
            problems: 0,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "KONU TESLİMİ",
            cografya: "KONU TESLİMİ",
            matematik: "KONU TESLİMİ",
            turkce: "VATANDAŞLIK BİTİŞ",
          },
          weeklyGoal: "HAZİRAN TESLİM RAPORU",
        },
        {
          weekNumber: 3,
          dateRange: {
            start: "2026-06-03",
            end: "2026-06-09",
          },
          dailyRoutine: {
            paragraphs: 0,
            problems: 0,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "ANALİZ",
            cografya: "ANALİZ",
            matematik: "ANALİZ",
            turkce: "GÜNCEL BİLGİLER",
          },
          weeklyGoal: "Her Gün 1 Genel Deneme",
        },
        {
          weekNumber: 4,
          dateRange: {
            start: "2026-06-10",
            end: "2026-06-16",
          },
          dailyRoutine: {
            paragraphs: 0,
            problems: 0,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "ANALİZ",
            cografya: "ANALİZ",
            matematik: "ANALİZ",
            turkce: "GÜNCEL BİLGİLER",
          },
          weeklyGoal: "Her Gün 1 Genel Deneme",
        },
      ],
    },
    {
      month: "TEMMUZ",
      year: 2026,
      weeks: [
        {
          weekNumber: 1,
          dateRange: {
            start: "2026-06-17",
            end: "2026-07-31",
          },
          dailyRoutine: {
            paragraphs: 0,
            problems: 0,
            speedQuestions: 0,
          },
          subjects: {
            tarih: "TEKRAR",
            cografya: "TEKRAR",
            matematik: "TEKRAR",
            turkce: "TEKRAR",
          },
          weeklyGoal: "90+ PUAN VE ATAMA",
        },
      ],
    },
  ],
};
