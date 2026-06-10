import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  User,
  ExternalLink,
  Award,
  RefreshCw,
  Search,
  CheckCircle,
  BookmarkCheck,
  Info,
  Globe,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import GuideSection from "./components/GuideSection";
import { Badge, ProfileData } from "./types";

// Static mock data for demo profiles which fallback gracefully if fetching live profile from Google Cloud fails.
const DEMO_PROFILES: Record<string, ProfileData> = {
  "demo-zohra-cloud": {
    profileId: "43eb4c10-eb3a-4df8-aa3e-068f2ef96c58",
    userName: "Zahra Latif",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    badgesCount: 8,
    badges: [
      { title: "Trivia: Noyabr 2024", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Nov 11, 2024" },
      { title: "Trivia: Dekabr 2024", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Dec 04, 2024" },
      { title: "Level 1: Cloud Explorer Game", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Jul 02, 2025" },
      { title: "Perform Foundational Infrastructure Tasks in Google Cloud", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned May 10, 2025" },
      { title: "Build and Secure Networks in Google Cloud", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned May 15, 2025" },
      { title: "Get Started with Google Kubernetes Engine", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Jun 01, 2025" },
      { title: "Create and Manage Cloud Spanner Databases", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Jun 16, 2025" },
      { title: "Deploy and Manage Cloud Environments with Google Cloud", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Jun 22, 2025" }
    ]
  }
};

const APP_TRANSLATIONS = {
  aze: {
    subtitleBadge: "Google Skills Profil Skaneri",
    heroTitle: "Google Cloud Profil Analizatoru",
    heroDesc: "Google Cloud Skills Boost profilinizdəki qazanılmış rəsmi nişanları (badge) dərhal skan edin, istiqamətlər üzrə təsnifləndirin və Gemini AI-dan professional karyera tövsiyələri alın.",
    totalBadges: "Cəmi Nişanlar",
    classificationTitle: "Texniki Sahələr Üzrə Təsnifat",
    categoryAi: "Süni İntellekt (AI)",
    categoryAiDesc: "GenAI & ML",
    categoryInfra: "İnfrastruktur",
    categoryInfraDesc: "K8s & Security",
    categoryDbValue: "Spanner & Data",
    categoryDbDesc: "SQL & DevOps",
    categoryOtherValue: "Digər Səviyyələr",
    categoryOtherDesc: "Core Kursları",
    progressLabel: "Növbəti İnkişaf Mərhələsinə keçid",
    scannerTitle: "İctimai Profil Məlumatlarınızı Skan Edin",
    scannerDesc: "İxtiyari Google Skills / Cloud Skills Boost ictimai profil linkini və ya UUID-sini aşağıdakı çərçivəyə əlavə edərək skan edin. Hazır test profillərini klikləməklə dərhal tətbiqi sınaya bilərsiniz.",
    inputPlaceholder: "https://www.skills.google/public_profiles/43eb4c10-eb3a-4df8-aa3e-068f2ef96c58",
    btnScan: "Profili Skan Et",
    btnScanning: "Oxunur...",
    errorPrefix: "Gözlənilməz Xəta:",
    sampleProfilesTitle: "Sürətli Sınaq üçün Hazır Nümunə Profillər:",
    sample1Subtitle: "Rəqəmsal Nişanlar • Hazır Profil",
    sample2Subtitle: "Mütəxəssis • 5 Nişan",
    sample3Subtitle: "Başlanğıc • 2 Nişan",
    verifiedProfile: "Təsdiqlənmiş Google Cloud Profili",
    aiAdvisorTitle: "Gemini AI Profil Məsləhətçisi",
    aiAdvisorSubtitle: "Powered by gemini-3.5-flash",
    aiAdvisorLabel: "ZƏKA ANALİZİ",
    aiAdvisorLoading: "Gemini sizin profili rəy süzgəcindən keçirir...",
    aiAdvisorLoadingDesc: "Qazanılmış nişanların mövzuları və bacarıq istiqamətləri araşdırılır.",
    aiAdvisorErrorPrefix: "AI analizi alınmadı:",
    btnAiAnalyze: "Gemini AI ilə Profilini Analiz Et",
    btnAiAnalyzing: "AI Analiz Edilir...",
    foundBadgesTitle: "Tapılmış Rəsmi Nişanlar",
    foundBadgesSub: "Rəsmi profil siyahısı",
    noEarnedDate: "Qazanılma tarixi tapılmadı",
    aboutTitle: "Məlumat analizi haqqında",
    aboutText: "Google Cloud Boost profilinizin analiz edilməsi tamamilə ictimai (public) profil linkinizi əsas tutaraq icra olunur. Skaner sizin şəxsi məlumatlarınıza, şifrələrinizə və ya hər hansı digər həssas datalarınıza daxil olmur. Qazanılmış rəsmi rəqəmsal nişanlar dərhal Süni İntellekt (Gemini) məsləhətçisinə yönləndirilərək karyera modeliniz formalaşdırılır.",
    systemActive: "Sistem Aktivdir",
    bakuCommunity: "GDG Baku, Azerbaijan",
    enterIdOrUrlError: "Zəhmət olmasa profil ID və ya URL-i daxil edin.",
    tierSəyyah: "Bulud Səyyahı 🌱",
    tierPraktikant: "Bulud Praktikantı ⚙️",
    tierMütəxəssis: "Bulud Mütəxəssisi ⚡",
    tierİrəli: "İrəli Səviyyə Praktikant 💼",
    tierMemar: "Professional Bulud Memarı 🌟",
    tierYaxınlaşan: "Yaxınlaşan Səyyah 🌱",
    liveAnalysisList: "Qurğunun live analiz siyahısı",
    seeMore: "Daha çox göstər",
    seeLess: "Daha az göstər",
    filterAll: "Hamısı",
    filterAi: "Süni İntellekt (AI)",
    filterInfra: "İnfrastruktur",
    filterDb: "Məlumat Bazası",
    filterOther: "Digər Səviyyələr"
  },
  eng: {
    subtitleBadge: "Google Skills Profile Scanner",
    heroTitle: "Google Cloud Profile Analyzer",
    heroDesc: "Instantly scan your earned official badges from your Google Cloud Skills Boost profile, classify them by category, and receive professional career recommendations from Gemini AI.",
    totalBadges: "Total Badges",
    classificationTitle: "Classification by Technical Fields",
    categoryAi: "Artificial Intelligence (AI)",
    categoryAiDesc: "GenAI & ML",
    categoryInfra: "Infrastructure",
    categoryInfraDesc: "K8s & Security",
    categoryDbValue: "Spanner & Data",
    categoryDbDesc: "SQL & DevOps",
    categoryOtherValue: "Other Levels",
    categoryOtherDesc: "Core Courses",
    progressLabel: "Progress to Next Development Level",
    scannerTitle: "Scan Your Public Profile Information",
    scannerDesc: "Enter any Google Skills / Cloud Skills Boost public profile link or UUID in the input below to scan. Click any of the prepared test profiles to test instantly.",
    inputPlaceholder: "https://www.skills.google/public_profiles/43eb4c10-eb3a-4df8-aa3e-068f2ef96c58",
    btnScan: "Scan Profile",
    btnScanning: "Scanning...",
    errorPrefix: "Unexpected Error:",
    sampleProfilesTitle: "Prepared Sample Profiles for Quick Testing:",
    sample1Subtitle: "Digital Badges • Demo Profile",
    sample2Subtitle: "Specialist • 5 Badges",
    sample3Subtitle: "Beginner • 2 Badges",
    verifiedProfile: "Verified Google Cloud Profile",
    aiAdvisorTitle: "Gemini AI Profile Advisor",
    aiAdvisorSubtitle: "Powered by gemini-3.5-flash",
    aiAdvisorLabel: "AI INSIGHTS",
    aiAdvisorLoading: "Gemini is evaluating your profile...",
    aiAdvisorLoadingDesc: "Mapping your earned credentials to cloud industry competencies.",
    aiAdvisorErrorPrefix: "AI analysis failed:",
    btnAiAnalyze: "Analyze Profile with Gemini AI",
    btnAiAnalyzing: "AI Analyzing...",
    foundBadgesTitle: "Found Official Badges",
    foundBadgesSub: "Official profile list",
    noEarnedDate: "Earned date not found",
    aboutTitle: "About data analysis",
    aboutText: "The analysis of your Google Cloud Boost profile is based entirely on your public profile link. The scanner does not access your personal data, passwords, or any other sensitive info. Earned official digital badges are instantly forwarded to the AI (Gemini) advisor to construct your personalized career guidance.",
    systemActive: "System Active",
    bakuCommunity: "GDG Baku, Azerbaijan",
    enterIdOrUrlError: "Please enter a profile ID or URL.",
    tierSəyyah: "Cloud Explorer 🌱",
    tierPraktikant: "Cloud Practitioner ⚙️",
    tierMütəxəssis: "Cloud Specialist ⚡",
    tierİrəli: "Advanced Practitioner 💼",
    tierMemar: "Professional Cloud Architect 🌟",
    tierYaxınlaşan: "Approaching Explorer 🌱",
    liveAnalysisList: "Live profile analysis list",
    seeMore: "See More",
    seeLess: "See Less",
    filterAll: "All Categories",
    filterAi: "AI / ML",
    filterInfra: "Infrastructure",
    filterDb: "Database / DevOps",
    filterOther: "Other"
  },
  rus: {
    subtitleBadge: "Анализатор профиля Google Skills",
    heroTitle: "Анализатор профиля Google Cloud",
    heroDesc: "Мгновенно сканируйте полученные официальные значки (badges) из вашего Google Cloud Skills Boost профиля, классифицируйте их и получайте карьерные рекомендации от Gemini AI.",
    totalBadges: "Всего значков",
    classificationTitle: "Классификация по техническим областям",
    categoryAi: "Искусственный Интеллект (AI)",
    categoryAiDesc: "GenAI и ML",
    categoryInfra: "Инфраструктура",
    categoryInfraDesc: "K8s и Безопасность",
    categoryDbValue: "Spanner и Данные",
    categoryDbDesc: "SQL и DevOps",
    categoryOtherValue: "Другие уровни",
    categoryOtherDesc: "Базовые курсы",
    progressLabel: "Прогресс до следующего уровня развития",
    scannerTitle: "Анализ данных публичного профиля",
    scannerDesc: "Введите ссылку на публичный профиль Google Skills / Cloud Skills Boost или UUID в поле ниже для сканирования. Нажмите на любой готовый профиль для моментального тестирования.",
    inputPlaceholder: "https://www.skills.google/public_profiles/43eb4c10-eb3a-4df8-aa3e-068f2ef96c58",
    btnScan: "Сканировать профиль",
    btnScanning: "Загрузка...",
    errorPrefix: "Неожиданная ошибка:",
    sampleProfilesTitle: "Готовые примеры профилей для проверки:",
    sample1Subtitle: "Цифровые значки • Демо профиль",
    sample2Subtitle: "Специалист • 5 значков",
    sample3Subtitle: "Новичок • 2 значка",
    verifiedProfile: "Подтвержденный профиль Google Cloud",
    aiAdvisorTitle: "Профильный ментор Gemini AI",
    aiAdvisorSubtitle: "На базе gemini-3.5-flash",
    aiAdvisorLabel: "АНАЛИЗ ИИ",
    aiAdvisorLoading: "Gemini производит разбор вашего профиля...",
    aiAdvisorLoadingDesc: "Изучаются темы полученных значков и категории ваших навыков.",
    aiAdvisorErrorPrefix: "Ошибка анализа ИИ:",
    btnAiAnalyze: "Анализировать профиль с Gemini AI",
    btnAiAnalyzing: "Идет анализ ИИ...",
    foundBadgesTitle: "Найденные официальные значки",
    foundBadgesSub: "Официальный список профиля",
    noEarnedDate: "Дата получения не найдена",
    aboutTitle: "О веб-анализе",
    aboutText: "Анализ вашего профиля Google Cloud Boost полностью основан на вашей ссылке на публичный профиль. Сканер не запрашивает персональные данные, пароли или любую другую конфиденциальную информацию. Полученные значки мгновенно отправляются консультанту ИИ (Gemini) для формирования вашей карьерной траектории.",
    systemActive: "Система Активна",
    bakuCommunity: "GDG Baku, Azerbaijan",
    enterIdOrUrlError: "Пожалуйста, введите ID профиля или URL.",
    tierSəyyah: "Облачный Исследователь 🌱",
    tierPraktikant: "Облачный Практик ⚙️",
    tierMütəxəssis: "Облачный Специалист ⚡",
    tierİrəli: "Продвинутый Специалист 💼",
    tierMemar: "Профессиональный облачный архитектор 🌟",
    tierYaxınlaşan: "Начинающий Исследователь 🌱",
    liveAnalysisList: "Список живого анализа",
    seeMore: "Показать еще",
    seeLess: "Показать меньше",
    filterAll: "Все технологии",
    filterAi: "ИИ / ML",
    filterInfra: "Инфраструктура",
    filterDb: "Базы Данных",
    filterOther: "Другое"
  }
};

export default function App() {
  const [lang, setLang] = useState<"aze" | "eng" | "rus">("aze");
  const t = APP_TRANSLATIONS[lang];

  const [profileUrlInput, setProfileUrlInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllBadges, setShowAllBadges] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ai" | "infra" | "database" | "other">("all");
  
  // Real or selected profile state
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // AI analyzer states
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Preset live demo profiles loading helper (attempts to scan live data first, falls back to offline representations if blocked)
  const loadDemoProfile = async (key: string) => {
    const demo = DEMO_PROFILES[key];
    setProfileUrlInput(`https://www.skills.google/public_profiles/${demo.profileId}`);
    setLoading(true);
    setError(null);
    setProfileData(null);
    setAiAnalysis(null);
    setAiError(null);
    setShowAllBadges(false);
    setSelectedCategory("all");
    try {
      const encodedId = encodeURIComponent(demo.profileId);
      const res = await fetch(`/api/fetch-profile/${encodedId}`);
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        throw new Error("Live load failed");
      }
      setProfileData(data);
    } catch (err: any) {
      // Fallback gracefully to offline representation
      setProfileData(demo);
    } finally {
      setLoading(false);
    }
  };

  // Perform AJAX crawl fetching
  const handleFetchProfile = async (idOrUrl: string) => {
    if (!idOrUrl.trim()) {
      setError(t.enterIdOrUrlError);
      return;
    }

    setLoading(true);
    setError(null);
    setProfileData(null);
    setAiAnalysis(null);
    setAiError(null);
    setShowAllBadges(false);
    setSelectedCategory("all");

    try {
      // Decode the URL param segment
      const encodedId = encodeURIComponent(idOrUrl.trim());
      const res = await fetch(`/api/fetch-profile/${encodedId}`);
      const data = await res.json();

      if (!res.ok || data.status === "error") {
        throw new Error(data.message || (lang === "eng" ? "Failed to retrieve profile." : lang === "rus" ? "Не удалось загрузить профиль." : "Profil axtarılan zaman xəta baş verdi."));
      }

      setProfileData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || (lang === "eng" ? "Could not read Google Cloud profile. Ensure it is public and try again." : lang === "rus" ? "Не удалось прочитать профиль. Убедитесь, что он открытый." : "Google Cloud Skills Boost profilini oxumaq mümkün olmadı. Profilinizin 'Public' olduğundan əmin olun."));
    } finally {
      setLoading(false);
    }
  };

  // Run Gemini analysis through server API
  const handleAiAnalysis = async () => {
    if (!profileData) return;
    setAiLoading(true);
    setAiAnalysis(null);
    setAiError(null);

    try {
      const res = await fetch("/api/analyze-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userName: profileData.userName,
          badges: profileData.badges,
          lang: lang
        })
      });

      const data = await res.json();
      if (!res.ok || data.status === "error") {
        throw new Error(data.message || "AI analizi icra edilə bilmədi.");
      }

      setAiAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || (lang === "eng" ? "Could not connect to Gemini AI helper." : lang === "rus" ? "Не удалось связаться с ассистентом Gemini AI." : "Süni İntellekt analizatoru ilə əlaqə yaradılmadı."));
    } finally {
      setAiLoading(false);
    }
  };

  // Compute live badge categories and metrics
  const getBadgeBreakdownAndTotal = () => {
    if (!profileData) {
      return { 
        total: 0, 
        aiCount: 0, 
        infraCount: 0, 
        dbCount: 0, 
        generalCount: 0, 
        badgeCount: 0, 
        tierName: t.tierYaxınlaşan
      };
    }

    let ai = 0;
    let infra = 0;
    let db = 0;
    let general = 0;

    profileData.badges.forEach((b) => {
      const titleLower = b.title.toLowerCase();
      if (
        titleLower.includes("ai") || 
        titleLower.includes("intelligence") || 
        titleLower.includes("generative") || 
        titleLower.includes("machine learning") || 
        titleLower.includes("gemini") || 
        titleLower.includes("prompt")
      ) {
        ai++;
      } else if (
        titleLower.includes("infrastructure") || 
        titleLower.includes("kubernetes") || 
        titleLower.includes("network") || 
        titleLower.includes("cloud") || 
        titleLower.includes("security") || 
        titleLower.includes("gke")
      ) {
        infra++;
      } else if (
        titleLower.includes("devops") || 
        titleLower.includes("database") || 
        titleLower.includes("spanner") || 
        titleLower.includes("bigquery") || 
        titleLower.includes("sql") || 
        titleLower.includes("storage")
      ) {
        db++;
      } else {
        general++;
      }
    });

    const badgeCount = profileData.badgesCount || profileData.badges.length;
    
    let tierName = t.tierSəyyah;
    if (badgeCount === 0) tierName = t.tierSəyyah;
    else if (badgeCount < 4) tierName = t.tierPraktikant;
    else if (badgeCount < 8) tierName = t.tierMütəxəssis;
    else if (badgeCount < 13) tierName = t.tierİrəli;
    else   tierName = t.tierMemar;

    return {
      total: badgeCount,
      aiCount: ai,
      infraCount: infra,
      dbCount: db,
      generalCount: general,
      badgeCount,
      tierName
    };
  };

  const currentStats = getBadgeBreakdownAndTotal();

  // Helper custom markdown parser to nicely render markdown output
  const renderAnalysisMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="text-white font-display text-base font-bold mt-4 mb-2 flex items-center gap-2">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={idx} className="text-violet-300 font-display text-lg font-bold border-b border-slate-850 pb-2 mt-6 mb-3">{line.replace("## ", "")}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={idx} className="text-white font-display text-xl font-extrabold mt-8 mb-4 border-l-4 border-violet-500 pl-3">{line.replace("# ", "")}</h2>;
      }
      // List items
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const cleanContent = line.trim().substring(2);
        return (
          <li key={idx} className="text-slate-300 text-sm leading-relaxed ml-4 list-disc mb-1.5 font-sans">
            {formatBoldText(cleanContent)}
          </li>
        );
      }
      if (line.trim() === "") return <div key={idx} className="h-2" />;
      
      // Standard line
      return <p key={idx} className="text-slate-300 text-sm leading-relaxed mb-3.5 font-sans">{formatBoldText(line)}</p>;
    });
  };

  // Render text bold formatting helper
  const formatBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-violet-200 font-semibold">{part}</strong> : part));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-violet-500 selection:text-white">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-12 relative z-10">
        
        {/* Language selector flag tray - Floating Bento Segment */}
        <div className="flex justify-end mb-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-full p-1 flex gap-1 shadow-inner relative z-20">
            {(["aze", "eng", "rus"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                  lang === l
                    ? "bg-violet-600 text-white shadow font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Globe className="w-3 h-3 opacity-60" />
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Section styled like Bento header */}
        <header className="text-center mb-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-xs sm:text-sm font-semibold mb-5 font-mono uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            <span>{t.subtitleBadge}</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight"
          >
            {t.heroTitle}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-400 mt-4 text-sm sm:text-base leading-relaxed"
          >
            {t.heroDesc}
          </motion.p>
        </header>

        {/* 1. TUTORIAL GUIDE SECTION: Placed at the very top of body as explicitly requested */}
        <GuideSection lang={lang} />

        {/* Space Spacer */}
        <div className="h-12" />

        {/* Dynamic Interactive Scoreboard Banner (Enhanced Bento Style) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-12 rounded-3xl bg-slate-900/45 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden group"
        >
          {/* Ambient overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-violet-600/10 to-transparent pointer-events-none group-hover:from-violet-600/15 transition-all duration-300" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Points display (Bento Card A) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-slate-950/80 border border-slate-800 rounded-2xl relative overflow-hidden group/points shadow-lg min-h-[190px]">
              <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover/points:bg-emerald-500/10 transition-all"></div>
              <span className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-1.5">{t.totalBadges}</span>
              <div className="relative">
                <div className="text-6xl sm:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-300 to-emerald-400 select-none">
                  {currentStats.total}
                </div>
                <div className="absolute -top-1 -right-3">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                  </span>
                </div>
              </div>
              <div className="mt-4 px-3 py-1 bg-violet-600/20 text-violet-300 font-semibold border border-violet-500/20 rounded-full text-xs font-mono">
                {currentStats.tierName}
              </div>
            </div>

            {/* Right details grid */}
            <div className="lg:col-span-8 space-y-5">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-violet-400" />
                <span>{t.classificationTitle}</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 bg-slate-950/65 border border-slate-800/80 rounded-xl hover:border-slate-700/80 transition-colors">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold font-mono tracking-wider block">{t.categoryAi}</span>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1">{currentStats.aiCount}</div>
                  <span className="text-[10px] text-violet-400 mt-0.5 block">{t.categoryAiDesc}</span>
                </div>
                
                <div className="p-3.5 bg-slate-950/65 border border-slate-800/80 rounded-xl hover:border-slate-700/80 transition-colors">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold font-mono tracking-wider block">{t.categoryInfra}</span>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1">{currentStats.infraCount}</div>
                  <span className="text-[10px] text-violet-400 mt-0.5 block">{t.categoryInfraDesc}</span>
                </div>

                <div className="p-3.5 bg-slate-950/65 border border-slate-800/80 rounded-xl hover:border-slate-700/80 transition-colors">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold font-mono tracking-wider block">{t.categoryDbValue}</span>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1">{currentStats.dbCount}</div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{t.categoryDbDesc}</span>
                </div>

                <div className="p-3.5 bg-slate-950/65 border border-slate-800/80 rounded-xl hover:border-slate-700/80 transition-colors">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold font-mono tracking-wider block">{t.categoryOtherValue}</span>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{currentStats.generalCount}</div>
                  <span className="text-[10px] text-emerald-500 mt-0.5 block">{t.categoryOtherDesc}</span>
                </div>
              </div>

              {/* Progress visual metrics */}
              <div className="pt-2">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-sans">
                  <span>{t.progressLabel}</span>
                  <span className="font-mono text-violet-300">{Math.min(100, (currentStats.total * 10))}%</span>
                </div>
                <div className="h-2 bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, currentStats.total * 10))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tab Contents - Auto-loaded Direct Profile Crawler */}
        <div className="space-y-8">
          {/* Profile Link crawling input container - Bento card */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-violet-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/10 transition-all"></div>
            
            <h3 className="font-display text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-violet-400" />
              <span>{t.scannerTitle}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
              {t.scannerDesc}
            </p>

            {/* Main fetch bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFetchProfile(profileUrlInput);
              }}
              className="flex flex-col sm:flex-row gap-3 items-stretch"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.inputPlaceholder}
                  value={profileUrlInput}
                  onChange={(e) => setProfileUrlInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-violet-500 outline-none rounded-2xl pl-12 pr-4 py-3 sm:py-3.5 text-slate-200 placeholder-slate-600 transition-colors text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/15 text-sm shrink-0 disabled:opacity-55 font-mono"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t.btnScanning}
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    {t.btnScan}
                  </>
                )}
              </button>
            </form>

            {/* Error Banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs sm:text-sm leading-relaxed"
              >
                <strong>{t.errorPrefix}</strong> {error}
              </motion.div>
            )}

            {/* Ready Sample demos - First one targets the specified skills.google profile */}
            <div className="mt-6 pt-6 border-t border-slate-800/60">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-3">{t.sampleProfilesTitle}</span>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => loadDemoProfile("demo-zohra-cloud")}
                  className="px-4 py-2.5 bg-slate-950 border-2 border-violet-500/30 hover:border-violet-500/70 rounded-xl text-left text-xs text-slate-300 transition-all flex items-center gap-3 hover:bg-slate-900 group w-full sm:w-fit"
                  title="skills.google/public_profiles/43eb4c10-eb3a-4df8-aa3e-068f2ef96c58"
                >
                  <User className="w-4 h-4 text-violet-400 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-100 flex items-center gap-1">Zahra Latif <span className="bg-violet-500/20 text-violet-300 text-[8px] px-1.5 py-0.2 rounded uppercase">LIVE</span></div>
                    <div className="text-[9px] text-slate-400">{t.sample1Subtitle}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Crawled Results Grid */}
          <AnimatePresence mode="wait">
            {profileData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Profile Header display card */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 justify-between relative overflow-hidden group hover:border-slate-700/55 transition-colors duration-300">
                  <div className="absolute -right-4 -top-4 w-28 h-28 bg-violet-500/5 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-950 border-2 border-violet-500/35 flex items-center justify-center shadow-md shrink-0">
                      {profileData.avatarUrl ? (
                        <img src={profileData.avatarUrl} alt={profileData.userName} className="w-full h-full object-cover" onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${profileData.userName}`;
                        }} />
                      ) : (
                        <User className="w-8 h-8 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-display text-xl font-bold text-white leading-snug">{profileData.userName}</h4>
                      <p className="text-xs text-slate-550 mt-1 font-mono break-all font-semibold">ID: {profileData.profileId}</p>
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-350 mt-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 font-medium font-sans">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {t.verifiedProfile}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleAiAnalysis}
                    disabled={aiLoading}
                    className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] text-white font-bold text-xs rounded-2xl flex items-center gap-2 transition-all shadow-md shrink-0 disabled:opacity-55 font-mono cursor-pointer"
                  >
                    {aiLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        {t.btnAiAnalyzing}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        {t.btnAiAnalyze}
                      </>
                    )}
                  </button>
                </div>

                {/* Gemini AI response panel */}
                {(aiLoading || aiAnalysis || aiError) && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-tr from-slate-900/90 to-violet-950/20 border border-violet-500/20 rounded-3xl p-6 sm:p-8 relative shadow-xl overflow-hidden"
                  >
                    {/* Ambient corner blur */}
                    <div className="absolute right-0 top-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl" />
                    
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-violet-600/20 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-violet-300" />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-extrabold text-white">{t.aiAdvisorTitle}</h3>
                          <p className="text-[10px] text-violet-400 font-mono tracking-wider uppercase mt-0.5">{t.aiAdvisorSubtitle}</p>
                        </div>
                      </div>
                      
                      <div className="text-[10px] bg-violet-500/10 border border-violet-500/20 text-violet-300 px-2.5 py-1 rounded-full font-mono font-bold">
                        {t.aiAdvisorLabel}
                      </div>
                    </div>

                    {aiLoading ? (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <RefreshCw className="w-8 h-8 text-violet-500 animate-spin mb-4" />
                        <p className="text-slate-300 text-sm font-semibold">{t.aiAdvisorLoading}</p>
                        <p className="text-slate-500 text-xs mt-2 max-w-sm">{t.aiAdvisorLoadingDesc}</p>
                      </div>
                    ) : aiError ? (
                      <div className="p-5 sm:p-6 bg-red-500/5 border border-red-500/25 rounded-2xl flex flex-col sm:flex-row items-start gap-4 shadow-inner">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-400 shrink-0">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="space-y-4 flex-1">
                          <div>
                            <h4 className="text-red-400 font-bold text-sm tracking-wide uppercase font-sans">
                              {t.aiAdvisorErrorPrefix}
                            </h4>
                            <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                              {aiError}
                            </p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={handleAiAnalysis}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl text-xs font-bold text-red-300 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-red-500/30 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            {lang === "eng" ? "Try Again" : lang === "rus" ? "Повторить попытку" : "Yenidən Cəhd Et"}
                          </button>
                        </div>
                      </div>
                    ) : aiAnalysis ? (
                      <div className="prose prose-invert max-w-none prose-sm sm:prose-base font-sans leading-relaxed">
                        {renderAnalysisMarkdown(aiAnalysis)}
                      </div>
                    ) : null}
                  </motion.div>
                )}

                {/* List of Crawled badges */}
                <div>
                  <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center justify-between">
                    <span>{t.foundBadgesTitle} ({profileData.badgesCount || profileData.badges.length})</span>
                    <span className="text-xs text-slate-500 font-mono">{t.liveAnalysisList}</span>
                  </h3>
                  
                  {(() => {
                    // Helper to get category for a badge
                    const getBadgeCategory = (title: string): "ai" | "infra" | "database" | "other" => {
                      const titleLower = title.toLowerCase();
                      if (
                        titleLower.includes("ai") || 
                        titleLower.includes("intelligence") || 
                        titleLower.includes("generative") || 
                        titleLower.includes("machine learning") || 
                        titleLower.includes("gemini") || 
                        titleLower.includes("prompt")
                      ) {
                        return "ai";
                      } else if (
                        titleLower.includes("infrastructure") || 
                        titleLower.includes("kubernetes") || 
                        titleLower.includes("network") || 
                        titleLower.includes("cloud") || 
                        titleLower.includes("security") || 
                        titleLower.includes("gke")
                      ) {
                        return "infra";
                      } else if (
                        titleLower.includes("devops") || 
                        titleLower.includes("database") || 
                        titleLower.includes("spanner") || 
                        titleLower.includes("bigquery") || 
                        titleLower.includes("sql") || 
                        titleLower.includes("storage")
                      ) {
                        return "database";
                      } else {
                        return "other";
                      }
                    };

                    const totalCount = profileData.badges.length;
                    const aiCount = profileData.badges.filter(b => getBadgeCategory(b.title) === "ai").length;
                    const infraCount = profileData.badges.filter(b => getBadgeCategory(b.title) === "infra").length;
                    const dbCount = profileData.badges.filter(b => getBadgeCategory(b.title) === "database").length;
                    const otherCount = profileData.badges.filter(b => getBadgeCategory(b.title) === "other").length;

                    const filteredBadges = profileData.badges.filter(b => {
                      if (selectedCategory === "all") return true;
                      return getBadgeCategory(b.title) === selectedCategory;
                    });

                    const badgesSubset = showAllBadges ? filteredBadges : filteredBadges.slice(0, 12);

                    return (
                      <>
                        {/* Category Filter UI */}
                        <div className="flex flex-wrap gap-2 mb-6 p-1.5 bg-slate-950/45 border border-slate-800/40 rounded-2xl max-w-fit animate-fade-in">
                          {[
                            { id: "all", label: t.filterAll, count: totalCount, activeColor: "border-purple-500/40 bg-purple-500/10 text-purple-300" },
                            { id: "ai", label: t.filterAi, count: aiCount, activeColor: "border-violet-500/40 bg-violet-500/10 text-violet-300" },
                            { id: "infra", label: t.filterInfra, count: infraCount, activeColor: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
                            { id: "database", label: t.filterDb, count: dbCount, activeColor: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300" },
                            { id: "other", label: t.filterOther, count: otherCount, activeColor: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" }
                          ].map((cat) => {
                            const isActive = selectedCategory === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setSelectedCategory(cat.id as any);
                                  setShowAllBadges(false); // Reset showAll when switching tabs
                                }}
                                className={`px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer border ${
                                  isActive 
                                    ? cat.activeColor 
                                    : "border-transparent bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                                }`}
                              >
                                <span>{cat.label}</span>
                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold ${
                                  isActive 
                                    ? "bg-slate-950/60 text-white" 
                                    : "bg-slate-900 text-slate-500"
                                }`}>
                                  {cat.count}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {filteredBadges.length === 0 ? (
                          <div className="p-12 text-center bg-slate-900/10 border border-dashed border-slate-800/30 rounded-3xl animate-fade-in w-full">
                            <Award className="w-8 h-8 text-slate-600 mx-auto opacity-30 mb-3" />
                            <p className="text-slate-400 text-xs sm:text-sm">
                              {lang === "eng" 
                                ? "No badges found in this category." 
                                : lang === "rus" 
                                ? "В этой категории ни одного значка не найдено." 
                                : "Bu kateqoriyada heç bir rəsmi nişan tapılmadı."}
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {badgesSubset.map((b, idx) => (
                                <motion.div
                                   key={idx}
                                   initial={{ opacity: 0, scale: 0.95 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   transition={{ delay: Math.min(12, idx) * 0.02 }}
                                   className="p-4 bg-slate-900/40 border border-slate-800 rounded-3xl flex gap-3.5 items-center hover:border-violet-500/30 hover:bg-slate-900/50 transition-all duration-300 group relative overflow-hidden"
                                >
                                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-sky-500/5 rounded-full blur-xl pointer-events-none"></div>
                                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden shrink-0 border border-slate-800 group-hover:border-slate-700 transition-colors">
                                    {b.image ? (
                                      <img src={b.image} alt={b.title} className="w-full h-full object-contain p-2" onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://www.cloudskillsboost.google/images/icons/default-avatar.png";
                                      }} />
                                    ) : (
                                      <Award className="w-6 h-6 text-slate-600" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="text-slate-200 text-xs font-semibold leading-relaxed group-hover:text-white transition-colors truncate" title={b.title}>
                                      {b.title}
                                    </h5>
                                    <span className="text-[10px] text-slate-500 block mt-1 font-mono tracking-wide">
                                      {b.earnedDate || t.noEarnedDate}
                                    </span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            {filteredBadges.length > 12 && (
                              <div className="flex justify-center mt-6">
                                <button
                                  type="button"
                                  onClick={() => setShowAllBadges(!showAllBadges)}
                                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-violet-500/40 rounded-full text-slate-305 hover:text-white text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                                >
                                  {showAllBadges ? (
                                    <>
                                      <ChevronUp className="w-4 h-4 text-violet-400" />
                                      <span>{t.seeLess}</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-4 h-4 text-violet-400" />
                                      <span>{t.seeMore} ({filteredBadges.length - 12})</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info card describing rules in Azerbaijani - Bento styled */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-12 bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden group"
        >
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <h3 className="font-display text-base font-bold text-slate-200 mb-3.5 flex items-center gap-2">
            <Info className="w-5 h-5 text-violet-400" />
            <span>{t.aboutTitle}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans mt-2">
            {t.aboutText}
          </p>
        </motion.section>

      </main>

      {/* Styled Bento Branding / Footer matching original HTML exactly */}
      <footer className="border-t border-slate-900 mt-20 py-8 text-xs font-mono font-medium relative z-10 bg-slate-950/60">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-slate-500 uppercase tracking-widest text-[10px] sm:text-xs">
            <span>Google Skills</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full hidden sm:inline"></span>
            <span>{t.bakuCommunity}</span>
          </div>
          
          <div className="flex items-center gap-2.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-bold uppercase tracking-wider text-[11px] font-mono">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>{t.systemActive}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
