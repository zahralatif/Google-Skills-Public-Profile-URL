import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
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
  ChevronUp,
  Copy,
  Check
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
    ],
    points: 12833
  },
  "demo-mursal-cloud": {
    profileId: "6f4bec5d-1791-4bde-9dd7-8f44e521fc4b",
    userName: "Mursal Gorchuyev",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    badgesCount: 12,
    badges: [
      { title: "Trivia: Noyabr 2024", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Nov 05, 2024" },
      { title: "Trivia: Dekabr 2024", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Dec 12, 2024" },
      { title: "Level 1: Cloud Explorer Game", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Jul 02, 2025" },
      { title: "Build and Secure Networks in Google Cloud", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned May 15, 2025" },
      { title: "Get Started with Google Kubernetes Engine", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Jun 01, 2025" },
      { title: "Create and Manage Cloud Spanner Databases", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Jun 16, 2025" },
      { title: "Deploy and Manage Cloud Environments with Google Cloud", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Jun 22, 2025" },
      { title: "Generative AI Fundamentals", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Jul 10, 2025" },
      { title: "Analyze Images with Gemini in BigQuery", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Jul 12, 2025" },
      { title: "Automating Infrastructure on Google Cloud with Terraform", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Aug 01, 2025" },
      { title: "Security Best Practices in Google Cloud", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Aug 02, 2025" },
      { title: "Monitor and Log with Google Cloud Operations Suite", image: "https://www.cloudskillsboost.google/images/icons/default-avatar.png", earnedDate: "Earned Aug 15, 2025" }
    ],
    points: 18450
  }
};

const APP_TRANSLATIONS = {
  aze: {
    subtitleBadge: "Google Skills Profil Skaneri",
    heroTitle: "Google Cloud Profil Analizatoru",
    heroDesc: "Google Cloud Skills Boost profilinizdəki qazanılmış rəsmi nişanları (badge) dərhal skan edin və kateqoriyalar üzrə təsnifləndirin.",
    totalBadges: "Cəmi Nişanlar",
    totalPoints: "Ümumi Bulud Xalı (GCP XP)",
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
    aiAdvisorTitle: "Profil Məsləhətçisi",
    aiAdvisorSubtitle: "Kateqoriyalar üzrə süzgəc",
    aiAdvisorLabel: "DƏRHAL ANALİZ",
    aiAdvisorLoading: "Profil rəy süzgəcindən keçirilir...",
    aiAdvisorLoadingDesc: "Qazanılmış nişanların mövzuları və bacarıq istiqamətləri araşdırılır.",
    aiAdvisorErrorPrefix: "Analiz alınmadı:",
    btnAiAnalyze: "Profili Analiz Et",
    btnAiAnalyzing: "Analiz Edilir...",
    foundBadgesTitle: "Tapılmış Rəsmi Nişanlar",
    foundBadgesSub: "Rəsmi profil siyahısı",
    noEarnedDate: "Qazanılma tarixi tapılmadı",
    aboutTitle: "Məlumat analizi haqqında",
    aboutText: "Google Cloud Boost profilinizin analiz edilməsi tamamilə ictimai (public) profil linkinizi əsas tutaraq icra olunur. Skaner sizin şəxsi məlumatlarınıza, şifrələrinizə və ya hər hansı digər həssas datalarınıza daxil olmur. Qazanılmış rəsmi rəqəmsal nişanlar dərhal kateqoriyalar üzrə qruplaşdırılaraq istiqamətiniz müəyyənləşdirilir.",
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
    filterOther: "Digər Səviyyələr",
    compareMode: "Müqayisə Rejimi ⚔️",
    singleMode: "Tək Profil Skaneri 🔍",
    profileOneTitle: "1-ci Profil (Sən / İstifadəçi A)",
    profileTwoTitle: "2-ci Profil (Rəqib / İstifadəçi B)",
    profileOnePlaceholder: "1-ci profil URL və ya ID daxil edin",
    profileTwoPlaceholder: "2-ci profil URL və ya ID daxil edin",
    compareBtn: "Müqayisə Et",
    compareTitle: "Profillərin Müqayisəsi",
    winnerLabel: "Liderdir 👑",
    drawLabel: "Bərabərlik 🤝",
    compareStatsTitle: "Göstəricilərin Müqayisə Cədvəli",
    pointsDiff: "XP fərqi",
    badgesDiff: "Nişan fərqi",
    sortNewest: "Ən Yenilər",
    sortOldest: "Ən Köhnələr",
    milestoneToastTitle: "Təbriklər! 🌟",
    milestoneToastDesc: "10,000 XP həddini uğurla keçdiniz!",
    copyLinkBtn: "Profil Linkini Kopyala",
    copiedBtn: "Kopyalandı!"
  },
  eng: {
    subtitleBadge: "Google Skills Profile Scanner",
    heroTitle: "Google Cloud Profile Analyzer",
    heroDesc: "Instantly scan your earned official badges from your Google Cloud Skills Boost profile and classify them by category.",
    totalBadges: "Total Badges",
    totalPoints: "Total Cloud Points (GCP XP)",
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
    aiAdvisorTitle: "Profile Advisor",
    aiAdvisorSubtitle: "Filter by categories",
    aiAdvisorLabel: "INSTANT ANALYSIS",
    aiAdvisorLoading: "Filtering profile...",
    aiAdvisorLoadingDesc: "Mapping your earned credentials to cloud industry competencies.",
    aiAdvisorErrorPrefix: "Analysis failed:",
    btnAiAnalyze: "Analyze Profile",
    btnAiAnalyzing: "Analyzing...",
    foundBadgesTitle: "Found Official Badges",
    foundBadgesSub: "Official profile list",
    noEarnedDate: "Earned date not found",
    aboutTitle: "About data analysis",
    aboutText: "The scanning of your Google Cloud Boost profile is based entirely on your public profile link. The scanner does not access your personal data, passwords, or any other sensitive info. Earned official digital badges are instantly filtered and grouped by technical category.",
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
    filterOther: "Other",
    compareMode: "Comparison Mode ⚔️",
    singleMode: "Single Profile Scanner 🔍",
    profileOneTitle: "1st Profile (You / User A)",
    profileTwoTitle: "2nd Profile (Challenger / User B)",
    profileOnePlaceholder: "Enter 1st profile URL or ID",
    profileTwoPlaceholder: "Enter 2nd profile URL or ID",
    compareBtn: "Compare Profiles",
    compareTitle: "Profile Comparison Grid",
    winnerLabel: "Leading 👑",
    drawLabel: "Tie / Draw 🤝",
    compareStatsTitle: "Metrics Comparison Matrix",
    pointsDiff: "XP Delta",
    badgesDiff: "Badges Delta",
    sortNewest: "Newest First",
    sortOldest: "Oldest First",
    milestoneToastTitle: "Congratulations! 🌟",
    milestoneToastDesc: "You have successfully surpassed the 10,000 XP milestone!",
    copyLinkBtn: "Copy Profile Link",
    copiedBtn: "Copied!"
  },
  rus: {
    subtitleBadge: "Анализатор профиля Google Skills",
    heroTitle: "Анализатор профиля Google Cloud",
    heroDesc: "Мгновенно сканируйте полученные официальные значки (badges) из вашего Google Cloud Skills Boost профиля и классифицируйте их по категориям.",
    totalBadges: "Всего значков",
    totalPoints: "Общие облачные баллы (GCP XP)",
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
    aiAdvisorTitle: "Профильный советник",
    aiAdvisorSubtitle: "Фильтрация по категориям",
    aiAdvisorLabel: "МОМЕНТАЛЬНЫЙ АНАЛИЗ",
    aiAdvisorLoading: "Фильтрация профиля...",
    aiAdvisorLoadingDesc: "Изучаются темы полученных значков и категории ваших навыков.",
    aiAdvisorErrorPrefix: "Ошибка анализа:",
    btnAiAnalyze: "Анализировать профиль",
    btnAiAnalyzing: "Идет анализ...",
    foundBadgesTitle: "Найденные официальные значки",
    foundBadgesSub: "Официальный список профиля",
    noEarnedDate: "Дата получения не найдена",
    aboutTitle: "О веб-анализе",
    aboutText: "Анализ вашего профиля Google Cloud Boost полностью основан на вашей ссылке на публичный профиль. Сканер не запрашивает персональные данные, пароли или любую другую конфиденциальную информацию. Полученные официальные цифровые значки мгновенно группируются и фильтруются по технологическим категориям.",
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
    filterOther: "Другое",
    compareMode: "Режим сравнения ⚔️",
    singleMode: "Один профиль 🔍",
    profileOneTitle: "1-й Профиль (Вы / Пользователь А)",
    profileTwoTitle: "2-й Профиль (Соперник / Пользователь B)",
    profileOnePlaceholder: "Введите URL или ID 1-го профиля",
    profileTwoPlaceholder: "Введите URL или ID 2-го профиля",
    compareBtn: "Сравнить профили",
    compareTitle: "Сравнение профилей",
    winnerLabel: "Лидирует 👑",
    drawLabel: "Ничья 🤝",
    compareStatsTitle: "Таблица сравнения характеристик",
    pointsDiff: "Разница XP",
    badgesDiff: "Разница значков",
    sortNewest: "Сначала новые",
    sortOldest: "Сначала старые",
    milestoneToastTitle: "Поздравляем! 🌟",
    milestoneToastDesc: "Вы успешно преодолели рубеж в 10,000 XP!",
    copyLinkBtn: "Копировать ссылку",
    copiedBtn: "Скопировано!"
  }
};

export default function App() {
  const [lang, setLang] = useState<"aze" | "eng" | "rus">("eng");
  const t = APP_TRANSLATIONS[lang];

  const [profileUrlInput, setProfileUrlInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllBadges, setShowAllBadges] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ai" | "infra" | "database" | "other">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  
  // Real or selected profile state (Single mode)
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyProfileLink = () => {
    if (profileData?.profileId) {
      const url = `https://www.cloudskillsboost.google/public_profiles/${profileData.profileId}`;
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  // --- Comparison Mode State Variables ---
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [profileUrlInput1, setProfileUrlInput1] = useState<string>("");
  const [profileUrlInput2, setProfileUrlInput2] = useState<string>("");
  const [loading1, setLoading1] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [profileData1, setProfileData1] = useState<ProfileData | null>(null);
  const [profileData2, setProfileData2] = useState<ProfileData | null>(null);

  // Synchronize first profile when switching to compare mode
  const handleToggleCompareMode = (compare: boolean) => {
    setIsCompareMode(compare);
    if (compare) {
      if (profileData && !profileData1) {
        setProfileData1(profileData);
        setProfileUrlInput1(profileUrlInput);
      }
    }
  };

  // Preset live demo profiles loading helper (attempts to scan live data first, falls back to offline representations if blocked)
  const loadDemoProfile = async (key: string, forceIndex?: 1 | 2) => {
    const demo = DEMO_PROFILES[key];
    const url = `https://www.skills.google/public_profiles/${demo.profileId}`;
    
    const targetIndex = forceIndex || (isCompareMode ? (!profileData1 ? 1 : 2) : 1);
    
    if (targetIndex === 1) {
      setProfileUrlInput1(url);
      setProfileUrlInput(url);
      setLoading1(true);
      setError1(null);
      setProfileData1(null);
    } else {
      setProfileUrlInput2(url);
      setLoading2(true);
      setError2(null);
      setProfileData2(null);
    }
    
    setLoading(true);
    setError(null);
    if (!isCompareMode) {
      setProfileData(null);
    }

    try {
      const encodedId = encodeURIComponent(demo.profileId);
      const res = await fetch(`/api/fetch-profile/${encodedId}`);
      const data = await res.json();
      if (!res.ok || data.status === "error") {
        throw new Error("Live load failed");
      }
      if (targetIndex === 1) {
        setProfileData1(data);
        setProfileData(data);
      } else {
        setProfileData2(data);
      }
    } catch (err: any) {
      // Fallback gracefully to offline representation
      if (targetIndex === 1) {
        setProfileData1(demo);
        setProfileData(demo);
      } else {
        setProfileData2(demo);
      }
    } finally {
      setLoading(false);
      setLoading1(false);
      setLoading2(false);
    }
  };

  // Perform AJAX crawl fetching for general/single profile
  const handleFetchProfile = async (idOrUrl: string) => {
    if (!idOrUrl.trim()) {
      setError(t.enterIdOrUrlError);
      return;
    }

    setLoading(true);
    setError(null);
    setProfileData(null);
    setShowAllBadges(false);
    setSelectedCategory("all");

    try {
      const encodedId = encodeURIComponent(idOrUrl.trim());
      const res = await fetch(`/api/fetch-profile/${encodedId}`);
      const data = await res.json();

      if (!res.ok || data.status === "error") {
        throw new Error(data.message || (lang === "eng" ? "Failed to retrieve profile." : lang === "rus" ? "Не удалось загрузить профиль." : "Profil axtarılan zaman xəta baş verdi."));
      }

      setProfileData(data);
      // Sync comparison 1 block as well
      setProfileData1(data);
      setProfileUrlInput1(idOrUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || (lang === "eng" ? "Could not read Google Cloud profile. Ensure it is public and try again." : lang === "rus" ? "Не удалось прочитать профиль. Убедитесь, что он открытый." : "Google Cloud Skills Boost profilini oxumaq mümkün olmadı. Profilinizin 'Public' olduğundan əmin olun."));
    } finally {
      setLoading(false);
    }
  };

  // Perform AJAX crawl fetching for specific index (1 or 2) in comparison card
  const handleFetchComparisonProfile = async (idOrUrl: string, index: 1 | 2) => {
    if (!idOrUrl.trim()) {
      if (index === 1) setError1(t.enterIdOrUrlError);
      else setError2(t.enterIdOrUrlError);
      return;
    }

    if (index === 1) {
      setLoading1(true);
      setError1(null);
      setProfileData1(null);
    } else {
      setLoading2(true);
      setError2(null);
      setProfileData2(null);
    }

    try {
      const encodedId = encodeURIComponent(idOrUrl.trim());
      const res = await fetch(`/api/fetch-profile/${encodedId}`);
      const data = await res.json();

      if (!res.ok || data.status === "error") {
        throw new Error(data.message || (lang === "eng" ? "Failed to retrieve profile." : lang === "rus" ? "Не удалось загрузить профиль." : "Profil axtarılan zaman xəta baş verdi."));
      }

      if (index === 1) {
        setProfileData1(data);
        // Sync to single state too for seamless switching
        setProfileData(data);
        setProfileUrlInput(idOrUrl);
      } else {
        setProfileData2(data);
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || (lang === "eng" ? "Could not read Google Cloud profile. Ensure it is public and try again." : lang === "rus" ? "Не удалось прочитать профиль. Убедитесь, что он открытый." : "Google Cloud Skills Boost profilini oxumaq mümkün olmadı. Profilinizin 'Public' olduğundan əmin olun.");
      if (index === 1) setError1(errMsg);
      else setError2(errMsg);
    } finally {
      if (index === 1) setLoading1(false);
      else setLoading2(false);
    }
  };

  // Compute live badge categories and metrics for a specific profile parameter
  const getBadgeBreakdownAndTotal = (prof: ProfileData | null) => {
    if (!prof) {
      return { 
        total: 0, 
        aiCount: 0, 
        infraCount: 0, 
        dbCount: 0, 
        generalCount: 0, 
        badgeCount: 0, 
        tierName: t.tierYaxınlaşan,
        points: 0
      };
    }

    let ai = 0;
    let infra = 0;
    let db = 0;
    let general = 0;
    
    // Check if points are already scraped from official profile
    const hasScrapedPoints = prof.points !== undefined && prof.points !== null && prof.points > 0;
    let points = hasScrapedPoints ? prof.points : 0;

    prof.badges.forEach((b) => {
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

      // Only perform professional taxonomy points calculations if official points aren't scraped
      if (!hasScrapedPoints) {
        if (
          titleLower.includes("skill badge") || 
          titleLower.includes("challenge") || 
          titleLower.includes("professional") || 
          titleLower.includes("architect") || 
          titleLower.includes("engineer")
        ) {
          points += 500;
        } else if (
          titleLower.includes("trivia") || 
          titleLower.includes("level") || 
          titleLower.includes("quest") || 
          titleLower.includes("game")
        ) {
          points += 150;
        } else {
          points += 250;
        }
      }
    });

    const badgeCount = prof.badgesCount || prof.badges.length;
    
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
      tierName,
      points
    };
  };

  const currentStats = getBadgeBreakdownAndTotal(profileData);

  // Milestone Toast state
  const [milestoneToast, setMilestoneToast] = useState<{ show: boolean, name: string, points: number, id: string }>({ show: false, name: "", points: 0, id: "" });
  const rewardedProfilesRef = useRef<Set<string>>(new Set());

  // Check milestone effect
  useEffect(() => {
    const checkProfileMilestone = (p: ProfileData | null) => {
      if (p && p.profileId) {
        if (rewardedProfilesRef.current.has(p.profileId)) return; // Already seen

        const stats = getBadgeBreakdownAndTotal(p);
        if (stats.points >= 10000) {
          setMilestoneToast({ show: true, name: p.userName, points: stats.points, id: p.profileId });
          rewardedProfilesRef.current.add(p.profileId);
          setTimeout(() => {
            setMilestoneToast(prev => prev.id === p.profileId ? { ...prev, show: false } : prev);
          }, 6000);
        }
      }
    };

    if (!isCompareMode) {
      if (profileData) checkProfileMilestone(profileData);
    } else {
      if (profileData1) checkProfileMilestone(profileData1);
      if (profileData2) checkProfileMilestone(profileData2);
    }
  }, [profileData, profileData1, profileData2, isCompareMode]);

  // Compute chart data if profileData exists
  const xpChartData = useMemo(() => {
    // Determine which profile to use: if single mode, might be profileData, if compare mode, maybe null or first profile? The user wants it "below the XP display", which is currentStats driven by profileData. So we'll use profileData.
    if (!profileData || !profileData.badges || profileData.badges.length === 0) return [];
    
    // Create an array to hold all badge dates and their point values
    const events = [];
    for (const b of profileData.badges) {
      if (b.earnedDate) {
        const dateStr = b.earnedDate.replace(/^Earned\s+/i, '').trim();
        const dateScore = Date.parse(dateStr);
        if (!isNaN(dateScore)) {
          let points = 250; // normal badge
          if (b.title && b.title.match(/(Level|League)/i)) {
             points = 500;
          }
          events.push({ date: dateScore, displayDate: dateStr, points });
        }
      }
    }
    
    // Sort oldest first
    events.sort((a, b) => a.date - b.date);
    
    // Accumulate points
    let currentXP = 0;
    const progressData = [];
    for (const ev of events) {
      currentXP += ev.points;
      const d = new Date(ev.date);
      const shortDate = d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      progressData.push({
        name: shortDate,
        xp: currentXP
      });
    }
    
    // Group by shortDate to reduce chart points (take the latest XP for each date)
    const grouped = [];
    for (const p of progressData) {
      if (grouped.length > 0 && grouped[grouped.length - 1].name === p.name) {
        grouped[grouped.length - 1].xp = p.xp;
      } else {
        grouped.push({ ...p });
      }
    }
    
    return grouped;
  }, [profileData]);

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
              <span className="text-xs text-slate-400 font-mono uppercase tracking-widest mb-1.5">{t.totalPoints}</span>
              <div className="relative">
                <div className="text-6xl sm:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-300 to-emerald-400 select-none">
                  {currentStats.points}
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
              
              {xpChartData.length > 0 && (
                <div className="w-full h-24 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={xpChartData}>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px' }} 
                        itemStyle={{ color: '#a78bfa' }} 
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="xp" 
                        stroke="#8b5cf6" 
                        strokeWidth={2} 
                        dot={false} 
                        activeDot={{ r: 4, fill: "#34d399", stroke: "#0f172a", strokeWidth: 2 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
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

        {/* Mode Switch Tabs - Polished Floating Control Tray */}
        <div className="flex gap-2.5 mb-8 justify-center sm:justify-start relative z-20">
          <button
            type="button"
            onClick={() => handleToggleCompareMode(false)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              !isCompareMode
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg border-violet-500/30"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t.singleMode}</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggleCompareMode(true)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              isCompareMode
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg border-violet-500/30"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            <RefreshCw className="w-4 h-4 text-violet-300" />
            <span>{t.compareMode}</span>
          </button>
        </div>

        {/* Tab Contents - Auto-loaded Direct Profile Crawler / Comparison Engine */}
        <div className="space-y-8">
          {isCompareMode ? (
            <div className="space-y-8 animate-fade-in">
              {/* Comparison Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile 1 Input Card */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300">
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <h4 className="font-display text-sm font-bold text-violet-300 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{t.profileOneTitle}</span>
                  </h4>
                  
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleFetchComparisonProfile(profileUrlInput1, 1);
                    }}
                    className="flex gap-2 items-stretch"
                  >
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={t.profileOnePlaceholder}
                        value={profileUrlInput1}
                        onChange={(e) => setProfileUrlInput1(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-violet-500 outline-none rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 transition-colors text-xs font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading1}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs shrink-0 disabled:opacity-55 cursor-pointer font-mono"
                    >
                      {loading1 ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      <span>{t.compareBtn}</span>
                    </button>
                  </form>

                  {error1 && (
                    <div className="mt-3 p-3 bg-red-400/10 border border-red-500/20 text-red-300 rounded-xl text-[11px] leading-relaxed">
                      {error1}
                    </div>
                  )}

                  {/* Demo shortcuts for profile 1 */}
                  <div className="mt-4 flex gap-2 flex-wrap items-center">
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold font-mono tracking-wider mr-1">Demo:</span>
                    <button
                      type="button"
                      onClick={() => loadDemoProfile("demo-zohra-cloud", 1)}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-850 hover:border-violet-500/40 rounded-lg text-[10px] text-slate-400 font-mono transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Zahra Latif</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => loadDemoProfile("demo-mursal-cloud", 1)}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-850 hover:border-violet-500/40 rounded-lg text-[10px] text-slate-400 font-mono transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Mursal Gorchuyev</span>
                    </button>
                  </div>

                  {/* Status of Loader 1 */}
                  {profileData1 && (
                    <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3 animate-fade-in">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        {profileData1.avatarUrl ? (
                          <img src={profileData1.avatarUrl} alt={profileData1.userName} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white truncate">{profileData1.userName}</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{getBadgeBreakdownAndTotal(profileData1).points} XP • {getBadgeBreakdownAndTotal(profileData1).total} Badges</div>
                      </div>
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  )}
                </div>

                {/* Profile 2 Input Card */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300">
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-violet-600/5 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <h4 className="font-display text-sm font-bold text-violet-300 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{t.profileTwoTitle}</span>
                  </h4>
                  
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleFetchComparisonProfile(profileUrlInput2, 2);
                    }}
                    className="flex gap-2 items-stretch"
                  >
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={t.profileTwoPlaceholder}
                        value={profileUrlInput2}
                        onChange={(e) => setProfileUrlInput2(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-violet-500 outline-none rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder-slate-600 transition-colors text-xs font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading2}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs shrink-0 disabled:opacity-55 cursor-pointer font-mono"
                    >
                      {loading2 ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      <span>{t.compareBtn}</span>
                    </button>
                  </form>

                  {error2 && (
                    <div className="mt-3 p-3 bg-red-400/10 border border-red-500/20 text-red-300 rounded-xl text-[11px] leading-relaxed">
                      {error2}
                    </div>
                  )}

                  {/* Demo shortcuts for profile 2 */}
                  <div className="mt-4 flex gap-2 flex-wrap items-center">
                    <span className="text-[10px] text-zinc-500 uppercase font-semibold font-mono tracking-wider mr-1">Demo:</span>
                    <button
                      type="button"
                      onClick={() => loadDemoProfile("demo-zohra-cloud", 2)}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-850 hover:border-violet-500/40 rounded-lg text-[10px] text-slate-400 font-mono transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Zahra Latif</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => loadDemoProfile("demo-mursal-cloud", 2)}
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-850 hover:border-violet-500/40 rounded-lg text-[10px] text-slate-400 font-mono transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Mursal Gorchuyev</span>
                    </button>
                  </div>

                  {/* Status of Loader 2 */}
                  {profileData2 && (
                    <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3 animate-fade-in">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        {profileData2.avatarUrl ? (
                          <img src={profileData2.avatarUrl} alt={profileData2.userName} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white truncate">{profileData2.userName}</div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{getBadgeBreakdownAndTotal(profileData2).points} XP • {getBadgeBreakdownAndTotal(profileData2).total} Badges</div>
                      </div>
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  )}
                </div>
              </div>

              {/* Side-by-Side Comparison grid - Rendered when AT LEAST ONE profile is loaded */}
              {(profileData1 || profileData2) ? (
                (() => {
                  const stats1 = getBadgeBreakdownAndTotal(profileData1);
                  const stats2 = getBadgeBreakdownAndTotal(profileData2);

                  // Highlight leaders helper
                  const isBetterXP = (val1: number, val2: number) => {
                    if (!profileData1 || !profileData2) return false;
                    return val1 > val2;
                  };

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Compare Headers & Quick Leader Highlight banner */}
                      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800/80 pb-4">
                          <Award className="w-5 h-5 text-violet-400" />
                          <span>{t.compareTitle}</span>
                        </h3>

                        {/* Grid layout side by side comparing total badges and XP */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                          {/* Profile A Column Card */}
                          <div className={`p-6 rounded-2xl border transition-all ${
                            profileData1 
                              ? "bg-slate-950/80 border-slate-800 hover:border-slate-700/85" 
                              : "bg-slate-950/30 border-dashed border-slate-805/40 flex flex-col items-center justify-center py-10"
                          }`}>
                            {profileData1 ? (
                              <div className="space-y-6">
                                {/* Name & Avatar */}
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-900 border-2 border-violet-500/35 shrink-0">
                                    {profileData1.avatarUrl ? (
                                      <img src={profileData1.avatarUrl} alt={profileData1.userName} className="w-full h-full object-cover animate-fade-in" />
                                    ) : (
                                      <User className="w-6 h-6 text-slate-500" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-sm text-white truncate">{profileData1.userName}</h5>
                                    <span className="text-[10px] text-violet-300 font-semibold uppercase tracking-wider">{stats1.tierName}</span>
                                  </div>
                                  {profileData2 && stats1.points >= stats2.points && stats1.points > 0 && (
                                    <span className="bg-violet-500/10 text-violet-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-violet-500/30 flex items-center gap-1 shrink-0 animate-pulse">
                                      👑 {t.winnerLabel}
                                    </span>
                                  )}
                                </div>

                                {/* Main Big Metrics side-by-side in Comparison layout */}
                                <div className="grid grid-cols-2 gap-3.5">
                                  <div className={`p-4 rounded-xl border transition-all duration-350 ${
                                    isBetterXP(stats1.points, stats2.points) 
                                      ? "bg-violet-500/10 border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                                      : "bg-slate-900/40 border-slate-800"
                                  }`}>
                                    <span className="text-[10px] text-slate-400 font-mono uppercase block">{t.totalPoints}</span>
                                    <div className={`text-2xl font-black font-mono mt-1 ${isBetterXP(stats1.points, stats2.points) ? "text-violet-350 font-extrabold" : "text-white"}`}>{stats1.points}</div>
                                  </div>

                                  <div className={`p-4 rounded-xl border transition-all duration-355 ${
                                    isBetterXP(stats1.total, stats2.total) 
                                      ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                                      : "bg-slate-900/40 border-slate-800"
                                  }`}>
                                    <span className="text-[10px] text-slate-400 font-mono uppercase block">{t.totalBadges}</span>
                                    <div className={`text-2xl font-black font-mono mt-1 ${isBetterXP(stats1.total, stats2.total) ? "text-emerald-400 font-extrabold" : "text-white"}`}>{stats1.total}</div>
                                  </div>
                                </div>

                                {/* Breakdown Categories side-by-side comparison */}
                                <div className="space-y-2.5">
                                  <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">{t.categoryAi} ({t.categoryAiDesc})</span>
                                    <span className={`font-bold ${isBetterXP(stats1.aiCount, stats2.aiCount) ? "text-violet-300 font-extrabold" : "text-slate-200"}`}>{stats1.aiCount}</span>
                                  </div>
                                  <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">{t.categoryInfra} ({t.categoryInfraDesc})</span>
                                    <span className={`font-bold ${isBetterXP(stats1.infraCount, stats2.infraCount) ? "text-violet-300 font-extrabold" : "text-slate-200"}`}>{stats1.infraCount}</span>
                                  </div>
                                  <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">{t.categoryDbValue} ({t.categoryDbDesc})</span>
                                    <span className={`font-bold ${isBetterXP(stats1.dbCount, stats2.dbCount) ? "text-violet-300 font-extrabold" : "text-slate-200"}`}>{stats1.dbCount}</span>
                                  </div>
                                  <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">{t.categoryOtherValue} ({t.categoryOtherDesc})</span>
                                    <span className={`font-bold ${isBetterXP(stats1.generalCount, stats2.generalCount) ? "text-emerald-400 font-extrabold" : "text-slate-200"}`}>{stats1.generalCount}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center">
                                <User className="w-10 h-10 text-slate-700 mx-auto opacity-30 mb-2" />
                                <p className="text-xs text-slate-500 font-sans">
                                  {lang === "eng" 
                                    ? "Scan first profile above to test." 
                                    : lang === "rus" 
                                    ? "Сначала просканируйте 1-й профиль." 
                                    : "Öncə yuxarıdan 1-ci profili skan edin."}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Profile B Column Card */}
                          <div className={`p-6 rounded-2xl border transition-all ${
                            profileData2 
                              ? "bg-slate-950/80 border-slate-800 hover:border-slate-700/85" 
                              : "bg-slate-950/30 border-dashed border-slate-805/40 flex flex-col items-center justify-center py-10"
                          }`}>
                            {profileData2 ? (
                              <div className="space-y-6">
                                {/* Name & Avatar */}
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-900 border-2 border-violet-500/35 shrink-0">
                                    {profileData2.avatarUrl ? (
                                      <img src={profileData2.avatarUrl} alt={profileData2.userName} className="w-full h-full object-cover animate-fade-in" />
                                    ) : (
                                      <User className="w-6 h-6 text-slate-500" />
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-sm text-white truncate">{profileData2.userName}</h5>
                                    <span className="text-[10px] text-violet-300 font-semibold uppercase tracking-wider">{stats2.tierName}</span>
                                  </div>
                                  {profileData1 && stats2.points >= stats1.points && stats2.points > 0 && (
                                    <span className="bg-violet-500/10 text-violet-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-violet-500/30 flex items-center gap-1 shrink-0 animate-pulse">
                                      👑 {t.winnerLabel}
                                    </span>
                                  )}
                                </div>

                                {/* Main Big Metrics side-by-side in Comparison layout */}
                                <div className="grid grid-cols-2 gap-3.5">
                                  <div className={`p-4 rounded-xl border transition-all duration-350 ${
                                    isBetterXP(stats2.points, stats1.points) 
                                      ? "bg-violet-500/10 border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                                      : "bg-slate-900/40 border-slate-800"
                                  }`}>
                                    <span className="text-[10px] text-slate-400 font-mono uppercase block">{t.totalPoints}</span>
                                    <div className={`text-2xl font-black font-mono mt-1 ${isBetterXP(stats2.points, stats1.points) ? "text-violet-350 font-extrabold" : "text-white"}`}>{stats2.points}</div>
                                  </div>

                                  <div className={`p-4 rounded-xl border transition-all duration-355 ${
                                    isBetterXP(stats2.total, stats1.total) 
                                      ? "bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                                      : "bg-slate-900/40 border-slate-800"
                                  }`}>
                                    <span className="text-[10px] text-slate-400 font-mono uppercase block">{t.totalBadges}</span>
                                    <div className={`text-2xl font-black font-mono mt-1 ${isBetterXP(stats2.total, stats1.total) ? "text-emerald-400 font-extrabold" : "text-white"}`}>{stats2.total}</div>
                                  </div>
                                </div>

                                {/* Breakdown Categories side-by-side comparison */}
                                <div className="space-y-2.5">
                                  <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">{t.categoryAi} ({t.categoryAiDesc})</span>
                                    <span className={`font-bold ${isBetterXP(stats2.aiCount, stats1.aiCount) ? "text-violet-300 font-extrabold" : "text-slate-200"}`}>{stats2.aiCount}</span>
                                  </div>
                                  <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">{t.categoryInfra} ({t.categoryInfraDesc})</span>
                                    <span className={`font-bold ${isBetterXP(stats2.infraCount, stats1.infraCount) ? "text-violet-300 font-extrabold" : "text-slate-200"}`}>{stats2.infraCount}</span>
                                  </div>
                                  <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">{t.categoryDbValue} ({t.categoryDbDesc})</span>
                                    <span className={`font-bold ${isBetterXP(stats2.dbCount, stats1.dbCount) ? "text-violet-300 font-extrabold" : "text-slate-200"}`}>{stats2.dbCount}</span>
                                  </div>
                                  <div className="bg-slate-900/30 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-400">{t.categoryOtherValue} ({t.categoryOtherDesc})</span>
                                    <span className={`font-bold ${isBetterXP(stats2.generalCount, stats1.generalCount) ? "text-emerald-400 font-extrabold" : "text-slate-200"}`}>{stats2.generalCount}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <User className="w-10 h-10 text-slate-700 mx-auto opacity-30 mb-2" />
                                <p className="text-xs text-slate-500 font-sans mb-3">
                                  {lang === "eng" 
                                    ? "Waiting for challenger profile..." 
                                    : lang === "rus" 
                                    ? "Ожидание профиля соперника..." 
                                    : "Rəqib profilinin yüklənməsi gözlənilir..."}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => loadDemoProfile("demo-mursal-cloud", 2)}
                                  className="px-3.5 py-1.5 bg-violet-600/15 border border-violet-500/20 hover:border-violet-500/40 text-[11px] font-bold text-violet-300 rounded-xl transition-all cursor-pointer font-sans"
                                >
                                  {lang === "eng" ? "Load Mursal (Demo)" : lang === "rus" ? "Загрузить Мурсал (Demo)" : "Mursal Profilini Yüklə (Demo)"}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* delta banner if both are analyzed */}
                        {profileData1 && profileData2 && (
                          <div className="mt-8 pt-6 border-t border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-400 relative z-10 bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-violet-400" />
                              <span>
                                {t.pointsDiff}:{" "}
                                <strong className="text-violet-300 font-bold">
                                  {Math.abs(stats1.points - stats2.points)} XP
                                </strong>{" "}
                                ({stats1.points > stats2.points ? profileData1.userName : (stats2.points > stats1.points ? profileData2.userName : t.drawLabel)} is leading)
                              </span>
                            </div>
                            <div>
                              {t.badgesDiff}:{" "}
                              <strong className="text-emerald-400 font-bold">
                                {Math.abs(stats1.total - stats2.total)}
                              </strong>{" "}
                              ({stats1.total > stats2.total ? profileData1.userName : (stats2.total > stats1.total ? profileData2.userName : t.drawLabel)} has more)
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })()
              ) : null}
            </div>
          ) : (
            /* Single Profile Mode */
            <>
              {/* Profile Link crawling input container - Bento card */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300 animate-fade-in">
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
                      className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 focus:border-violet-500 outline-none rounded-2xl pl-12 pr-4 py-3 sm:py-3.5 text-slate-200 placeholder-slate-600 transition-colors text-sm font-sans"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/15 text-sm shrink-0 disabled:opacity-55 font-mono cursor-pointer"
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
                    className="mt-4 p-4 bg-red-400/10 border border-red-500/20 text-red-300 rounded-xl text-xs sm:text-sm leading-relaxed"
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
                      className="px-4 py-2.5 bg-slate-950 border-2 border-violet-500/35 hover:border-violet-500/70 rounded-xl text-left text-xs text-slate-300 transition-all flex items-center gap-3 hover:bg-slate-900 group w-full sm:w-fit cursor-pointer animate-fade-in"
                      title="skills.google/public_profiles/43eb4c10-eb3a-4df8-aa3e-068f2ef96c58"
                    >
                      <User className="w-4 h-4 text-violet-400 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1">Zahra Latif <span className="bg-violet-500/20 text-violet-300 text-[8px] px-1.5 py-0.2 rounded uppercase font-semibold">LIVE</span></div>
                        <div className="text-[9px] text-slate-400">{t.sample1Subtitle}</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => loadDemoProfile("demo-mursal-cloud")}
                      className="px-4 py-2.5 bg-slate-950 border-2 border-violet-500/35 hover:border-violet-500/70 rounded-xl text-left text-xs text-slate-300 transition-all flex items-center gap-3 hover:bg-slate-900 group w-full sm:w-fit cursor-pointer animate-fade-in"
                      title="skills.google/public_profiles/6f4bec5d-1791-4bde-9dd7-8f44e521fc4b"
                    >
                      <User className="w-4 h-4 text-violet-400 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1">Mursal Gorchuyev <span className="bg-violet-500/20 text-violet-300 text-[8px] px-1.5 py-0.2 rounded uppercase font-semibold">LIVE</span></div>
                        <div className="text-[9px] text-slate-400">{t.sample2Subtitle}</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Crawled Results Grid - Standard Single Profile UI */}
              <AnimatePresence mode="wait">
                {profileData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8 animate-fade-in"
                  >
                    {/* Profile Header display card */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 justify-between relative overflow-hidden group hover:border-slate-700/55 transition-colors duration-300">
                      <div className="absolute -right-4 -top-4 w-28 h-28 bg-violet-500/5 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left font-sans">
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
                          <div className="flex items-center gap-3">
                            <h4 className="font-display text-xl font-bold text-white leading-snug">{profileData.userName}</h4>
                            <button
                              type="button"
                              onClick={copyProfileLink}
                              className="px-2.5 py-1.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-[10px] text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer font-sans shadow-sm"
                              title={isCopied ? t.copiedBtn : t.copyLinkBtn}
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-semibold">{t.copiedBtn}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-violet-400" />
                                  <span>{t.copyLinkBtn}</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 font-mono break-all font-semibold">ID: {profileData.profileId}</p>
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-350 mt-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 font-medium font-sans">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {t.verifiedProfile}
                          </span>
                        </div>
                      </div>
                    </div>

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

                        const filteredBadges = [...profileData.badges].filter(b => {
                          if (selectedCategory === "all") return true;
                          return getBadgeCategory(b.title) === selectedCategory;
                        });

                        // Sort filtered badges based on the parsed earnedDate string
                        filteredBadges.sort((a, b) => {
                          const dateA = a.earnedDate ? Date.parse(a.earnedDate.replace(/^Earned\s+/i, '').trim()) : 0;
                          const dateB = b.earnedDate ? Date.parse(b.earnedDate.replace(/^Earned\s+/i, '').trim()) : 0;
                          
                          const timestampA = isNaN(dateA) ? 0 : dateA;
                          const timestampB = isNaN(dateB) ? 0 : dateB;

                          if (sortOrder === "newest") {
                            return timestampB - timestampA;
                          } else {
                            return timestampA - timestampB;
                          }
                        });

                        const badgesSubset = showAllBadges ? filteredBadges : filteredBadges.slice(0, 12);

                        return (
                          <>
                            {/* Category Filter and Sort UI */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                              {/* Category Filter UI */}
                              <div className="flex flex-wrap gap-2 p-1.5 bg-slate-950/45 border border-slate-800/40 rounded-2xl max-w-fit animate-fade-in">
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

                            {/* Sort Toggle UI */}
                            <div className="flex items-center gap-2 p-1.5 bg-slate-950/45 border border-slate-800/40 rounded-2xl max-w-fit animate-fade-in mb-6 md:mb-0">
                              <button
                                type="button"
                                onClick={() => setSortOrder("newest")}
                                className={`px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border min-w-[110px] ${
                                  sortOrder === "newest"
                                    ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                                    : "border-transparent bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                                }`}
                              >
                                <span>{t.sortNewest}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSortOrder("oldest")}
                                className={`px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border min-w-[110px] ${
                                  sortOrder === "oldest"
                                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                                    : "border-transparent bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                                }`}
                              >
                                <span>{t.sortOldest}</span>
                              </button>
                            </div>
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
            </>
          )}
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

      {/* Milestone Toast Notification */}
      <AnimatePresence>
        {milestoneToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-violet-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-violet-500/20 max-w-sm overflow-hidden"
          >
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-violet-300" />
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h4 className="text-white font-display font-bold text-sm mb-1">{t.milestoneToastTitle}</h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {t.milestoneToastDesc} 
                  <span className="text-violet-300 font-mono font-bold mt-1.5 block truncate">
                    {milestoneToast.name}: {milestoneToast.points} XP!
                  </span>
                </p>
              </div>
              <button 
                onClick={() => setMilestoneToast(prev => ({...prev, show: false}))}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1 cursor-pointer absolute right-0 top-0"
                aria-label="Close"
              >
                <ChevronDown className="w-4 h-4 rotate-90" />
              </button>
            </div>
            
            {/* Ambient effects within toast */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

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
