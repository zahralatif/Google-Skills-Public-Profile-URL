import { motion } from "motion/react";
import { ExternalLink, Key, Award, Link as LinkIcon, AlertCircle, Copy, Check } from "lucide-react";
import { useState } from "react";

interface GuideSectionProps {
  lang: "aze" | "eng" | "rus";
}

const TRANSLATIONS = {
  aze: {
    badge: "Google Cloud Skills Tutorial",
    title: "Public Profile URL necə tapılır?",
    subtitle: "Profilinizi və qazandığınız rəsmi nişanları (badge) analiz etmək üçün profil linkini tapmağın ən qısa yolu.",
    statusTitle: "Profil Statusu",
    statusValue: "Public Olmalıdır",
    step1Title: "Google Skills-ə daxil ol",
    step1Desc: "Google Cloud Skills Boost platformasını açın və istifadə etdiyiniz rəsmi Google hesabınızla daxil olun (Sign In).",
    step1Link: "Google Skills-ə keç",
    step2Title: "Account Settings",
    step2Desc: "Sağ-üst küncdəki profil şəklinə klik edib ayarlara keçin və səhifənin aşağı hissəsində \"Public Profile\" bölməsini tapın.",
    step2Link: "Hesab Profilim",
    whyTitle: "Niyə bu analiz lazımdır?",
    why1: "Google Cloud platformasındakı rəsmi bitirdiyiniz kursları və qazanılmış nişanları vahid portfoliosunda izləmək üçün.",
    why2: "Hansı texniki sahədə (məs. AI/Məlumat, DevOps, Kibertəhlükəsizlik) daha güclü olduğunuzu anlamaq üçün.",
    why3: "Növbəti rəsmi karyera addımlarına uyğun hansı kursları götürmək barədə ağıllı tövsiyələr almaq üçün.",
    warning: "Profiliniz bağlıdırsa, analizator nişanlarınızı oxuya bilməyəcək. Skan etməzdən öncə profilinizi Public edin.",
    step3Title: "Profil linkini kopyalayın",
    step3Desc: "\"Public Profile URL\" sahəsindəki linki kopyalayın. Format adətən aşağıdakı rəsmi nümunədəki kimi görünür:",
    copyBtn: "Nümunə kopyala",
    copied: "Kopyalandı!"
  },
  eng: {
    badge: "Google Cloud Skills Tutorial",
    title: "How to find your Public Profile URL?",
    subtitle: "The fastest way to retrieve your public profile link to analyze your progress and earned badges.",
    statusTitle: "Profile Status",
    statusValue: "Must be Public",
    step1Title: "Sign In to Google Skills",
    step1Desc: "Open the official Google Cloud Skills Boost platform and sign inside your profile using your cloud account.",
    step1Link: "Go to Google Skills",
    step2Title: "Account Settings",
    step2Desc: "Click your profile image in the top-right corner, enter settings, and find the \"Public Profile\" section at the bottom.",
    step2Link: "My Profile Settings",
    whyTitle: "Why do you need this analysis?",
    why1: "To track your officially completed courses and digital credentials in a single, elegant tech portfolio.",
    why2: "To determine which technical pathways (AI, DevOps, Security, Data) you are most accomplished in.",
    why3: "To receive automated career recommendations and smart guidance for future GCP milestones.",
    warning: "If your profile link is not public, our scanner won't be able to fetch your badges. Make it public inside settings.",
    step3Title: "Copy the Profile URL",
    step3Desc: "Highlight and copy the URL in the \"Public Profile URL\" field. The format looks identical to the official example below:",
    copyBtn: "Copy sample URL",
    copied: "Copied!"
  },
  rus: {
    badge: "Инструкция Google Cloud",
    title: "Как найти URL публичного профиля?",
    subtitle: "Самый короткий путь скопировать ссылку вашего аккаунта для мгновенного анализа пройденных курсов.",
    statusTitle: "Статус профиля",
    statusValue: "Должен быть Public",
    step1Title: "Войти в Google Skills",
    step1Desc: "Откройте официальную платформу Google Cloud Skills Boost и выполните вход под своим облачным аккаунтом.",
    step1Link: "Перейти на Google Skills",
    step2Title: "Настройки (Settings)",
    step2Desc: "Нажмите на фото профиля в правом верхнем углу, зайдите в настройки и найдите блок \"Public Profile\" внизу страницы.",
    step2Link: "Профиль аккаунта",
    whyTitle: "Зачем нужен этот анализ?",
    why1: "Чтобы собрать все успешно пройденные курсы и заработанные значки в едином защищенном портфолио.",
    why2: "Чтобы оценить наглядный прогресс в различных сферах: ИИ, DevOps, БД, Безопасность и Инфраструктура.",
    why3: "Чтобы получить рекомендации карьерной траектории от Gemini AI на основе вашего текущего опыта.",
    warning: "Если ваш профиль является приватным, сканер не сможет извлечь ваши значки. Сделайте его публичным в настройках.",
    step3Title: "Скопируйте ссылку",
    step3Desc: "Скопируйте URL из блока \"Public Profile URL\". Правильный формат выглядит полностью как в примере ниже:",
    copyBtn: "Копировать пример",
    copied: "Скопировано!"
  }
};

