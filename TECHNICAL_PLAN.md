# 📋 KPSS Takip Uygulaması - Teknik Mimari Planı

## 🎯 Genel Bakış

**Proje Adı:** KPSS Takip (Zehra'nın Çalışma Takip Sistemi)  
**Hedef Platform:** Mobile-First Web Uygulaması  
**Geliştirme Yaklaşımı:** Modern React + TypeScript + Tailwind CSS

---

## 🛠️ Teknoloji Stack'i

### **Core Framework & Language**
- **Framework:** Next.js 14+ (App Router)
  - Sebep: Server Components, optimizasyon, routing, SEO
- **Language:** TypeScript 5.x
  - Sebep: Type safety, maintainability, modern JavaScript features
- **React Version:** React 18+ (Next.js ile birlikte)

### **Styling & UI**
- **CSS Framework:** Tailwind CSS 3.x
  - Sebep: Stitch kodlarında kullanılmış, utility-first, mobile-responsive
- **Icons:** Material Symbols (Google Fonts)
  - Sebep: Stitch tasarımında kullanılmış, tutarlılık
- **Font:** Inter (Google Fonts)
  - Sebep: Modern, okunabilir, Stitch'te kullanılmış

### **State Management**
- **Client State:** React Context API + useReducer
  - Sebep: Basit, built-in, external dependency yok
- **Persistence:** LocalStorage API
  - Sebep: Test aşaması, sonra backend'e migrate edilebilir

### **Date & Time Management**
- **Library:** date-fns
  - Sebep: Lightweight, modern, tree-shakeable, TypeScript support

### **Form & Validation**
- **Library:** React Hook Form + Zod
  - Sebep: Performance, minimal re-renders, type-safe validation

### **Build Tool & Package Manager**
- **Package Manager:** npm veya pnpm
- **Build Tool:** Next.js built-in (Turbopack)

---

## 📁 Dosya Dizini Yapısı

```
zehrakpss/
├── .next/                          # Next.js build output (gitignore)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── README.md
│
├── public/                          # Static assets
│   ├── images/
│   └── icons/
│
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx              # Root layout (providers, fonts)
│   │   ├── page.tsx                # Dashboard (Ana sayfa)
│   │   ├── calendar/               # Takvim sayfası
│   │   │   └── page.tsx
│   │   ├── subjects/               # Konular sayfası
│   │   │   └── page.tsx
│   │   └── profile/                 # Profil sayfası
│   │       └── page.tsx
│   │
│   ├── components/                  # React Components
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── BottomNavigation.tsx
│   │   │   └── FloatingActionButton.tsx
│   │   │
│   │   ├── dashboard/              # Dashboard-specific components
│   │   │   ├── GreetingSection.tsx
│   │   │   ├── MonthlyGoalWidget.tsx
│   │   │   ├── DailyRoutineCard.tsx
│   │   │   ├── SubjectFocusCard.tsx
│   │   │   └── TaskItem.tsx
│   │   │
│   │   ├── calendar/               # Calendar-specific components
│   │   │   ├── WeeklyCalendarStrip.tsx
│   │   │   ├── WeeklyProgressCard.tsx
│   │   │   ├── TodayTasksList.tsx
│   │   │   ├── WeekendGoalsCard.tsx
│   │   │   └── StudyTaskCard.tsx
│   │   │
│   │   ├── timer/                  # Timer components
│   │   │   ├── TimerModal.tsx
│   │   │   ├── TimerDisplay.tsx
│   │   │   └── TimerControls.tsx
│   │   │
│   │   ├── shared/                 # Reusable components
│   │   │   ├── CircularProgress.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Button.tsx
│   │   │
│   │   └── ui/                     # Base UI components
│   │       ├── Modal.tsx
│   │       └── Badge.tsx
│   │
│   ├── data/                       # Data & Configuration
│   │   ├── study-plan.ts           # Çalışma planı JSON data
│   │   └── constants.ts            # App constants
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── useLocalStorage.ts      # LocalStorage hook
│   │   ├── useStudyProgress.ts     # Progress tracking hook
│   │   ├── useTimer.ts             # Timer logic hook
│   │   └── useDailyTasks.ts        # Daily tasks hook
│   │
│   ├── context/                    # React Context Providers
│   │   ├── StudyProgressContext.tsx
│   │   └── ThemeContext.tsx        # Dark mode (optional)
│   │
│   ├── utils/                      # Utility functions
│   │   ├── date.ts                 # Date helpers (date-fns wrappers)
│   │   ├── storage.ts              # LocalStorage helpers
│   │   ├── validation.ts           # Zod schemas
│   │   └── formatters.ts           # Text formatters
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── study-plan.ts           # Study plan types
│   │   ├── progress.ts             # Progress tracking types
│   │   └── task.ts                 # Task types
│   │
│   └── styles/                     # Global styles
│       ├── globals.css             # Tailwind imports + custom CSS
│       └── variables.css           # CSS variables (colors, etc.)
│
└── tests/                          # Test files (optional, future)
    └── __mocks__/
```

---

## 🧩 Component Yapısı Detayı

### **1. Layout Components**

#### `Header.tsx`
- Props: `title`, `showNotifications`, `userName`
- Responsive header bar
- Profile picture + greeting
- Notification bell icon

#### `BottomNavigation.tsx`
- Props: `activeTab`, `onTabChange`
- 4 tab: Panel, Konular, Takvim, Profil
- Active state management
- iOS-style safe area handling

#### `FloatingActionButton.tsx`
- Props: `onClick`, `icon`, `position`
- Reusable FAB component
- Position variants (bottom-right, etc.)

---

### **2. Dashboard Components**

#### `GreetingSection.tsx`
- Props: `userName`, `motivationalMessage`
- "Merhaba Zehra 👋" section
- Dynamic greeting based on time of day

#### `MonthlyGoalWidget.tsx`
- Props: `month`, `progress`, `solved`, `remaining`
- Circular progress visualization
- SVG-based progress ring
- Statistics display

#### `DailyRoutineCard.tsx`
- Props: `tasks`, `onTaskComplete`, `onTaskStart`
- Mint-themed card
- Task list with checkboxes
- Play button for timer tasks

#### `SubjectFocusCard.tsx`
- Props: `subject`, `topic`, `progress`
- Lavender-themed card
- Progress bar
- "Çalışmaya Devam Et" button

#### `TaskItem.tsx`
- Props: `task`, `completed`, `onToggle`, `onStart`
- Individual task row
- Checkbox + text + action button
- Completed state styling

---

### **3. Calendar Components**

#### `WeeklyCalendarStrip.tsx`
- Props: `currentWeek`, `selectedDate`, `onDateSelect`, `onWeekChange`
- Horizontal calendar navigation
- Day selection with active state
- Week navigation arrows

#### `WeeklyProgressCard.tsx`
- Props: `weekProgress`, `weekNumber`
- Progress bar visualization
- Motivational messages
- "Başlangıç" → "Çok iyi gidiyorsun!" → "Hedef"

#### `TodayTasksList.tsx`
- Props: `tasks`, `onTaskComplete`
- List of today's scheduled tasks
- Subject icons + colors
- Time slots display

#### `StudyTaskCard.tsx`
- Props: `task`, `completed`, `onToggle`
- Individual study session card
- Subject icon, title, description, time
- Checkbox for completion

#### `WeekendGoalsCard.tsx`
- Props: `goals`, `onGoalClick`
- Weekend milestone display
- Progress tracking
- "Detayları İncele" button

---

### **4. Timer Components**

#### `TimerModal.tsx`
- Props: `isOpen`, `onClose`, `taskType`, `initialTime`
- Full-screen modal overlay
- Blurred background
- Bottom sheet style (mobile)

#### `TimerDisplay.tsx`
- Props: `minutes`, `seconds`, `milliseconds`
- Large timer display
- Monospace font
- Format: "14:35.82"

#### `TimerControls.tsx`
- Props: `isRunning`, `onStart`, `onPause`, `onStop`
- Stop button (secondary)
- Pause button (primary, lavender)
- Status indicator (RUNNING)

---

### **5. Shared Components**

#### `CircularProgress.tsx`
- Props: `percentage`, `size`, `strokeWidth`, `color`
- Reusable SVG circular progress
- Configurable size and colors

#### `ProgressBar.tsx`
- Props: `percentage`, `height`, `color`, `showLabel`
- Horizontal progress bar
- Gradient support
- Label positioning

#### `Checkbox.tsx`
- Props: `checked`, `onChange`, `label`, `disabled`
- Custom styled checkbox
- Accessible (ARIA)
- Material Design style

#### `Card.tsx`
- Props: `children`, `variant`, `padding`, `shadow`
- Base card component
- Variants: default, mint, lavender
- Shadow options

---

## 📊 Veri Yapısı (TypeScript Types)

### **Study Plan Types**

```typescript
// types/study-plan.ts

export type Month = 
  | 'OCAK' | 'ŞUBAT' | 'MART' | 'NİSAN' | 'MAYIS' | 'HAZİRAN' | 'TEMMUZ';

export type Subject = 
  | 'TARİH' | 'COĞRAFYA' | 'MATEMATİK' | 'TÜRKÇE' | 'VATANDAŞLIK';

export interface DailyRoutine {
  paragraphs: number;
  problems: number;
  speedQuestions: number;
}

export interface WeeklyTask {
  weekNumber: number;
  dateRange: {
    start: string; // ISO date
    end: string;
  };
  dailyRoutine: DailyRoutine;
  subjects: {
    tarih?: string;
    cografya?: string;
    matematik?: string;
    turkce?: string;
  };
  weeklyGoal?: string;
}

export interface MonthlyPlan {
  month: Month;
  year: number;
  weeks: WeeklyTask[];
}

export interface StudyPlan {
  startDate: string; // ISO date
  endDate: string;
  months: MonthlyPlan[];
}
```

### **Progress Types**

```typescript
// types/progress.ts

export interface TaskCompletion {
  taskId: string;
  completedAt: string; // ISO timestamp
  completed: boolean;
}

export interface DailyProgress {
  date: string; // ISO date (YYYY-MM-DD)
  tasks: TaskCompletion[];
  routineCompleted: boolean;
}

export interface WeeklyProgress {
  weekId: string;
  completedTasks: number;
  totalTasks: number;
  percentage: number;
}

export interface MonthlyProgress {
  month: Month;
  year: number;
  solvedQuestions: number;
  remainingQuestions: number;
  percentage: number;
}

export interface UserProgress {
  daily: Record<string, DailyProgress>; // date -> DailyProgress
  weekly: Record<string, WeeklyProgress>; // weekId -> WeeklyProgress
  monthly: Record<string, MonthlyProgress>; // month-year -> MonthlyProgress
}
```

### **Task Types**

```typescript
// types/task.ts

export interface StudyTask {
  id: string;
  subject: Subject;
  title: string;
  description?: string;
  timeSlot?: {
    start: string; // HH:mm
    end: string;
  };
  date: string; // ISO date
  type: 'routine' | 'study' | 'speed' | 'exam';
  requiresTimer?: boolean;
  timerDuration?: number; // seconds
}

export interface TodayTask extends StudyTask {
  completed: boolean;
  completedAt?: string;
}
```

---

## 💾 LocalStorage Yapısı

### **Storage Keys**

```typescript
// utils/storage.ts

export const STORAGE_KEYS = {
  USER_PROGRESS: 'kpss_user_progress',
  USER_SETTINGS: 'kpss_user_settings',
  LAST_SYNC: 'kpss_last_sync',
} as const;
```

### **Storage Schema**

```typescript
// LocalStorage'da saklanacak veri yapısı

interface StoredProgress {
  version: string; // "1.0.0" - migration için
  userId: string; // "zehra" veya UUID
  progress: UserProgress;
  lastUpdated: string; // ISO timestamp
}

interface StoredSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  dailyReminder: string; // HH:mm
}
```

---

## 🎨 Styling Stratejisi

### **Tailwind Config**

```typescript
// tailwind.config.ts

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2b8cee',
        'soft-mint': '#e0f2f1',
        'soft-lavender': '#f3e5f5',
        'background-light': '#f8fafc',
        'background-dark': '#101922',
        'text-main': '#0d141b',
        'text-sub': '#4c739a',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
};
```

---

## 🔄 State Management Flow

### **Context Structure**

```typescript
// context/StudyProgressContext.tsx

interface StudyProgressState {
  progress: UserProgress;
  studyPlan: StudyPlan;
  currentDate: Date;
}

interface StudyProgressActions {
  completeTask: (taskId: string) => void;
  updateDailyRoutine: (date: string, routine: DailyRoutine) => void;
  getTodayTasks: () => TodayTask[];
  getWeeklyProgress: (weekId: string) => WeeklyProgress;
  getMonthlyProgress: (month: Month, year: number) => MonthlyProgress;
}
```

### **LocalStorage Sync**

- **Read:** App başlangıcında LocalStorage'dan oku
- **Write:** Her state değişikliğinde LocalStorage'a yaz (debounced)
- **Migration:** Version kontrolü ile gelecekteki schema değişiklikleri için

---

## 🚀 Geliştirme Aşamaları

### **Phase 1: Foundation (1-2 gün)**
1. Next.js projesi kurulumu
2. TypeScript + Tailwind config
3. Base layout components
4. Veri yapıları (types) tanımlama
5. Study plan JSON'a dönüştürme

### **Phase 2: Dashboard (2-3 gün)**
1. Header + Bottom Navigation
2. Greeting Section
3. Monthly Goal Widget
4. Daily Routine Card
5. Subject Focus Card
6. LocalStorage integration

### **Phase 3: Calendar View (2-3 gün)**
1. Weekly Calendar Strip
2. Weekly Progress Card
3. Today Tasks List
4. Weekend Goals Card
5. Date navigation logic

### **Phase 4: Timer (1-2 gün)**
1. Timer Modal component
2. Timer logic (useTimer hook)
3. Timer controls
4. Integration with tasks

### **Phase 5: Polish & Testing (1-2 gün)**
1. Mobile responsiveness testing
2. Dark mode (optional)
3. Performance optimization
4. Bug fixes

---

## 📦 Bağımlılıklar (package.json)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "date-fns": "^2.30.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.2.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.50.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

---

## 🔮 Gelecek Backend Entegrasyonu İçin Hazırlık

### **API Layer Abstraction**

```typescript
// utils/api.ts (şimdilik mock, sonra gerçek API)

interface ApiClient {
  getProgress: () => Promise<UserProgress>;
  updateProgress: (progress: UserProgress) => Promise<void>;
  syncProgress: () => Promise<void>;
}

// LocalStorage implementation (şimdilik)
class LocalStorageApi implements ApiClient {
  // ...
}

// Backend API implementation (gelecekte)
class BackendApi implements ApiClient {
  // ...
}
```

Bu yapı sayesinde backend'e geçiş sadece API client değiştirilerek yapılabilir.

---

## ✅ Onay Bekleyen Noktalar

1. **Framework:** Next.js 14 App Router ✅
2. **Language:** TypeScript ✅
3. **Styling:** Tailwind CSS ✅
4. **State:** Context API + LocalStorage ✅
5. **Component Structure:** Feature-based ✅
6. **Veri Yapısı:** JSON + TypeScript types ✅

**Bu planı onaylıyor musunuz? Değişiklik istediğiniz bir nokta var mı?**
