import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date("2025-11-15");
  const trimmed = dateStr.trim();

  const format1 = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );
  if (format1) {
    const [, day, month, year, hour, min, ampm] = format1;
    let h = parseInt(hour);
    if (ampm.toUpperCase() === "PM" && h < 12) h += 12;
    if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), h, parseInt(min));
  }

  const format2 = trimmed.match(
    /^(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
  );
  if (format2) {
    const [, month, day, year, hour, min, ampm] = format2;
    let h = parseInt(hour);
    if (ampm.toUpperCase() === "PM" && h < 12) h += 12;
    if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), h, parseInt(min));
  }

  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) return d;
  return new Date("2025-11-15");
}

// All article-like objects collected from the static data file
const allArticleData = [
  // featuredArticle
  { title: "Global Leaders Commit to Ambitious Climate Goals at Geneva Summit.", excerpt: "70 nations gathered this weekend in Geneva to finalize agreement at reducing global carbon emissions", content: "World leaders gathered in Geneva to discuss urgent actions for global warming, pledging new commitments to renewable energy and emission reduction by 2030.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbc29_Rectangle%208%20(2).png", category: "Environment", author: null as string | null, date: "2025-11-15", isFeatured: true },
  // worldNews
  { title: "Stock Markets Surge as Investors Regain Confidence After Inflation Cooldown", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbc4b_Rectangle%209%20(4).png", author: "James Patel", date: "15/11/2025 11:34 AM", category: "Economy" },
  { title: "AI Revolution Accelerates as Tech Giants Unveil Next-Gen Intelligent Assistants", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbc7b_Rectangle%209%20(5).png", author: "David Lee", date: "15/11/2025 11:37 AM", category: "Technology" },
  // topStories
  { title: "Chatbots Redefine Online Learning as Students Embrace Virtual Tutors", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbc99_Rectangle%209%20(6).png", category: "Technology", date: "November 24, 2025", author: null as string | null },
  { title: "Global Markets React Positively to Trade Agreement Between Asia and Europe", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbcae_Rectangle%209%20(7).png", category: "Business", date: "November 24, 2025", author: null as string | null },
  { title: "Breakthrough in Renewable Energy Storage Could Transform Global Power Supply", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd1f_Rectangle%209%20(8).png", category: "Environment", date: "November 24, 2025", author: null as string | null },
  { title: "Major Cities Adopt AI Traffic Systems to Combat Congestion and Pollution", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd04_Rectangle%209%20(9).png", category: "Technology", date: "November 24, 2025", author: null as string | null },
  { title: "Streaming Platforms Compete for Viewers as Subscriptions Hit Record Highs", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbcc8_Rectangle%209%20(11).png", category: "Entertainment", date: "November 24, 2025", author: null as string | null },
  // economyCards
  { title: "Central Banks Signal Policy Shift Amid Inflation Cooldown", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbc99_Rectangle%209%20(6).png", category: "Economy", date: "November 25, 2025", author: null as string | null },
  { title: "Rising Energy Costs Threaten Small Business Recovery", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbcae_Rectangle%209%20(7).png", category: "Business", date: "November 25, 2025", author: null as string | null },
  // economyListItem
  { title: "Streaming Platforms Compete for Viewers as Subscriptions Hit Record Highs - Economy", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbcc8_Rectangle%209%20(11).png", category: "Entertainment", date: "November 25, 2025", author: null as string | null },
  // scienceCards
  { title: "Scientists develop a next-gen vaccine that could target multiple.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd20_Rectangle%209%20(16).png", category: "Science & Health", date: "November 24, 2025", author: null as string | null },
  { title: "Researchers have corrected genetic mutations in human cells.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd22_Rectangle%209%20(18).png", category: "Science & Health", date: "November 24, 2025", author: null as string | null },
  { title: "Recent satellite data shows the Arctic ice melting faster than expected.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd21_Rectangle%209%20(17).png", category: "Environment", date: "November 24, 2025", author: null as string | null },
  { title: "Demand for mental health support tools continues to rise as people seek.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd23_Rectangle%209%20(19).png", category: "Science & Health", date: "November 24, 2025", author: null as string | null },
  // lifestyleCards
  { title: "More people are embracing minimalist lifestyles, focusing on possessions.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd29_Rectangle%209%20(21).png", category: "Lifestyle", date: "November 25, 2025", author: null as string | null },
  { title: "Plant-based products are taking over restaurant menus and grocery.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd2c_Rectangle%209%20(24).png", category: "Food", date: "November 25, 2025", author: null as string | null },
  { title: "Wellness retreats are becoming the go-to vacation choice, blending.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd2b_Rectangle%209%20(23).png", category: "Travel", date: "November 25, 2025", author: null as string | null },
  { title: "Young professionals are moving away from crowded cities to embrace.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd2a_Rectangle%209%20(22).png", category: "Remotework", date: "November 25, 2025", author: null as string | null },
  // sportsCards
  { title: "After two decades of dominance, the legendary player bids farewell in an emotional press.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbc99_Rectangle%209%20(6).png", category: "Sports", date: "16/11/2025 8:07 AM", author: null as string | null },
  { title: "The gaming industry continues to boom as esports leagues attract massive corporate sponsors.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbcae_Rectangle%209%20(7).png", category: "Sports", date: "16/11/2025 8:08 AM", author: null as string | null },
  { title: "Major streaming giants are in fierce competition to secure exclusive deals with top creators.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd1f_Rectangle%209%20(8).png", category: "Sports", date: "16/11/2025 8:09 AM", author: null as string | null },
  // otherNews
  { title: "Understanding why people crave constant updates and how it affects mental health.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd32_Rectangle%2012%20(5).png", author: "James Patel", date: "11.16.2025 8:23 AM", category: "Other" },
  { title: "A deep dive into the evolution of digital journalism and algorithm-driven content feeds.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd2f_Rectangle%2012%20(4).png", author: "Emma Carter", date: "11.16.2025 8:23 AM", category: "Other" },
  { title: "An opinion piece on how authentic reporting and human ethics remain irreplaceable even.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd2e_Rectangle%2012%20(3).png", author: "Sofia Alvarez", date: "11.16.2025 8:23 AM", category: "Other" },
  // economyArticles (page-specific)
  { title: "AI Momentum Grows as Tech Heavyweights Present Revolutionary Smart Assistants.", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691abccfd010006beeaf8893_Rectangle%209%20(38).png", author: "David Lee", date: "15/11/2025 12:07 PM", category: "Economy" },
  { title: "Innovation Booms in AI as Top Tech Brands Debut Their Latest Intelligent Systems.", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691abc90db94b0f891ce1c22_Rectangle%209%20(37).png", author: "Emma Richards", date: "15/11/2025 12:06 PM", category: "Economy" },
  { title: "AI Evolution Speeds Up as Industry Giants Showcase Future-Ready Assistants.", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691abc0633baf10696281010_Rectangle%209%20(36).png", author: "Ethan Clarke", date: "15/11/2025 12:06 PM", category: "Economy" },
  { title: "Tech Titans Drive AI Forward With Cutting-Edge Intelligent Assistant Releases.", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691abb99a6be85ec56385ad9_Rectangle%209%20(35).png", author: "Hannah Scott", date: "15/11/2025 12:04 PM", category: "Economy" },
  { title: "Global Markets React Positively to Trade Agreement Between Asia and Europe - Economy", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691abb483128e3f19ad12c0d_Rectangle%209%20(34).png", author: "Isabella Ruiz", date: "15/11/2025 12:04 PM", category: "Economy" },
  { title: "Chatbots Redefine Online Learning as Students Embrace Virtual Tutors - Economy", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691abb0bd3ce8667268b847f_Rectangle%209%20(33).png", author: "James Patel", date: "15/11/2025 11:53 AM", category: "Economy" },
  { title: "Stock Markets Surge as Investors Regain Confidence After Inflation Cooldown - Economy", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691aba9152125c36243d8663_Rectangle%209%20(32).png", author: "James Patel", date: "15/11/2025 11:53 AM", category: "Economy" },
  { title: "AI Revolution Accelerates as Tech Giants Unveil Next-Gen Intelligent Assistants - Economy", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691aba482b7f36a6c9de9828_Rectangle%209%20(31).png", author: "James Patel", date: "15/11/2025 11:53 AM", category: "Economy" },
  { title: "Central Banks Signal Policy Shift Amid Inflation Cooldown - Economy", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691ab814704070d4c3ba0887_Rectangle%209%20(27).png", author: "James Patel", date: "15/11/2025 11:53 AM", category: "Economy" },
  { title: "Rising Energy Costs Threaten Small Business Recovery - Economy", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691ab7e4fa91f686c465a252_Rectangle%209%20(26).png", author: "James Patel", date: "15/11/2025 11:53 AM", category: "Economy" },
  { title: "Streaming Platforms Compete for Viewers as Subscriptions Hit Record Highs - Economy", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691a8adcb1b8cf6638372db5_Rectangle%209%20(25).png", author: "James Patel", date: "15/11/2025 11:53 AM", category: "Economy" },
  // globalArticles
  { title: "Emerging Asian economies are outperforming forecasts, driving global GDP growth upward.", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd47_Rectangle%209%20(52).png", author: "James Patel", date: "15/11/2025 11:53 AM", category: "Global Market" },
  { title: "Markets responded positively to the European Central Bank's signal.", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691aba9152125c36243d8663_Rectangle%209%20(32).png", author: "James Patel", date: "15/11/2025 11:53 AM", category: "Global Market" },
  { title: "The dollar's slight decline has boosted emerging market currencies.", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/69227161fa3f53a570b36d55_Rectangle%208%20(3).png", author: "James Patel", date: "15/11/2025 11:53 AM", category: "Global Market" },
  { title: "Crude oil prices climbed to new yearly highs amid renewed geopolitical instability.", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691ab890d8fd5f34a2013965_Rectangle%209%20(28).png", author: "James Patel", date: "15/11/2025 11:53 AM", category: "Global Market" },
  // lifestyleArticles (page-specific)
  { title: "Plant-based products are taking over restaurant menus and grocery - Lifestyle", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd2c_Rectangle%209%20(24).png", author: "Ryan Mitchel", date: "15/11/2025 12:07 PM", category: "Lifestyle" },
  { title: "Wellness retreats are becoming the go-to vacation choice, blending - Lifestyle", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd2b_Rectangle%209%20(23).png", author: "Ryan Mitchel", date: "15/11/2025 12:07 PM", category: "Lifestyle" },
  { title: "Young professionals are moving away from crowded cities to embrace - Lifestyle", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd2a_Rectangle%209%20(22).png", author: "Ryan Mitchel", date: "15/11/2025 12:07 PM", category: "Lifestyle" },
  { title: "More people are embracing minimalist lifestyles, focusing on possessions - Lifestyle", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd29_Rectangle%209%20(21).png", author: "James Patel", date: "15/11/2025 12:06 PM", category: "Lifestyle" },
  // scienceArticles (page-specific)
  { title: "Demand for mental health support tools continues to rise as people seek. - Science", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd23_Rectangle%209%20(19).png", author: "David Lee", date: "15/11/2025 12:07 PM", category: "Science & Health" },
  { title: "Researchers have corrected genetic mutations in human cells. - Science", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd22_Rectangle%209%20(18).png", author: "Emma Richards", date: "15/11/2025 12:06 PM", category: "Science & Health" },
  { title: "Recent satellite data shows the Arctic ice melting faster than expected. - Science", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd21_Rectangle%209%20(17).png", author: "Ethan Clarke", date: "15/11/2025 12:06 PM", category: "Science & Health" },
  { title: "Scientists develop a next-gen vaccine that could target multiple. - Science", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd20_Rectangle%209%20(16).png", author: "Hannah Scott", date: "15/11/2025 12:04 PM", category: "Science & Health" },
  // technologyArticles
  { title: "Artificial intelligence tools are transforming how teams collaborate, automating tasks workplace efficiency.", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691ab890d8fd5f34a2013965_Rectangle%209%20(28).png", author: "Ryan Mitchel", date: "15/11/2025 12:07 PM", category: "Technology" },
  { title: "Stock Markets Surge as Investors Regain Confidence After Inflation Cooldown - Tech", imageUrl: "https://cdn.prod.website-files.com/6913fecefd473b6135c61a38/691ab7e4fa91f686c465a252_Rectangle%209%20(26).png", author: "James Patel", date: "15/11/2025 12:06 PM", category: "Technology" },
  // topStoriesArticles (page-specific)
  { title: "Streaming Platforms Compete for Viewers as Subscriptions Hit Record Highs - Top", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbcc8_Rectangle%209%20(11).png", author: "David Lee", date: "15/11/2025 12:07 PM", category: "Entertainment" },
  { title: "Breakthrough in Renewable Energy Storage Could Transform Global Power Supply - Top", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbcf3_Rectangle%209%20(10).png", author: "Emma Richards", date: "15/11/2025 12:06 PM", category: "Environment" },
  { title: "Major Cities Adopt AI Traffic Systems to Combat Congestion and Pollution - Top", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbd04_Rectangle%209%20(9).png", author: "Ethan Clarke", date: "15/11/2025 12:06 PM", category: "Technology" },
  { title: "Global Markets React Positively to Trade Agreement Between Asia and Europe - Top", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbcae_Rectangle%209%20(7).png", author: "Isabella Ruiz", date: "15/11/2025 12:04 PM", category: "Business" },
  { title: "Chatbots Redefine Online Learning as Students Embrace Virtual Tutors - Top", imageUrl: "https://cdn.prod.website-files.com/692401e8be8549a781fdbbad/692401e8be8549a781fdbc99_Rectangle%209%20(6).png", author: "James Patel", date: "15/11/2025 11:53 AM", category: "Technology" },
];

// Authors from the static data (authorsData + creators + other references)
const authorData = [
  { name: "Ethan Clarke", email: "ethan.clarke@presspoint.com", role: "Digital Media Strategist", bio: "Digital Media Strategist covering technology and innovation." },
  { name: "Emma Richards", email: "emma.richards@presspoint.com", role: "Senior Political Correspondent", bio: "Senior Political Correspondent with deep expertise in global affairs." },
  { name: "James Patel", email: "james.patel@presspoint.com", role: "Business & Economy Analyst", bio: "Business & Economy Analyst specializing in markets and trade." },
  { name: "David Lee", email: "david.lee@presspoint.com", role: "Market Analyst", bio: "Market Analyst covering global financial trends." },
  { name: "Emma Carter", email: "emma.carter@presspoint.com", role: "Global Affairs Journalist", bio: "Global Affairs Journalist at Global Times." },
  { name: "Ryan Mitchel", email: "ryan.mitchel@presspoint.com", role: "Lifestyle Writer", bio: "Lifestyle Writer covering wellness, travel, and culture." },
  { name: "Sofia Alvarez", email: "sofia.alvarez@presspoint.com", role: "Feature Writer", bio: "Feature Writer at Urban Daily." },
  { name: "Hannah Scott", email: "hannah.scott@presspoint.com", role: "Social Media & Community Manager", bio: "Social Media & Community Manager." },
  { name: "Isabella Ruiz", email: "isabella.ruiz@presspoint.com", role: "Correspondent", bio: "International Correspondent covering global trade." },
  { name: "PressPoint Editorial", email: "editorial@presspoint.com", role: "Editorial Team", bio: "The PressPoint editorial team." },
];

// Categories derived from all static data
const categoryNames = [
  "Environment",
  "Technology",
  "Economy",
  "Business",
  "Entertainment",
  "Science & Health",
  "Lifestyle",
  "Food",
  "Travel",
  "Remotework",
  "Sports",
  "Sports",
  "Tennis",
  "Esports",
  "Streaming",
  "Global Market",
  "Other",
];

async function main() {
  console.log("Seeding database...");

  // 1. Seed Categories
  console.log("Seeding categories...");
  const categoryMap: Record<string, number> = {};
  for (const name of categoryNames) {
    const slug = slugify(name);
    const cat = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug },
    });
    categoryMap[name] = cat.id;
  }
  console.log(`  Created ${Object.keys(categoryMap).length} categories`);

  // 2. Seed Authors
  console.log("Seeding authors...");
  const authorMap: Record<string, number> = {};
  const defaultPassword = await bcrypt.hash("presspoint123", 10);
  for (const a of authorData) {
    const author = await prisma.author.upsert({
      where: { email: a.email },
      update: {},
      create: {
        email: a.email,
        password: defaultPassword,
        name: a.name,
        role: "author",
        bio: a.bio,
      },
    });
    authorMap[a.name] = author.id;
  }
  console.log(`  Created ${Object.keys(authorMap).length} authors`);

  // 3. Seed Articles
  console.log("Seeding articles...");
  let created = 0;
  let skipped = 0;
  for (const raw of allArticleData) {
    const slug = slugify(raw.title);
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      skipped++;
      continue;
    }

    const authorId = raw.author ? authorMap[raw.author] ?? null : null;
    const categoryId = raw.category ? categoryMap[raw.category] ?? null : null;

    await prisma.article.create({
      data: {
        title: raw.title,
        slug,
        content: (raw as any).content || raw.title,
        excerpt: (raw as any).excerpt || raw.title.slice(0, 150),
        imageUrl: raw.imageUrl,
        authorId,
        categoryId,
        status: "published",
        isFeatured: (raw as any).isFeatured || false,
        date: parseDate(raw.date || ""),
        views: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 200),
      },
    });
    created++;
  }
  console.log(`  Created ${created} articles, skipped ${skipped} duplicates`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
