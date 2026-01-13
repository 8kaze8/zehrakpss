/**
 * Subjects Data
 * Tüm derslerin konu listesi - Study plan'dan çıkarıldı
 */

import type { Subject } from "@/types";

export interface SubjectTopic {
  id: string;
  name: string;
  weeks: string[]; // Hangi haftalarda işlendiği
  month: string;
  order: number; // Konu sırası
}

export interface SubjectData {
  subject: Subject;
  topics: SubjectTopic[];
  totalQuestions: number;
}

/**
 * TARİH Konuları (27 Soru)
 */
export const tarihTopics: SubjectTopic[] = [
  { id: "tarih-1", name: "Türk-İslam Devletleri", weeks: ["OCAK-3"], month: "OCAK", order: 1 },
  { id: "tarih-2", name: "Osmanlı Kültür & Medeniyet", weeks: ["OCAK-4"], month: "OCAK", order: 2 },
  { id: "tarih-3", name: "Osmanlı Kuruluş & Yükselme", weeks: ["ŞUBAT-1"], month: "ŞUBAT", order: 3 },
  { id: "tarih-4", name: "Osmanlı Duraklama & Gerileme", weeks: ["ŞUBAT-2"], month: "ŞUBAT", order: 4 },
  { id: "tarih-5", name: "Osmanlı Dağılma (Islahatlar)", weeks: ["ŞUBAT-3"], month: "ŞUBAT", order: 5 },
  { id: "tarih-6", name: "XX. YY Başında Osmanlı", weeks: ["ŞUBAT-4"], month: "ŞUBAT", order: 6 },
  { id: "tarih-7", name: "I. Dünya Savaşı & Mondros", weeks: ["MART-1"], month: "MART", order: 7 },
  { id: "tarih-8", name: "MİLLİ MÜCADELE HAZIRLIK", weeks: ["MART-2"], month: "MART", order: 8 },
  { id: "tarih-9", name: "KONGRELER VE GENELGELER", weeks: ["MART-3"], month: "MART", order: 9 },
  { id: "tarih-10", name: "I. TBMM DÖNEMİ", weeks: ["MART-4"], month: "MART", order: 10 },
  { id: "tarih-11", name: "MUHAREBELER (CEPHELER)", weeks: ["NİSAN-1"], month: "NİSAN", order: 11 },
  { id: "tarih-12", name: "MUDANYA VE LOZAN", weeks: ["NİSAN-2"], month: "NİSAN", order: 12 },
  { id: "tarih-13", name: "ATATÜRK İNKILAPLARI - 1", weeks: ["NİSAN-3"], month: "NİSAN", order: 13 },
  { id: "tarih-14", name: "ATATÜRK İNKILAPLARI - 2", weeks: ["NİSAN-4"], month: "NİSAN", order: 14 },
  { id: "tarih-15", name: "Atatürk İlkeleri & Dış Pol.", weeks: ["MAYIS-1"], month: "MAYIS", order: 15 },
  { id: "tarih-16", name: "Çağdaş Türk ve Dünya - 1", weeks: ["MAYIS-2"], month: "MAYIS", order: 16 },
  { id: "tarih-17", name: "Çağdaş Türk ve Dünya - 2", weeks: ["MAYIS-3"], month: "MAYIS", order: 17 },
  { id: "tarih-18", name: "Tarih Genel Tekrar", weeks: ["MAYIS-4"], month: "MAYIS", order: 18 },
  { id: "tarih-19", name: "Tarih Soru Avı", weeks: ["HAZİRAN-1"], month: "HAZİRAN", order: 19 },
  { id: "tarih-20", name: "KONU TESLİMİ", weeks: ["HAZİRAN-2"], month: "HAZİRAN", order: 20 },
  { id: "tarih-21", name: "ANALİZ", weeks: ["HAZİRAN-3", "HAZİRAN-4"], month: "HAZİRAN", order: 21 },
  { id: "tarih-22", name: "TEKRAR", weeks: ["TEMMUZ"], month: "TEMMUZ", order: 22 },
];

/**
 * COĞRAFYA Konuları (18 Soru)
 */
