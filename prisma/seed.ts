// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { createClient } from '@supabase/supabase-js'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ─── Helpers ─────────────────────────────────────────────────
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

// ─── Test Accounts ────────────────────────────────────────────
const testAccounts = [
  { email: 'customer@test.com', password: 'Test@1234', fullName: 'Test Customer', role: 'user' },
  { email: 'admin@test.com',    password: 'Test@1234', fullName: 'Test Admin',    role: 'admin' },
  { email: 'seller@test.com',   password: 'Test@1234', fullName: 'Test Seller',   role: 'seller' },
]

// ─── Seed Data ────────────────────────────────────────────────
const datasets = [
  {
    title: 'Global E-Commerce Transactions 2024',
    description:
      'Over 2 million anonymised e-commerce transactions across 40 countries. Includes product category, purchase amount, device type, and return status. Ideal for churn prediction and customer segmentation models.',
    industry: 'E-Commerce',
    category: 'Transactional',
    language: 'English',
    tags: ['transactions', 'ecommerce', 'customer-behavior', 'churn'],
    price: 149.99,
    currency: 'USD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    fileFormat: '.csv',
    fileSizeBytes: BigInt(524288000), // 500 MB
    rowCount: 2100000,
    // Only this dataset is wired to a real Dodo Product for now — set
    // DODO_TEST_PRODUCT_ID in .env to the pdt_... id once it's created in the
    // Dodo dashboard, then re-run `npm run db:seed`.
    dodoProductId: process.env.DODO_TEST_PRODUCT_ID ?? null,
  },
  {
    title: 'Clinical Trial Records — Oncology Phase II',
    description:
      'De-identified clinical records from 14 Phase II oncology trials across three continents. Includes patient demographics, treatment arms, dosage logs, adverse events, and survival outcomes. HIPAA-compliant export.',
    industry: 'Healthcare',
    category: 'Clinical',
    language: 'English',
    tags: ['clinical-trials', 'oncology', 'healthcare', 'survival-analysis'],
    price: 499.00,
    currency: 'USD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    fileFormat: '.parquet',
    fileSizeBytes: BigInt(209715200), // 200 MB
    rowCount: 85000,
  },
  {
    title: 'Indian Stock Market — 10-Year OHLCV Dataset',
    description:
      'Daily OHLCV (Open, High, Low, Close, Volume) data for 500+ NSE-listed equities from 2014 to 2024. Includes adjusted prices, corporate actions, and sector classifications. Perfect for backtesting trading strategies.',
    industry: 'Finance',
    category: 'Time-Series',
    language: 'English',
    tags: ['stocks', 'finance', 'time-series', 'NSE', 'backtesting'],
    price: 299.00,
    currency: 'USD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    fileFormat: '.csv',
    fileSizeBytes: BigInt(314572800), // 300 MB
    rowCount: 1250000,
  },
  {
    title: 'Twitter Sentiment Corpus — Tech Industry 2023',
    description:
      '4.8 million tweets from verified and unverified accounts discussing 150 major tech companies. Pre-labelled with sentiment (positive / neutral / negative) and emotion scores. Includes retweet counts and engagement metrics.',
    industry: 'NLP',
    category: 'Social Media',
    language: 'English',
    tags: ['nlp', 'sentiment', 'twitter', 'social-media', 'text-classification'],
    price: 89.99,
    currency: 'USD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&q=80',
    fileFormat: '.json',
    fileSizeBytes: BigInt(1073741824), // 1 GB
    rowCount: 4800000,
  },
  {
    title: 'Urban Traffic Camera — Annotated Object Detection',
    description:
      '120,000 frames extracted from traffic cameras across 8 cities, annotated with YOLO-format bounding boxes for pedestrians, cars, motorcycles, buses, and traffic signs. Day and night splits included.',
    industry: 'Computer Vision',
    category: 'Image Annotation',
    language: 'English',
    tags: ['cv', 'object-detection', 'yolo', 'traffic', 'annotation'],
    price: 349.00,
    currency: 'USD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    fileFormat: '.zip',
    fileSizeBytes: BigInt(5368709120), // 5 GB
    rowCount: 120000,
  },
  {
    title: 'Global Weather Stations — 30-Year Climate Records',
    description:
      'Daily observations from 6,200 weather stations worldwide covering 1994–2024. Includes temperature, humidity, precipitation, wind speed, UV index, and air quality index (AQI). Data sourced from NOAA and local meteorological agencies.',
    industry: 'Climate',
    category: 'Environmental',
    language: 'English',
    tags: ['climate', 'weather', 'geospatial', 'environment', 'time-series'],
    price: 199.00,
    currency: 'USD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504608524841-42584120d693?w=800&q=80',
    fileFormat: '.parquet',
    fileSizeBytes: BigInt(2147483648), // 2 GB
    rowCount: 67000000,
  },
  {
    title: 'Multi-Language News Articles — 12 Languages',
    description:
      'Curated corpus of 900,000 news articles published between 2020–2024 across 12 languages including Hindi, Arabic, French, Mandarin, and Spanish. Categorised by topic (Politics, Business, Sports, Tech, Health). Ideal for multilingual NLP tasks.',
    industry: 'NLP',
    category: 'Text Corpus',
    language: 'Multilingual',
    tags: ['nlp', 'multilingual', 'news', 'text-corpus', 'classification'],
    price: 129.00,
    currency: 'USD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    fileFormat: '.json',
    fileSizeBytes: BigInt(786432000), // 750 MB
    rowCount: 900000,
  },
  {
    title: 'Retail Store Footfall & Heatmap Data',
    description:
      'Anonymised in-store footfall logs from 80 retail outlets across India. Includes zone-level heatmaps, dwell time, peak-hour patterns, and conversion funnel data. 18-month coverage with pre and post festive season splits.',
    industry: 'E-Commerce',
    category: 'Retail Analytics',
    language: 'English',
    tags: ['retail', 'footfall', 'heatmap', 'in-store', 'analytics'],
    price: 219.00,
    currency: 'USD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    fileFormat: '.csv',
    fileSizeBytes: BigInt(157286400), // 150 MB
    rowCount: 430000,
  },
  {
    title: 'Satellite Land-Use Classification — South Asia',
    description:
      'High-resolution satellite imagery tiles (10m/px) covering South Asia, labelled for land-use classification: urban, agricultural, forest, water bodies, industrial. Sourced from Sentinel-2 with seasonal variation sets.',
    industry: 'Geospatial',
    category: 'Satellite Imagery',
    language: 'English',
    tags: ['geospatial', 'satellite', 'land-use', 'remote-sensing', 'segmentation'],
    price: 599.00,
    currency: 'USD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=800&q=80',
    fileFormat: '.tiff',
    fileSizeBytes: BigInt(10737418240), // 10 GB
    rowCount: 50000,
  },
  {
    title: 'Customer Support Chat Logs — SaaS Industry',
    description:
      'Anonymised chat logs from customer support interactions at 12 SaaS companies. 320,000 conversations labelled with resolution status, customer satisfaction score (CSAT), issue category, and agent response time. Great for training support bots.',
    industry: 'NLP',
    category: 'Conversational AI',
    language: 'English',
    tags: ['chat', 'customer-support', 'nlp', 'csat', 'conversational-ai'],
    price: 179.00,
    currency: 'USD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    fileFormat: '.json',
    fileSizeBytes: BigInt(419430400), // 400 MB
    rowCount: 320000,
  },
]

