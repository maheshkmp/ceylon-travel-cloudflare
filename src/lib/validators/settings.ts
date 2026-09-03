import { z } from "zod";

export const siteSettingsSchema = z.object({
  branding: z.object({
    logo: z.string().optional(),
    favicon: z.string().optional(),
    footerLogo: z.string().optional(),
    ogImage: z.string().optional(),
    primaryColor: z.string().default("#00A680"),
    secondaryColor: z.string().default("#FF6B35"),
  }).default({}),

  general: z.object({
    siteName: z.string().min(1, "Site name is required"),
    siteTagline: z.string().optional(),
    siteDescription: z.string().optional(),
    companyName: z.string().optional(),
    defaultLanguage: z.string().default("en"),
    timezone: z.string().default("Asia/Colombo"),
    dateFormat: z.string().default("MMM dd, yyyy"),
    currency: z.string().default("USD"),
    country: z.string().default("Sri Lanka"),
  }).default({ siteName: "Ceylon Travels" }),

  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional(),
    canonicalUrl: z.string().optional(),
    robotsTxt: z.string().optional(),
    twitterCard: z.string().optional(),
    jsonLd: z.string().optional(),
  }).default({}),

  contact: z.object({
    supportEmail: z.string().email().optional().or(z.literal("")),
    businessEmail: z.string().email().optional().or(z.literal("")),
    phoneNumber: z.string().optional(),
    whatsapp: z.string().optional(),
    officeAddress: z.string().optional(),
    mapEmbed: z.string().optional(),
    businessHours: z.string().optional(),
  }).default({}),

  social: z.object({
    facebook: z.string().url("Invalid Facebook URL format (must start with http:// or https://)").or(z.literal("")).optional(),
    instagram: z.string().url("Invalid Instagram URL format (must start with http:// or https://)").or(z.literal("")).optional(),
    linkedin: z.string().url("Invalid LinkedIn URL format (must start with http:// or https://)").or(z.literal("")).optional(),
    tiktok: z.string().url("Invalid TikTok URL format (must start with http:// or https://)").or(z.literal("")).optional(),
    youtube: z.string().url("Invalid YouTube URL format (must start with http:// or https://)").or(z.literal("")).optional(),
    twitter: z.string().url("Invalid Twitter/X URL format (must start with http:// or https://)").or(z.literal("")).optional(),
    tripadvisor: z.string().url("Invalid TripAdvisor URL format (must start with http:// or https://)").or(z.literal("")).optional(),
    whatsapp: z.string().url("Invalid WhatsApp link format (must start with http:// or https://)").or(z.literal("")).optional(),
  }).default({}),

  legal: z.object({
    terms: z.string().optional(),
    privacy: z.string().optional(),
    cookie: z.string().optional(),
    refund: z.string().optional(),
    gdpr: z.string().optional(),
    ageRestriction: z.string().optional(),
    license: z.string().optional(),
  }).default({}),

  faq: z.object({
    items: z.string().optional(),
  }).default({}),

  integrations: z.object({
    googleAnalyticsId: z.string().optional(),
    googleTagManager: z.string().optional(),
    facebookPixel: z.string().optional(),
    bingVerification: z.string().optional(),
  }).default({}),

  email: z.object({
    smtpHost: z.string().optional(),
    smtpPort: z.string().optional(),
    smtpUsername: z.string().optional(),
    smtpPassword: z.string().optional(),
    senderName: z.string().optional(),
    senderEmail: z.string().email().optional().or(z.literal("")),
    replyToEmail: z.string().email().optional().or(z.literal("")),
  }).default({}),

  layout: z.object({
    footerText: z.string().optional(),
    announcementBanner: z.string().optional(),
    heroTitle: z.string().optional(),
    heroSubtitle: z.string().optional(),
    heroButtonText: z.string().optional(),
    heroButtonLink: z.string().optional(),
    heroTheme: z.string().optional().default("grain"),
    heroShowIcons: z.boolean().default(true),
    heroVideoUrl: z.string().optional(),
  }).default({}),

  advanced: z.object({
    enableAnalytics: z.boolean().default(true),
    trackUserActivity: z.boolean().default(false),
    sessionRecording: z.boolean().default(false),
    heatmaps: z.boolean().default(false),
    conversionEvents: z.boolean().default(false),
  }).default({}),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