export const cografyaTopics: SubjectTopic[] = [
  { id: "cografya-1", name: "Coğrafi Konum (M. Eğit)", weeks: ["OCAK-3"], month: "OCAK", order: 1 },
  { id: "cografya-2", name: "Yer Şekilleri (Dağ, Ova)", weeks: ["OCAK-4"], month: "OCAK", order: 2 },
  { id: "cografya-3", name: "Yer Şekilleri (Plato, Su)", weeks: ["ŞUBAT-1"], month: "ŞUBAT", order: 3 },
  { id: "cografya-4", name: "İklim ve Bitki Örtüsü", weeks: ["ŞUBAT-2"], month: "ŞUBAT", order: 4 },
  { id: "cografya-5", name: "Nüfus ve Yerleşme", weeks: ["ŞUBAT-3"], month: "ŞUBAT", order: 5 },
  { id: "cografya-6", name: "Türkiye'de Göç", weeks: ["ŞUBAT-4"], month: "ŞUBAT", order: 6 },
  { id: "cografya-7", name: "Tarım ve Hayvancılık", weeks: ["MART-1"], month: "MART", order: 7 },
  { id: "cografya-8", name: "Madenler ve Enerji", weeks: ["MART-2"], month: "MART", order: 8 },
  { id: "cografya-9", name: "Sanayi ve Ticaret", weeks: ["MART-3"], month: "MART", order: 9 },
  { id: "cografya-10", name: "Ulaşım ve Turizm", weeks: ["MART-4"], month: "MART", order: 10 },
  { id: "cografya-11", name: "Coğrafya Genel Tekrar", weeks: ["NİSAN-1"], month: "NİSAN", order: 11 },
  { id: "cografya-12", name: "Coğrafya Branş Denemesi", weeks: ["NİSAN-2", "NİSAN-3"], month: "NİSAN", order: 12 },
  { id: "cografya-13", name: "Coğrafya Soru Kampı", weeks: ["NİSAN-4"], month: "NİSAN", order: 13 },
  { id: "cografya-14", name: "Karma Soru Çözümü", weeks: ["MAYIS-1"], month: "MAYIS", order: 14 },
  { id: "cografya-15", name: "Coğrafya Soru Avı", weeks: ["MAYIS-2", "MAYIS-3"], month: "MAYIS", order: 15 },
  { id: "cografya-16", name: "Coğrafya Genel Tekrar", weeks: ["HAZİRAN-1"], month: "HAZİRAN", order: 16 },
  { id: "cografya-17", name: "KONU TESLİMİ", weeks: ["HAZİRAN-2"], month: "HAZİRAN", order: 17 },
  { id: "cografya-18", name: "ANALİZ", weeks: ["HAZİRAN-3", "HAZİRAN-4"], month: "HAZİRAN", order: 18 },
  { id: "cografya-19", name: "TEKRAR", weeks: ["TEMMUZ"], month: "TEMMUZ", order: 19 },
];

/**
 * MATEMATİK Konuları (30 Soru)
 */
export const matematikTopics: SubjectTopic[] = [
  { id: "matematik-1", name: "Rasyonel Sayılar & Ondalık", weeks: ["OCAK-3"], month: "OCAK", order: 1 },
  { id: "matematik-2", name: "Üslü & Köklü Sayılar", weeks: ["OCAK-4"], month: "OCAK", order: 2 },
  { id: "matematik-3", name: "Basit Eşitsizlik & Mutlak", weeks: ["ŞUBAT-1"], month: "ŞUBAT", order: 3 },
  { id: "matematik-4", name: "Çarpanlara Ayırma & Denklem", weeks: ["ŞUBAT-2"], month: "ŞUBAT", order: 4 },
  { id: "matematik-5", name: "Oran - Orantı", weeks: ["ŞUBAT-3"], month: "ŞUBAT", order: 5 },
  { id: "matematik-6", name: "PROBLEMLER (Sayı-Kesir)", weeks: ["ŞUBAT-4", "MART-1"], month: "ŞUBAT", order: 6 },
  { id: "matematik-7", name: "PROBLEMLER (Yaş-İşçi)", weeks: ["MART-2"], month: "MART", order: 7 },
  { id: "matematik-8", name: "PROBLEMLER (Yüzde-Kar)", weeks: ["MART-3"], month: "MART", order: 8 },
  { id: "matematik-9", name: "PROBLEMLER (Karışım-Hız)", weeks: ["MART-4"], month: "MART", order: 9 },
  { id: "matematik-10", name: "PROBLEMLER (Grafik)", weeks: ["NİSAN-1"], month: "NİSAN", order: 10 },
  { id: "matematik-11", name: "Kümeler & Veri Analizi", weeks: ["NİSAN-2"], month: "NİSAN", order: 11 },
  { id: "matematik-12", name: "Fonksiyonlar & İşlem", weeks: ["NİSAN-3"], month: "NİSAN", order: 12 },
  { id: "matematik-13", name: "PERMÜTASYON & KOMB.", weeks: ["NİSAN-4"], month: "NİSAN", order: 13 },
  { id: "matematik-14", name: "OLASILIK", weeks: ["MAYIS-1"], month: "MAYIS", order: 14 },
  { id: "matematik-15", name: "GEOMETRİ (Açılar)", weeks: ["MAYIS-2"], month: "MAYIS", order: 15 },
  { id: "matematik-16", name: "GEOMETRİ (Üçgenler)", weeks: ["MAYIS-3"], month: "MAYIS", order: 16 },
  { id: "matematik-17", name: "Geometri (Dörtgenler)", weeks: ["MAYIS-4"], month: "MAYIS", order: 17 },
  { id: "matematik-18", name: "Matematik Genel Tekrar", weeks: ["HAZİRAN-1"], month: "HAZİRAN", order: 18 },
  { id: "matematik-19", name: "KONU TESLİMİ", weeks: ["HAZİRAN-2"], month: "HAZİRAN", order: 19 },
  { id: "matematik-20", name: "ANALİZ", weeks: ["HAZİRAN-3", "HAZİRAN-4"], month: "HAZİRAN", order: 20 },
  { id: "matematik-21", name: "TEKRAR", weeks: ["TEMMUZ"], month: "TEMMUZ", order: 21 },
];