// ─── Seeders ─────────────────────────────────────────────────
async function seedUsers() {
  console.log('🌱  Seeding test accounts...')

  for (const account of testAccounts) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
    })

    let userId = data?.user?.id

    if (error) {
      if (error.message.includes('already been registered')) {
        console.warn(`  ⚠  ${account.email} already exists in auth — fetching existing id`)
        const { data: list } = await supabase.auth.admin.listUsers()
        userId = list.users.find(u => u.email === account.email)?.id
      } else {
        console.error(`  ✖  Auth error for ${account.email}: ${error.message}`)
        throw new Error(`Auth error for ${account.email}: ${error.message}`)
      }
    }

    if (!userId) {
      throw new Error(`Could not resolve userId for ${account.email}`)
    }

    // small delay for the DB trigger to fire and create the public.users row
    await new Promise(r => setTimeout(r, 500))

    await prisma.user.upsert({
      where: { id: userId },
      update: { fullName: account.fullName, role: account.role },
      create: { id: userId, email: account.email, fullName: account.fullName, role: account.role },
    })

    console.log(`  ✓  ${account.email} (${account.role})`)
  }

  console.log(`  ✓  ${testAccounts.length} test accounts seeded\n`)
}

async function seedDatasets() {
  console.log('🌱  Seeding datasets...')

  await prisma.dataset.deleteMany()
  console.log('  ✓  Cleared existing datasets')

  for (const data of datasets) {
    const dataset = await prisma.dataset.create({
      data: { ...data, slug: slugify(data.title) },
    })
    console.log(`  ✓  ${dataset.title} (${dataset.slug})`)
  }

  console.log(`  ✓  ${datasets.length} datasets seeded\n`)
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀  Starting seed...\n')
  await seedUsers()
  await seedDatasets()
  console.log('✅  Seed complete.')
}

main()
  .catch(e => {
    console.error('❌  Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })