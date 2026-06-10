import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";


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