/**
 * TÜRKÇE Konuları
 */
export const turkceTopics: SubjectTopic[] = [
  { id: "turkce-1", name: "Dil Bilgisi (Sözcük Yapısı)", weeks: ["OCAK-3"], month: "OCAK", order: 1 },
  { id: "turkce-2", name: "Dil Bilgisi (Ses Bilgisi)", weeks: ["OCAK-4"], month: "OCAK", order: 2 },
  { id: "turkce-3", name: "Dil Bilgisi (Yazım & Nokta)", weeks: ["ŞUBAT-1"], month: "ŞUBAT", order: 3 },
  { id: "turkce-4", name: "Sözel Mantık Başlangıç", weeks: ["ŞUBAT-2"], month: "ŞUBAT", order: 4 },
  { id: "turkce-5", name: "Sözel Mantık Uygulama", weeks: ["ŞUBAT-3"], month: "ŞUBAT", order: 5 },
  { id: "turkce-6", name: "Paragraf Hız Denemesi", weeks: ["ŞUBAT-4"], month: "ŞUBAT", order: 6 },
  { id: "turkce-7", name: "Türkçe Genel Tekrar", weeks: ["MART-1"], month: "MART", order: 7 },
  { id: "turkce-8", name: "Dil Bilgisi Soru Kampı", weeks: ["MART-2", "MART-3"], month: "MART", order: 8 },
  { id: "turkce-9", name: "Sözel Mantık İleri", weeks: ["MART-4"], month: "MART", order: 9 },
  { id: "turkce-10", name: "Paragraf Soru Avı", weeks: ["NİSAN-1"], month: "NİSAN", order: 10 },
  { id: "turkce-11", name: "Cümle Ögeleri", weeks: ["NİSAN-2"], month: "NİSAN", order: 11 },
  { id: "turkce-12", name: "Cümle Türleri", weeks: ["NİSAN-3"], month: "NİSAN", order: 12 },
  { id: "turkce-13", name: "Anlatım Bozuklukları", weeks: ["NİSAN-4"], month: "NİSAN", order: 13 },
  { id: "turkce-14", name: "TEMEL HUKUK BİLGİSİ", weeks: ["MAYIS-1"], month: "MAYIS", order: 14 },
  { id: "turkce-15", name: "ANAYASA TARİHİ", weeks: ["MAYIS-2"], month: "MAYIS", order: 15 },
  { id: "turkce-16", name: "YASAMA & YÜRÜTME", weeks: ["MAYIS-3"], month: "MAYIS", order: 16 },
  { id: "turkce-17", name: "YARGI & İDARE HUKUKU", weeks: ["MAYIS-4"], month: "MAYIS", order: 17 },
  { id: "turkce-18", name: "Vatandaşlık Soru Avı", weeks: ["HAZİRAN-1"], month: "HAZİRAN", order: 18 },
  { id: "turkce-19", name: "VATANDAŞLIK BİTİŞ", weeks: ["HAZİRAN-2"], month: "HAZİRAN", order: 19 },
  { id: "turkce-20", name: "GÜNCEL BİLGİLER", weeks: ["HAZİRAN-3", "HAZİRAN-4"], month: "HAZİRAN", order: 20 },
  { id: "turkce-21", name: "TEKRAR", weeks: ["TEMMUZ"], month: "TEMMUZ", order: 21 },
];

/**
 * Tüm derslerin verisi
 */
export const subjectsData: Record<Subject, SubjectData> = {
  TARİH: {
    subject: "TARİH",
    topics: tarihTopics,
    totalQuestions: 27,
  },
  COĞRAFYA: {
    subject: "COĞRAFYA",
    topics: cografyaTopics,
    totalQuestions: 18,
  },
  MATEMATİK: {
    subject: "MATEMATİK",
    topics: matematikTopics,
    totalQuestions: 30,
  },
  TÜRKÇE: {
    subject: "TÜRKÇE",
    topics: turkceTopics,
    totalQuestions: 0, // Türkçe için soru sayısı belirtilmemiş
  },
  VATANDAŞLIK: {
    subject: "VATANDAŞLIK",
    topics: turkceTopics.filter((t) => t.name.includes("HUKUK") || t.name.includes("ANAYASA") || t.name.includes("Vatandaşlık") || t.name.includes("GÜNCEL")),
    totalQuestions: 0,
  },
};

/**
 * Belirli bir dersin konularını getir
 */
export function getSubjectTopics(subject: Subject): SubjectTopic[] {
  return subjectsData[subject]?.topics || [];
}

/**
 * Belirli bir konuyu getir
 */
export function getTopic(subject: Subject, topicId: string): SubjectTopic | undefined {
  return subjectsData[subject]?.topics.find((t) => t.id === topicId);
}