export default function GuideSection({ lang }: GuideSectionProps) {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.aze;

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://www.skills.google/public_profiles/43eb4c10-eb3a-4df8-aa3e-068f2ef96c58");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mt-16 w-full" id="guide-section">
      {/* Header Section from Design Template */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-800/40">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/30 rounded-full w-fit">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">{t.badge}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            {t.title}
          </h2>
          <p className="text-slate-400 max-w-2xl text-xs sm:text-sm">
            {t.subtitle}
          </p>
        </div>
        
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-4 shrink-0 transition-all hover:bg-slate-900/80">
          <div className="h-10 w-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">{t.statusTitle}</p>
            <p className="text-xs text-emerald-400 uppercase font-bold tracking-widest font-mono">{t.statusValue}</p>
          </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Step 1 Card: Left Side Top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col gap-5 hover:border-violet-500/50 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-28 h-28 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all duration-300"></div>
          
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center text-xl font-display font-black text-white shadow-lg shadow-violet-900/20 transition-transform group-hover:scale-105 duration-350">
              1
            </div>
            <Key className="w-5 h-5 text-slate-500 group-hover:text-violet-400 transition-colors" />
          </div>

          <h3 className="text-xl font-bold font-display text-white group-hover:text-violet-200 transition-colors">
            {t.step1Title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t.step1Desc}
          </p>
          
          <div className="mt-auto pt-4 space-y-3">
            <a
              href="https://www.cloudskillsboost.google/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-xs font-semibold tracking-wide transition-colors"
            >
              {t.step1Link}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="h-1 bg-slate-800 w-full rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 w-1/3 rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Step 2 Card: Center Top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col gap-5 hover:border-violet-500/50 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300"></div>
          
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-xl font-display font-black text-white group-hover:bg-slate-700 transition-colors">
              2
            </div>
            <Award className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
          </div>

          <h3 className="text-xl font-bold font-display text-white group-hover:text-indigo-200 transition-colors">
            {t.step2Title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t.step2Desc}
          </p>
          
          <div className="mt-auto pt-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-400 font-mono">Profile</span>
            <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-400 font-mono">Settings</span>
            <a
              href="https://www.cloudskillsboost.google/my_account/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-colors"
            >
              {t.step2Link} <ExternalLink className="w-3" />
            </a>
          </div>
        </motion.div>

        {/* Why Card: Vertical tall card right column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="md:row-span-2 bg-gradient-to-b from-indigo-500/10 to-transparent border border-slate-800/80 rounded-3xl p-6 md:p-8 flex flex-col gap-6"
        >
          <h3 className="text-2xl font-bold font-display text-white">{t.whyTitle}</h3>
          
          <div className="space-y-5 flex-1 justify-center flex flex-col">
            <div className="flex gap-4">
              <div className="w-1 h-12 bg-indigo-500 rounded-full shrink-0"></div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.why1}
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="w-1 h-12 bg-indigo-500 rounded-full opacity-60 shrink-0"></div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.why2}
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="w-1 h-12 bg-indigo-500 rounded-full opacity-30 shrink-0"></div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.why3}
              </p>
            </div>
          </div>
          
          <div className="mt-auto p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-indigo-200 leading-normal italic">
              {t.warning}
            </p>
          </div>
        </motion.div>

        {/* Step 3 Card: Bottom row span double width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="md:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 hover:border-emerald-500/30 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl font-display font-black text-white shrink-0 shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-300">
            3
          </div>
          
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-xl font-bold font-display text-white flex items-center gap-2 group-hover:text-emerald-300 transition-colors">
              {t.step3Title}
              <LinkIcon className="w-4 h-4 text-slate-500" />
            </h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              {t.step3Desc}
            </p>
            
            {/* Click to Copy Box from Design */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-xl font-mono text-xs sm:text-sm text-emerald-400 flex justify-between items-center transition-all cursor-pointer select-all group/btn text-left"
            >
              <span className="truncate pr-4 font-sans text-xs sm:text-sm text-slate-200 hover:text-emerald-300">
                https://www.skills.google/public_profiles/43eb4c10-eb3a-4df8-aa3e-068f2ef96c58
              </span>
              <div className="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-sans group-hover/btn:text-emerald-300 transition-colors">
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyBtn}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

