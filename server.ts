import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";

// Lazy-loaded Gemini client on the server side
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is not configured. Please add your GEMINI_API_KEY under Settings > Secrets in the AI Studio UI.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Robust text content generation helper with automatic exponential retries and fallback models
async function generateContentWithRetryAndFallback(api: GoogleGenAI, contents: string, retries = 3, delayMs = 1000): Promise<any> {
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;
  
  for (const model of models) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`[Gemini] Attempting generation with model "${model}" (attempt ${attempt}/${retries})...`);
        const response = await api.models.generateContent({
          model: model,
          contents: contents
        });
        if (response) {
          console.log(`[Gemini] Success using model "${model}"!`);
          return response;
        }
      } catch (error: any) {
        lastError = error;
        const errorStr = (error.message || "").toLowerCase() + " " + JSON.stringify(error).toLowerCase();
        const isTransient = errorStr.includes("503") || errorStr.includes("unavailable") || errorStr.includes("high demand") || errorStr.includes("temporary") || errorStr.includes("overloaded");
        
        console.warn(`[Gemini Error] Model "${model}" failed on attempt ${attempt}:`, error.message);
        
        if (isTransient && attempt < retries) {
          const waitTime = delayMs * attempt;
          console.log(`[Gemini] Transient error, waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else if (!isTransient) {
          // If it's a non-transient error (like bad key), throw immediately
          throw error;
        } else {
          // Last try for this model, exit retry loop to fall back to the next model in list
          break;
        }
      }
    }
  }
  
  throw lastError || new Error("All configured Gemini models failed or returned unavailable (503).");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Fetch Public Profile from Google Cloud Skills Boost
  app.get("/api/fetch-profile/:id", async (req, res) => {
    try {
      const profileInput = req.params.id.trim();
      
      // Extract profile ID from URL if full URL is pasted
      let profileId = profileInput;
      if (profileInput.includes("/public_profiles/")) {
        const parts = profileInput.split("/public_profiles/");
        profileId = parts[parts.length - 1].split("?")[0].split("/")[0];
      } else if (profileInput.includes("/")) {
        const parts = profileInput.split("/");
        profileId = parts[parts.length - 1].split("?")[0];
      }

      // Basic UUID validation or general alphanumeric hyphen validation
      const idRegex = /^[a-zA-Z0-9-]+$/;
      if (!idRegex.test(profileId)) {
        return res.status(400).json({
          status: "error",
          message: "Daxil edilən profil ID formatı düzgün deyil. Zəhmət olmasa təlimata baxın."
        });
      }

      const targetUrl = `https://www.cloudskillsboost.google/public_profiles/${profileId}`;
      
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({
          status: "error",
          message: `Profil tapılmadı (Xəta kodu: ${response.status}). Profilinizin ictimai (public) olduğundan əmin olun.`
        });
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract User Name
      let userName = $(".ql-display-small, .ql-headline-medium, h1").first().text().trim();
      if (!userName) {
        userName = $(".profile-name, .public-profile-heading").first().text().trim();
      }
      if (!userName) {
        userName = "Google Skills Qonağı";
      }

      // Extract Avatar Image
      let avatarUrl = $(".public-profile-avatar img, .profile-avatar img, img[src*='avatar']").first().attr("src");
      if (!avatarUrl) {
        avatarUrl = "/placeholder-avatar.png"; // Fallback placeholder
      }

      // Parse Badges
      const badges: any[] = [];
      const selectors = [
        ".profile-badge",
        ".public-profile-badge",
        ".ql-badge-card",
        ".badge-card",
        "div[class*='badge']"
      ];

      // We scan nodes that contain a potential ql-title-medium and ql-body-medium
      $(".profile-badge, .public-profile-badge, div[class*='badge-card'], div[class*='badge_card']").each((_, element) => {
        const title = $(element).find(".ql-title-medium, h3, [class*='title'], [class*='name']").first().text().trim();
        const dateText = $(element).find(".ql-body-medium, [class*='body'], [class*='date'], [class*='earned']").first().text().trim();
        const image = $(element).find("img").first().attr("src");
        
        if (title && !title.includes("Points") && !title.includes("Profile")) {
          // Double check image is complete or absolute URL
          let fullImage = image || "";
          if (fullImage && !fullImage.startsWith("http")) {
            fullImage = `https://www.cloudskillsboost.google${fullImage}`;
          }
          
          // Avoid duplicate titles
          if (!badges.some(b => b.title === title)) {
            badges.push({
              title,
              image: fullImage,
              earnedDate: dateText || ""
            });
          }
        }
      });

      // Slower fallback if no badges matched by wrapper selector, scanning all images inside the profile content area
      if (badges.length === 0) {
        $("img[src*='cdn.qwiklabs.com'], img[src*='qwiklabs']").each((_, element) => {
          const imgUrl = $(element).attr("src") || "";
          // Find title next to image or in parent
          const parent = $(element).parent();
          const title = parent.find(".ql-title-medium, [class*='title']").first().text().trim();
          const dateText = parent.find(".ql-body-medium, [class*='date']").first().text().trim();
          
          if (title) {
            let fullImage = imgUrl;
            if (fullImage && !fullImage.startsWith("http")) {
              fullImage = `https://www.cloudskillsboost.google${fullImage}`;
            }
            if (!badges.some(b => b.title === title)) {
              badges.push({
                title,
                image: fullImage,
                earnedDate: dateText
              });
            }
          }
        });
      }

      res.json({
        status: "success",
        profileId,
        userName,
        avatarUrl,
        badgesCount: badges.length,
        badges,
        rawDataLength: html.length
      });

    } catch (error: any) {
      console.error("Error fetching profile:", error);
      res.status(500).json({
        status: "error",
        message: "Profil məlumatlarını yükləyərkən gözlənilməz xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin."
      });
    }
  });

  // AI Analysis using Gemini 3.5 Flash
  app.post("/api/analyze-profile", async (req, res) => {
    const selectedLang = req.body?.lang || "aze";
    try {
      const { userName, badges } = req.body;

      const ai = getGeminiClient();

      if (!badges || !Array.isArray(badges)) {
        return res.status(400).json({
          status: "error",
          message: selectedLang === "eng" 
            ? "No badges found to analyze." 
            : selectedLang === "rus" 
            ? "Не найдено значков для анализа." 
            : "Analiz etmək üçün heç bir nişan daxil edilməyib."
        });
      }

      const badgeListText = badges.map((b: any) => `- ${b.title} (${b.earnedDate || (selectedLang === "eng" ? "Unknown Date" : selectedLang === "rus" ? "Дата неизвестна" : "Qazanılma tarixi bilinmir")})`).join("\n");

      let prompt = "";
      if (selectedLang === "eng") {
        prompt = `You are a certified Google Cloud trainer and professional learning advisor. The user "${userName || "Guest"}" has earned the following badges on their Google Cloud Skills Boost public profile:
        
${badgeListText || "No public badges earned yet. They are starting their cloud learning journey."}

Please analyze their skills and write a brilliant evaluation containing:
1. **Current Domain Mastery**: Analyze their strengths and expert pathways on GCP (e.g. Data & Analytics, AI/Generative AI, Cloud Infrastructure, Security, DevOps) based on their earned badges.
2. **Career Growth & Next Badges**: Recommend at least 3 concrete Google Cloud skill badges or courses they should take next. Explain why these courses fit their profile and how they contribute directly to their professional cloud career and expertise.
3. **Inspirational Message**: End with a powerful, motivating sentence to push them further on their cloud journey.

Please write the entire response strictly in English, using neat Markdown formatting, and make it highly engaging and professional. Use clean subheadings and structured bullet points. Keep it clear, concise, and do not include any external system comments.`;
      } else if (selectedLang === "rus") {
        prompt = `Ты являешься сертифицированным экспертом Google Cloud и профессиональным карьерным консультантом. Пользователь "${userName || "Гость"}" получил следующие значки в своем публичном профиле Google Cloud Skills Boost:
        
${badgeListText || "До сих пор публичные значки не обнаружены. Пользователь только начинает свое облачное обучение."}

Пожалуйста, проанализируйте их навыки и составьте высококачественный отчет, содержащий:
1. **Оценка текущих областей знаний**: Проанализируйте сильные технические направления на платформе GCP (например, DevOps, Аналитика данных, ИИ/Generative AI, Облачная инфраструктура, Безопасность) на основе полученных значков.
2. **Карьерный рост и рекомендации новых значков**: Рекомендуйте как минимум 3 конкретных значка навыков (Skill Badges) или облачных курса. Подробно объясните, почему эти темы соответствуют их профилю и как они помогут в их профессиональном облачном росте.
3. **Мотивационное послание**: Завершите ответ воодушевляющим и энергичным посланием, стимулирующим дальнейшее развитие в Google Cloud.

Пожалуйста, напишите весь ответ строго на русском языке в чистом и структурированном формате Markdown с красивыми заголовками и понятными списками. Не добавляйте лишних служебных текстов.`;
      } else {
        // Default to Azerbaijani (AZE)
        prompt = `Sən Google Cloud və öyrənmə məsləhətçisən. İstifadəçi "${userName || "Qonaq"}" öz rəsmi Google Cloud Skills Boost profilində aşağıdakı nişanları (badge) qazanıb:
        
${badgeListText || "Heç bir qazanılmış rəsmi nişan aşkar edilməyib. Onlar hələ karyeraya yeni başlayırlar."}

Xahiş edirəm aşağıdakı tapşırıqları yüksək keyfiyyətlə və səmimi Azərbaycan dilində cavablandır:
1. **Mövcud Bilik Qiymətləndirilməsi**: İstifadəçinin indiyə qədər qazandığı nişanlara baxaraq, onun Google Cloud platformasında malik olduğu güclü texniki istiqamətləri (məsələn, DevOps, Verilənlər Analitikası, Süni İntellekt/Generative AI, Bulud İnfrastrukturu və s.) dərindən analiz et.
2. **Karyera və Növbəti Nişanlar üçün Tövsiyələr**: Onlar üçün ən azı 3 konkret və rəsmi Google Cloud nişanı (Skill Badge və ya Kurs) tövsiyə et. Əlaqəli mövzuların adlarını ("Generative AI", "Security", "Kubernetes" və s.) və bu tövsiyələrin onların bulud mühəndisliyi karyerası və peşəkar inkişafı üçün necə kömək edəcəyini ətraflı izah et.
3. **Motivasiya Mesajı**: Axırda onları bulud səyahətini davam etdirməyə təşviq edən gözəl, ruhlandırıcı və enerjili bir motivasiya cümləsi qeyd et.

Xahiş edirəm cavabı yalnız təmiz və mükəmməl Markdown formatında, tamamilə Azərbaycan dilində, heç bir ingilis dilində kənar mətni və ya daxili proqramlaşdırma şərhi olmadan yaz. Səliqəli başlıqlar və bullet point-lərdən istifadə et.`;
      }

      const response = await generateContentWithRetryAndFallback(ai, prompt);

      const responseText = response.text || (selectedLang === "eng" ? "Sorry, AI analysis could not be completed." : selectedLang === "rus" ? "К сожалению, анализ ИИ не был завершен." : "Təəssüf ki, süni intellekt analizi tamamlaya bilmədi.");

      res.json({
        status: "success",
        analysis: responseText
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      let errMsg = "";
      const errorStr = (error.message || "").toLowerCase() + " " + JSON.stringify(error).toLowerCase();
      
      if (errorStr.includes("503") || errorStr.includes("unavailable") || errorStr.includes("high demand") || errorStr.includes("temporary") || errorStr.includes("overloaded")) {
        errMsg = selectedLang === "eng"
          ? "The Gemini AI model is currently experiencing high demand (Error 503). This is a temporary Google server limit; please click 'Analyze Profile with Gemini AI' again in a few seconds."
          : selectedLang === "rus"
          ? "Модель Gemini AI временно перегружена (Ошибка 503). Это временное ограничение серверов Google; пожалуйста, повторите попытку через несколько секунд."
          : "Gemini AI modeli hazırda yüksək yüklənmə ilə üzləşir (Xəta 503). Bu, Google-un müvəqqəti server limitidir; zəhmət olmasa bir neçə saniyə gözləyib yenidən cəhd edin.";
      } else if (errorStr.includes("key") || errorStr.includes("api_key") || errorStr.includes("unauthorized") || errorStr.includes("not found")) {
        errMsg = selectedLang === "eng"
          ? "Gemini API Key is invalid or not found. Please set your GEMINI_API_KEY under Settings > Secrets."
          : selectedLang === "rus"
          ? "Ключ Gemini API недействителен или отсутствует. Пожалуйста, добавьте GEMINI_API_KEY в Settings > Secrets."
          : "Gemini API Açarı yanlışdır və ya tapılmadı. Zəhmət olmasa Settings > Secrets panelindən GEMINI_API_KEY açarını təyin edin.";
      } else {
        errMsg = error.message || (selectedLang === "eng" 
          ? "Gemini AI evaluation failed. Please make sure your GEMINI_API_KEY is correctly set."
          : selectedLang === "rus"
          ? "Ошибка оценки Gemini AI. Пожалуйста, убедитесь, что ваш GEMINI_API_KEY задан правильно."
          : "Gemini AI qiymətləndirilməsi alınmadı. Zəhmət olmasa GEMINI_API_KEY açağının düzgün qurulduğundan əmin olun.");
      }

      res.status(500).json({
        status: "error",
        message: errMsg
      });
    }
  });

  // Serve static files in development & production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
