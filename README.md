# 📚 KPSS Takip - Zehra'nın Çalışma Takip Uygulaması

Mobile-first, yüksek performanslı KPSS çalışma takip uygulaması.

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ 
- npm veya pnpm

### Adımlar

1. **Bağımlılıkları yükle:**
```bash
npm install
```

2. **Geliştirme sunucusunu başlat:**
```bash
npm run dev
```

3. **Tarayıcıda aç:**
```
http://localhost:3000
```

## 🛠️ Teknoloji Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.x
- **Icons:** Material Symbols
- **State Management:** React Context API
- **Storage:** LocalStorage (test için)

## 📁 Proje Yapısı

```
src/
├── app/              # Next.js pages
├── components/       # React components
│   ├── layout/       # Layout components
│   ├── dashboard/    # Dashboard components
│   ├── calendar/     # Calendar components
│   ├── timer/        # Timer components
│   └── shared/       # Shared UI components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript types
└── data/             # Study plan data
```

## ✨ Özellikler

- ✅ Günlük görev takibi
- ✅ Aylık ilerleme widget'ı
- ✅ Haftalık takvim görünümü
- ✅ Timer/kronometre desteği
- ✅ LocalStorage ile veri kalıcılığı
- ✅ Mobile-first tasarım
- ✅ Dark mode desteği (yakında)

## 📝 Notlar

- Şu an LocalStorage kullanılıyor (test için)
- Backend entegrasyonu için API layer hazır
- Tüm veriler client-side'da saklanıyor

## 🔮 Gelecek Özellikler

- [ ] Backend API entegrasyonu
- [ ] Kullanıcı kimlik doğrulama
- [ ] Çoklu cihaz senkronizasyonu
- [ ] İstatistikler ve grafikler
- [ ] Bildirimler

## 📄 Lisans

Private project - Zehra için özel geliştirilmiştir.
