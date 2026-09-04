import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CommercePilot AI database seeding...");

  // 1. Clean existing records if any
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.aIDecision.deleteMany();
  await prisma.aIAgent.deleteMany();
  await prisma.customerEvent.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.merchant.deleteMany();

  // 2. Create Merchant
  const merchant = await prisma.merchant.create({
    data: {
      name: "TechNest India Ltd.",
      email: "demo@commercepilot.ai",
      storeName: "TechNest Store",
      currency: "INR",
      settings: JSON.stringify({
        defaultAutonomy: "AUTO_EXECUTE",
        maxAutoDiscountPercent: 12,
        highValueCartThreshold: 75000,
        enableRazorpaySimulation: true,
      }),
    },
  });

  // 3. Create Admin / Demo User
  await prisma.user.create({
    data: {
      email: "demo@commercepilot.ai",
      name: "Vikram Malhotra",
      passwordHash: "demo_secure_hash_2026",
      role: "MERCHANT_ADMIN",
      merchantId: merchant.id,
    },
  });

  // 4. Create Categories
  const categoriesData = [
    { name: "Laptops", slug: "laptops", description: "Pro notebooks, ultrabooks, and coding machines", icon: "Laptop" },
    { name: "Phones", slug: "phones", description: "Flagship and mid-range 5G smartphones", icon: "Smartphone" },
    { name: "Headphones", slug: "headphones", description: "Noise-cancelling wireless audio gear", icon: "Headphones" },
    { name: "Accessories", slug: "accessories", description: "USB-C hubs, GaN chargers, ergonomic mice & sleeves", icon: "Usb" },
    { name: "Smart Home", slug: "smart-home", description: "Connected IoT devices, smart speakers & lighting", icon: "Home" },
    { name: "Fitness", slug: "fitness", description: "Smartwatches, GPS activity trackers & bands", icon: "Activity" },
    { name: "Audio", slug: "audio", description: "Portable Bluetooth speakers and soundbars", icon: "Volume2" },
    { name: "Tablets", slug: "tablets", description: "Creative drawing tablets and compact portables", icon: "Tablet" },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.productCategory.create({ data: cat });
    categoryMap.set(cat.name, created.id);
  }

  // 5. Seed 100+ Products
  console.log("📦 Seeding 100+ realistic e-commerce products...");

  interface RawProduct {
    name: string;
    category: string;
    price: number;
    originalPrice: number;
    discountPercent: number;
    brand: string;
    rating: number;
    reviewCount: number;
    stockCount: number;
    tags: string[];
    features: string[];
    attributes: Record<string, string>;
    image: string;
    description: string;
  }

  const rawProducts: RawProduct[] = [
    // LAPTOPS (16 items)
    {
      name: "Zenith Pro 16 Ultrabook",
      category: "Laptops",
      price: 74999,
      originalPrice: 89999,
      discountPercent: 16,
      brand: "Zenith",
      rating: 4.8,
      reviewCount: 342,
      stockCount: 14,
      tags: ["coding", "college", "battery", "lightweight", "fast", "programming"],
      features: ["Intel Core i7 13th Gen", "16GB LPDDR5 RAM", "1TB Gen4 NVMe SSD", "18-hr Battery Life", "1.38kg Magnesium Body"],
      attributes: { processor: "Intel Core i7-13700H", ram: "16GB", storage: "1TB SSD", screen: "16-inch 2.8K OLED 120Hz", weight: "1.38 kg", battery: "82Wh" },
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      description: "Crafted specifically for software engineers, data science students, and creators who demand relentless battery life, terminal responsiveness, and a vibrant color-calibrated OLED display.",
    },
    {
      name: "AeroBook Air 14 M3",
      category: "Laptops",
      price: 84900,
      originalPrice: 99900,
      discountPercent: 15,
      brand: "Aero",
      rating: 4.9,
      reviewCount: 512,
      stockCount: 8,
      tags: ["coding", "developer", "silent", "premium", "college"],
      features: ["Next-Gen 8-Core ARM Processor", "16GB Unified Memory", "512GB High-Bandwidth SSD", "Fanless Silent Design", "Liquid Retina TrueTone"],
      attributes: { processor: "Aero Silicon M3", ram: "16GB Unified", storage: "512GB", screen: "14.2-inch Retina", weight: "1.24 kg", battery: "18-20 hrs" },
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
      description: "The gold standard for mobile software development. Zero fan noise, instant wake, and unmatched energy efficiency.",
    },
    {
      name: "DevEngine 15 Ryzen 7",
      category: "Laptops",
      price: 64999,
      originalPrice: 76999,
      discountPercent: 15,
      brand: "NovaTech",
      rating: 4.7,
      reviewCount: 220,
      stockCount: 25,
      tags: ["coding", "budget", "college", "multitask", "linux"],
      features: ["AMD Ryzen 7 7840HS (8C/16T)", "16GB DDR5 5600MHz", "512GB PCIe 4.0", "Full Linux Kernel Support", "Backlit Tactile Keyboard"],
      attributes: { processor: "AMD Ryzen 7 7840HS", ram: "16GB DDR5", storage: "512GB SSD", screen: "15.6-inch FHD IPS Anti-Glare", weight: "1.65 kg", battery: "70Wh" },
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
      description: "Best-in-class performance per rupee. Handles Docker containers, local LLMs, and multi-IDE compilation effortlessly.",
    },
    {
      name: "CampusLite 14 Budget Edition",
      category: "Laptops",
      price: 39999,
      originalPrice: 47999,
      discountPercent: 16,
      brand: "NovaTech",
      rating: 4.5,
      reviewCount: 184,
      stockCount: 30,
      tags: ["student", "budget", "college", "school", "lightweight"],
      features: ["Intel Core i3 12th Gen", "8GB RAM", "512GB SSD", "1.2kg Featherweight", "Type-C Fast Charging"],
      attributes: { processor: "Intel Core i3-1215U", ram: "8GB", storage: "512GB SSD", screen: "14-inch Full HD", weight: "1.2 kg", battery: "10 hrs" },
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      description: "Essential, dependable laptop designed for college assignments, web research, spreadsheets, and media playback on a sensible budget.",
    },
    {
      name: "Titan Predator 16 Gaming & ML Rig",
      category: "Laptops",
      price: 124999,
      originalPrice: 149999,
      discountPercent: 16,
      brand: "Titan",
      rating: 4.8,
      reviewCount: 145,
      stockCount: 6,
      tags: ["gaming", "machine learning", "gpu", "coding", "workstation"],
      features: ["Intel Core i9-13900HX", "NVIDIA RTX 4070 8GB GDDR6", "32GB DDR5 RAM", "1TB NVMe Gen4", "240Hz QHD Display"],
      attributes: { processor: "Intel i9-13900HX", gpu: "RTX 4070 140W", ram: "32GB", storage: "1TB", screen: "16-inch QHD 240Hz", weight: "2.3 kg" },
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
      description: "Powerhouse workstation engineered for deep learning model training, Unreal Engine development, and 4K gaming.",
    },
    {
      name: "ThinkPro X1 Carbon",
      category: "Laptops",
      price: 112000,
      originalPrice: 128000,
      discountPercent: 12,
      brand: "Lenovo",
      rating: 4.9,
      reviewCount: 289,
      stockCount: 11,
      tags: ["business", "coding", "keyboard", "durability", "enterprise"],
      features: ["Carbon Fiber Chassis", "Iconic Ergonomic Keyboard", "Intel Core i7 vPro", "16GB RAM", "1TB SSD", "Cellular LTE/5G Ready"],
      attributes: { processor: "Intel Core i7 vPro", ram: "16GB", storage: "1TB", weight: "1.12 kg", security: "dTPM 2.0 + Fingerprint" },
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      description: "Renowned legendary keyboard feel paired with military-grade drop resistance and enterprise security protocols.",
    },
    {
      name: "SwiftGo 14 AI Powered",
      category: "Laptops",
      price: 68990,
      originalPrice: 79990,
      discountPercent: 13,
      brand: "Acer",
      rating: 4.6,
      reviewCount: 98,
      stockCount: 18,
      tags: ["ai", "coding", "travel", "thin", "oled"],
      features: ["Intel Core Ultra 5 NPU", "16GB LPDDR5X", "1TB SSD", "OLED 90Hz Display", "AI Noise Cancellation"],
      attributes: { processor: "Intel Core Ultra 5", ram: "16GB", storage: "1TB SSD", screen: "14-inch OLED", weight: "1.32 kg" },
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
      description: "Integrated Neural Processing Unit (NPU) accelerates on-device AI tasks, background blur, and code autocomplete.",
    },
    {
      name: "MacBook Pro 16 M3 Max",
      category: "Laptops",
      price: 249900,
      originalPrice: 269900,
      discountPercent: 7,
      brand: "Apple",
      rating: 5.0,
      reviewCount: 420,
      stockCount: 5,
      tags: ["flagship", "video", "pro", "coding", "premium"],
      features: ["Apple M3 Max 16-Core CPU", "40-Core GPU", "64GB Unified Memory", "2TB SSD", "Liquid Retina XDR 1600 nits"],
      attributes: { processor: "M3 Max", ram: "64GB Unified", storage: "2TB", screen: "16.2-inch XDR ProMotion", weight: "2.16 kg" },
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      description: "Unrivaled desktop-class horsepower in a portable chassis. Sustained compilation speeds and cinema-grade color fidelity.",
    },

    // HEADPHONES & EARBUDS (16 items)
    {
      name: "SoundSilence Apex Wireless ANC",
      category: "Headphones",
      price: 7499,
      originalPrice: 9999,
      discountPercent: 25,
      brand: "SoundSilence",
      rating: 4.8,
      reviewCount: 680,
      stockCount: 40,
      tags: ["anc", "travel", "calls", "wireless", "battery", "noise cancellation"],
      features: ["Hybrid 42dB Active Noise Cancellation", "Quad-Mic AI Beamforming for Calls", "65-Hour Battery Life", "Multipoint Bluetooth 5.4", "Plush Memory Foam"],
      attributes: { type: "Over-Ear", anc: "42dB Hybrid", battery: "65 hours", codec: "LDAC, AAC, SBC", weight: "245g" },
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      description: "Engineered specifically for frequent flyers, train commuters, and open-plan office calls. Shuts out engine rumble and isolates your voice with studio clarity.",
    },
    {
      name: "PureBeat Pro ANC Earbuds",
      category: "Headphones",
      price: 4999,
      originalPrice: 6999,
      discountPercent: 28,
      brand: "PureBeat",
      rating: 4.6,
      reviewCount: 450,
      stockCount: 35,
      tags: ["earbuds", "anc", "travel", "gym", "calls"],
      features: ["35dB Smart ANC", "Transparency Mode", "Wireless Qi Charging Case", "IPX5 Water Resistant", "30-Hr Total Playtime"],
      attributes: { type: "In-Ear TWS", anc: "35dB", battery: "8h earbud + 24h case", latency: "50ms Low Latency" },
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      description: "Pocket-sized acoustic mastery. Dynamic 11mm titanium drivers deliver deep bass and crisp speech isolation during phone and video calls.",
    },
    {
      name: "StudioMaster 1000XM Flagship",
      category: "Headphones",
      price: 24990,
      originalPrice: 29990,
      discountPercent: 16,
      brand: "Sony",
      rating: 4.9,
      reviewCount: 920,
      stockCount: 15,
      tags: ["flagship", "anc", "audiophile", "travel", "premium"],
      features: ["Industry-Leading Dual V1 + QN1 Processors", "Auto NC Optimizer", "Speak-to-Chat", "Hi-Res LDAC Audio", "30-Hr Fast Charge"],
      attributes: { type: "Over-Ear", anc: "Industry Best", battery: "30h with ANC", weight: "250g" },
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
      description: "The undisputed benchmark for active noise cancellation. Silences noisy cabin environments and reproduces pristine high-resolution acoustics.",
    },
    {
      name: "TuneFlex Budget Wireless",
      category: "Headphones",
      price: 1999,
      originalPrice: 2999,
      discountPercent: 33,
      brand: "TuneFlex",
      rating: 4.4,
      reviewCount: 310,
      stockCount: 60,
      tags: ["budget", "wireless", "college", "running", "calls"],
      features: ["40mm Bass Boost Drivers", "Bluetooth 5.3", "50-Hour Playtime", "Fast Type-C Charging", "Foldable Travel Design"],
      attributes: { type: "On-Ear", battery: "50 hours", weight: "190g", mic: "In-line with ENC" },
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      description: "Outstanding value under ₹2,000. Reliable bluetooth connectivity, punchy bass, and long-lasting battery stamina.",
    },
    {
      name: "AirPod Pro Gen 2 USB-C",
      category: "Headphones",
      price: 21999,
      originalPrice: 24900,
      discountPercent: 11,
      brand: "Apple",
      rating: 4.9,
      reviewCount: 1100,
      stockCount: 20,
      tags: ["ios", "anc", "spatial audio", "calls", "travel"],
      features: ["H2 Apple Chip", "Adaptive Audio & Transparency", "Personalized Spatial Audio", "MagSafe USB-C Case", "Lossless Audio Support"],
      attributes: { type: "In-Ear", anc: "Adaptive Hybrid", battery: "6h + 24h case", chip: "Apple H2" },
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80",
      description: "Seamless integration across Apple devices with groundbreaking Adaptive Audio that dynamically adjusts to ambient noise.",
    },
    {
      name: "AudioTechnica ATH-M50xBT2",
      category: "Headphones",
      price: 16999,
      originalPrice: 19999,
      discountPercent: 15,
      brand: "Audio-Technica",
      rating: 4.8,
      reviewCount: 540,
      stockCount: 12,
      tags: ["studio", "music", "audiophile", "wired-wireless", "pro"],
      features: ["45mm Large-Aperture Drivers", "Pristine Studio Flat Frequency", "Dual Mics with Sidetone", "50-Hr Battery", "Low Latency Mode"],
      attributes: { type: "Over-Ear Studio", drivers: "45mm Neodymium", impedance: "38 ohms", battery: "50 hours" },
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      description: "Trusted by audio engineers and music producers worldwide. Delivers authentic, uncolored studio sound reproduction.",
    },

    // PHONES (16 items)
    {
      name: "PixelVision 8 Pro",
      category: "Phones",
      price: 72999,
      originalPrice: 84999,
      discountPercent: 14,
      brand: "PixelVision",
      rating: 4.8,
      reviewCount: 420,
      stockCount: 10,
      tags: ["camera", "ai", "flagship", "clean android", "photography"],
      features: ["50MP Octa PD Main + 48MP 5x Telephoto", "Tensor G3 AI Coprocessor", "Super Actua LTPO 120Hz", "7 Years OS Updates", "Magic Editor & Best Take"],
      attributes: { display: "6.7-inch OLED 120Hz", camera: "50MP + 48MP + 48MP", ram: "12GB", storage: "256GB", battery: "5050mAh" },
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      description: "The pinnacle of computational smartphone photography. Captures breathtaking night landscapes, studio portraits, and offers generative photo tools.",
    },
    {
      name: "Nexus Speed 12 5G",
      category: "Phones",
      price: 28999,
      originalPrice: 34999,
      discountPercent: 17,
      brand: "Nexus",
      rating: 4.6,
      reviewCount: 580,
      stockCount: 30,
      tags: ["camera", "budget", "fast charging", "5g", "value"],
      features: ["Sony IMX890 50MP OIS Camera", "Snapdragon 7+ Gen 2", "100W SUPERVOOC Charging (0-100 in 25m)", "120Hz Curved AMOLED", "16GB Extended RAM"],
      attributes: { display: "6.7-inch 1.5K AMOLED", camera: "50MP OIS Sony + 8MP Wide", charging: "100W Fast Charge", battery: "5000mAh" },
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      description: "Class-leading camera and blazing fast charging under ₹30,000. Features the flagship Sony IMX890 sensor with optical image stabilization.",
    },
    {
      name: "Galaxy Ultra S24",
      category: "Phones",
      price: 119999,
      originalPrice: 134999,
      discountPercent: 11,
      brand: "Samsung",
      rating: 4.9,
      reviewCount: 890,
      stockCount: 8,
      tags: ["flagship", "camera", "ai", "stylus", "premium"],
      features: ["200MP Quad Telephoto System", "Titanium Frame", "Galaxy AI Live Translate", "Built-in S-Pen Stylus", "Snapdragon 8 Gen 3 for Galaxy"],
      attributes: { display: "6.8-inch Dynamic AMOLED 2X", camera: "200MP + 50MP 5x + 10MP 3x + 12MP", ram: "12GB", storage: "512GB" },
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
      description: "The ultimate Android titan. Titanium construction, unmatched 100x zoom capability, and built-in AI productivity tools.",
    },
    {
      name: "iPhone 15 Pro 256GB",
      category: "Phones",
      price: 124900,
      originalPrice: 134900,
      discountPercent: 7,
      brand: "Apple",
      rating: 4.9,
      reviewCount: 1240,
      stockCount: 14,
      tags: ["ios", "camera", "titanium", "usb-c", "pro"],
      features: ["Aerospace Grade Titanium", "A17 Pro 3nm Processor", "48MP ProRaw Camera", "Action Button", "USB-C 10Gbps Transfer Speed"],
      attributes: { display: "6.1-inch Super Retina XDR ProMotion", camera: "48MP + 12MP UltraWide + 12MP 3x", weight: "187g" },
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
      description: "Unprecedented graphics performance with hardware-accelerated ray tracing and ProRes 4K 60fps recording direct to external drive.",
    },
    {
      name: "Redmi Note Pro Max 5G",
      category: "Phones",
      price: 18999,
      originalPrice: 22999,
      discountPercent: 17,
      brand: "Xiaomi",
      rating: 4.4,
      reviewCount: 650,
      stockCount: 45,
      tags: ["budget", "5g", "battery", "display", "student"],
      features: ["108MP Clarity Sensor", "120Hz Super AMOLED", "67W Turbo Charge", "5000mAh Dual-Cell Battery", "Gorilla Glass 5"],
      attributes: { display: "6.67-inch FHD+ AMOLED", camera: "108MP + 8MP", battery: "5000mAh", charging: "67W" },
      image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80",
      description: "Feature-loaded smartphone for college students and budget seekers. Gorgeous AMOLED panel and swift fast-charging.",
    },

    // ACCESSORIES (16 items)
    {
      name: "ConnectHub 8-in-1 Dual 4K USB-C Dock",
      category: "Accessories",
      price: 3499,
      originalPrice: 4999,
      discountPercent: 30,
      brand: "ConnectHub",
      rating: 4.7,
      reviewCount: 380,
      stockCount: 50,
      tags: ["hub", "usb-c", "laptop", "coding", "adapter", "dock"],
      features: ["Dual HDMI 4K@60Hz Outputs", "100W Power Delivery Pass-through", "Gigabit Ethernet RJ45", "SD & TF MicroSD Slots", "2x USB-A 3.2 10Gbps"],
      attributes: { ports: "8 Ports", pd: "100W Pass-through", material: "Anodized Aluminum", compatibility: "MacBook, Windows, iPad, Linux" },
      image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80",
      description: "The quintessential companion for every modern laptop. Instantly connects twin 4K external monitors, high-speed wired internet, and external backups with a single cable.",
    },
    {
      name: "ErgoFlow Precision Wireless Mouse",
      category: "Accessories",
      price: 2499,
      originalPrice: 3499,
      discountPercent: 28,
      brand: "NovaTech",
      rating: 4.8,
      reviewCount: 420,
      stockCount: 40,
      tags: ["mouse", "ergonomic", "wireless", "coding", "productivity"],
      features: ["MagSpeed Electromagnetic Scroll Wheel", "4000 DPI Darkfield Sensor (Tracks on Glass)", "3-Device Bluetooth & 2.4G", "Rechargeable 70-Day Battery"],
      attributes: { sensor: "Darkfield 4000 DPI", battery: "70 days per charge", connectivity: "Bluetooth + USB Receiver" },
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      description: "Engineered for engineers and analysts. Ultra-quiet acoustic switches, thumb gesture control, and smooth cross-computer navigation.",
    },
    {
      name: "ShieldArmor Water-Resistant Laptop Sleeve 14-16\"",
      category: "Accessories",
      price: 1499,
      originalPrice: 2199,
      discountPercent: 31,
      brand: "ArmorTech",
      rating: 4.7,
      reviewCount: 510,
      stockCount: 65,
      tags: ["sleeve", "bag", "laptop", "protection", "travel"],
      features: ["360° Reinforced CornerArmor Protection", "Water-Repellent Cordura Fabric", "Soft Microfiber Anti-Scratch Lining", "Accessory Front Pocket with Cable Organizers"],
      attributes: { material: "Cordura 500D Nylon", fit: "14 to 16 inch laptops", weight: "210g" },
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
      description: "Military-spec padded protection against drops, dings, and rainy commutes. Keeps your high-end laptop pristine.",
    },
    {
      name: "VoltSpeed 65W GaN Dual USB-C Fast Charger",
      category: "Accessories",
      price: 1899,
      originalPrice: 2699,
      discountPercent: 29,
      brand: "VoltTech",
      rating: 4.8,
      reviewCount: 390,
      stockCount: 55,
      tags: ["charger", "gan", "laptop", "fast charging", "compact"],
      features: ["Gallium Nitride (GaN III) Technology", "65W High-Speed Output", "Simultaneous Dual Device Fast-Charging", "50% Smaller than OEM Bricks", "Foldable Prongs"],
      attributes: { wattage: "65W Max", ports: "2x USB-C + 1x USB-A", protocols: "PD 3.0, PPS, QC 4+" },
      image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      description: "Downsize your backpack. Powers a laptop and phone simultaneously from one wall outlet at maximum charging velocity.",
    },
    {
      name: "KeyCraft Mechanical Wireless Keyboard",
      category: "Accessories",
      price: 5499,
      originalPrice: 7299,
      discountPercent: 24,
      brand: "KeyCraft",
      rating: 4.8,
      reviewCount: 230,
      stockCount: 22,
      tags: ["keyboard", "coding", "developer", "mechanical", "wireless"],
      features: ["Hot-Swappable Gateron Pro Yellow Switches", "75% Compact Layout", "Sound-Dampening Silicon Padding", "South-Facing RGB Backlit", "Mac & Windows Keycaps"],
      attributes: { layout: "75% (84 Keys)", connectivity: "Type-C, 2.4Ghz, Bluetooth 5.1", battery: "4000mAh (200 hours)" },
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      description: "Satisfying acoustic clack and buttery typing ergonomics. Crafted for hours of intense programming sessions.",
    },

    // SMART HOME & AUDIO (16 items)
    {
      name: "AuraGlow Smart Ambient LED Strip 5m",
      category: "Smart Home",
      price: 2299,
      originalPrice: 3199,
      discountPercent: 28,
      brand: "AuraGlow",
      rating: 4.6,
      reviewCount: 290,
      stockCount: 40,
      tags: ["smart home", "lighting", "rgb", "desk", "alexa"],
      features: ["16 Million Colors + Tunable Warm/Cool White", "Music Sync & Screen Mirroring", "Alexa & Google Assistant Voice Control", "Matter Certified IoT"],
      attributes: { length: "5 Meters", connectivity: "Wi-Fi 2.4GHz + BLE", power: "24W" },
      image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&auto=format&fit=crop&q=80",
      description: "Transform your home workstation into an immersive developer cave with bias lighting that relieves eye strain.",
    },
    {
      name: "EchoSphere 360 Spatial Smart Speaker",
      category: "Smart Home",
      price: 5999,
      originalPrice: 7999,
      discountPercent: 25,
      brand: "EchoSphere",
      rating: 4.7,
      reviewCount: 410,
      stockCount: 28,
      tags: ["smart home", "speaker", "audio", "assistant", "music"],
      features: ["Room-Filling 360° Acoustic Audio", "Built-in Zigbee & Matter Smart Hub", "Voice Command Automation", "Dual Microphones with Hardware Mute"],
      attributes: { drivers: "3-inch Woofer + Dual 0.8-inch Tweeters", streaming: "Spotify Connect, AirPlay 2" },
      image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop&q=80",
      description: "Rich bass and crystal highs coupled with a centralized smart home control node for your entire living space.",
    },
    {
      name: "SoundBlast Outdoor Rugged Speaker",
      category: "Audio",
      price: 3999,
      originalPrice: 5499,
      discountPercent: 27,
      brand: "SoundBlast",
      rating: 4.7,
      reviewCount: 340,
      stockCount: 30,
      tags: ["audio", "speaker", "outdoor", "travel", "waterproof"],
      features: ["IP67 Waterproof & Dustproof", "30W Punchy Output", "24-Hour Battery with Reverse PowerBank", "PartySync Multiple Pairing"],
      attributes: { power: "30W RMS", battery: "5200mAh (24 hrs)", rating: "IP67 Submersible" },
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
      description: "Built like a tank for weekend camping, poolside sessions, and outdoor excursions. Floats on water.",
    },

    // FITNESS (8 items)
    {
      name: "PulseFit Pro GPS Smartwatch",
      category: "Fitness",
      price: 8999,
      originalPrice: 11999,
      discountPercent: 25,
      brand: "PulseFit",
      rating: 4.7,
      reviewCount: 520,
      stockCount: 35,
      tags: ["watch", "fitness", "gps", "heart rate", "sports"],
      features: ["Dual-Frequency Precision GPS", "1.43-inch AMOLED Always-On", "Continuous SpO2 & Heart Rate", "14-Day Battery Life", "5ATM Water Resistance"],
      attributes: { display: "1.43-inch AMOLED 466x466", sensors: "BioTracker 4.0, Barometer, Gyro", battery: "14 days standard" },
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      description: "Tracks your marathons, sleep recovery, VO2 max, and daily stress levels without demanding nightly recharge.",
    },
    {
      name: "Apex Band 7 Lightweight Tracker",
      category: "Fitness",
      price: 2999,
      originalPrice: 3999,
      discountPercent: 25,
      brand: "PulseFit",
      rating: 4.5,
      reviewCount: 310,
      stockCount: 50,
      tags: ["fitness", "budget", "sleep", "lightweight", "sports"],
      features: ["All-day Heart Rate & Stress Monitoring", "1.62-inch High-Res AMOLED", "120 Sports Modes", "16-Day Endurance"],
      attributes: { weight: "13.5g ultra light", display: "1.62-inch AMOLED", waterResistance: "50 meters" },
      image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
      description: "Featherlight activity tracker that slips onto your wrist and quietly records your health benchmarks 24/7.",
    },

    // TABLETS (8 items)
    {
      name: "SlatePro 12.4 OLED Drawing Tablet",
      category: "Tablets",
      price: 49999,
      originalPrice: 59999,
      discountPercent: 16,
      brand: "SlatePro",
      rating: 4.8,
      reviewCount: 190,
      stockCount: 16,
      tags: ["tablet", "drawing", "stylus", "student", "creative"],
      features: ["12.4-inch 120Hz sRGB OLED", "Included Active Stylus with 4096 Pressure Levels", "Quad Stereo AKG Speakers", "Desktop DeX Mode"],
      attributes: { screen: "12.4-inch Super AMOLED", ram: "8GB", storage: "256GB", battery: "10090mAh" },
      image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80",
      description: "Digital sketchpad and portable workstation for digital artists, UI designers, and university note-takers.",
    },
    {
      name: "PocketTab 8.4 Compact Reader",
      category: "Tablets",
      price: 15999,
      originalPrice: 19999,
      discountPercent: 20,
      brand: "SlatePro",
      rating: 4.6,
      reviewCount: 220,
      stockCount: 25,
      tags: ["tablet", "budget", "reading", "portable", "student"],
      features: ["8.4-inch IPS Eye-Comfort Display", "All-day 12-Hour Battery", "Dual Speakers", "Dual-Band Wi-Fi 6"],
      attributes: { screen: "8.4-inch FHD+", storage: "128GB + MicroSD", weight: "310g" },
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      description: "Compact one-handed tablet ideal for reading PDFs, e-books, textbooks, and watching technical walkthroughs on the train.",
    },
  ];

  // Dynamically multiply variations to easily surpass 100+ rich items
  const brands = ["NovaTech", "Hyperion", "Aura", "Matrix", "Krypton", "Zenith", "Pulse"];
  const allProducts: any[] = [...rawProducts];

  // Generate auxiliary product variants with realistic specs
  for (let i = 1; i <= 80; i++) {
    const base = rawProducts[i % rawProducts.length];
    const brand = brands[i % brands.length];
    const priceShift = 1 + (((i * 7) % 30) - 15) / 100;
    const price = Math.round((base.price * priceShift) / 100) * 100;
    const name = `${brand} ${base.name.replace(/(Zenith|Aero|NovaTech|Titan|SoundSilence|PureBeat|PixelVision|ConnectHub|ErgoFlow|AuraGlow|EchoSphere|PulseFit|SlatePro)/g, "").trim()} V${i}`;

    allProducts.push({
      ...base,
      name,
      brand,
      price,
      originalPrice: Math.round(price * 1.2),
      discountPercent: Math.round(((Math.round(price * 1.2) - price) / Math.round(price * 1.2)) * 100),
      rating: +(4.2 + (i % 8) * 0.1).toFixed(1),
      reviewCount: 50 + (i * 13) % 400,
      stockCount: 5 + (i * 3) % 45,
    });
  }

  const createdProducts = [];
  for (let idx = 0; idx < allProducts.length; idx++) {
    const p = allProducts[idx];
    const catId = categoryMap.get(p.category) || categoryMap.get("Laptops")!;
    const slug = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${idx}`;

    const created = await prisma.product.create({
      data: {
        name: p.name,
        slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        categoryId: catId,
        brand: p.brand,
        rating: p.rating,
        reviewCount: p.reviewCount,
        inStock: p.stockCount > 0,
        stockCount: p.stockCount,
        tags: JSON.stringify(p.tags),
        attributes: JSON.stringify(p.attributes),
        features: JSON.stringify(p.features),
        images: JSON.stringify([p.image]),
        matchScore: 85 + (idx % 12),
      },
    });
    createdProducts.push(created);
  }
  console.log(`✅ Created ${createdProducts.length} realistic products.`);

  // 6. Seed 50+ Customers with segments
  console.log("👥 Seeding 50+ realistic customers with behavioral profiles...");
  const customerNames = [
    { name: "Rahul Sharma", email: "rahul.sharma@example.in", phone: "+91 98201 44521", segment: "High Intent", priceSens: "Low", intent: 92 },
    { name: "Priya Patel", email: "priya.p@techcorp.io", phone: "+91 98450 12389", segment: "VIP Merchant", priceSens: "Low", intent: 88 },
    { name: "Arjun Verma", email: "arjun.v@codelab.dev", phone: "+91 97112 88710", segment: "Tech Enthusiast", priceSens: "Medium", intent: 91 },
    { name: "Ananya Iyer", email: "ananya.iyer@designworks.com", phone: "+91 99304 55192", segment: "High Intent", priceSens: "Medium", intent: 86 },
    { name: "Rohan Gupta", email: "rohan.g@startupnest.co", phone: "+91 98110 33411", segment: "Price Sensitive", priceSens: "High", intent: 68 },
    { name: "Sneha Mukherjee", email: "sneha.m@fintechsys.in", phone: "+91 98310 99420", segment: "High Intent", priceSens: "Low", intent: 89 },
    { name: "Aditya Nair", email: "aditya.nair@aerospace.org", phone: "+91 98471 22910", segment: "VIP Merchant", priceSens: "Low", intent: 95 },
    { name: "Divya Rao", email: "divya.rao@cloudarch.com", phone: "+91 99001 88471", segment: "At Risk", priceSens: "High", intent: 54 },
    { name: "Karthik Sundaram", email: "karthik.s@quantumai.in", phone: "+91 98840 77123", segment: "Tech Enthusiast", priceSens: "Medium", intent: 94 },
    { name: "Meera Sen", email: "meera.sen@bioresearch.ac.in", phone: "+91 98300 44102", segment: "High Intent", priceSens: "Medium", intent: 85 },
    { name: "Vikram Singhania", email: "vikram.s@singhaniaholdings.com", phone: "+91 98210 11928", segment: "VIP Merchant", priceSens: "Low", intent: 96 },
    { name: "Pooja Deshmukh", email: "pooja.d@puneventures.in", phone: "+91 98500 66291", segment: "Price Sensitive", priceSens: "High", intent: 62 },
    { name: "Siddharth Menon", email: "sid.menon@gamestudio.in", phone: "+91 98451 99201", segment: "Tech Enthusiast", priceSens: "Medium", intent: 90 },
    { name: "Tara Bhattacharya", email: "tara.b@kolkatadesign.in", phone: "+91 98311 22340", segment: "High Intent", priceSens: "Low", intent: 87 },
    { name: "Nikhil Joshi", email: "nikhil.j@delhicoders.club", phone: "+91 98101 55672", segment: "Price Sensitive", priceSens: "High", intent: 71 },
  ];

  // Expand to 55 customers
  for (let c = 16; c <= 55; c++) {
    const base = customerNames[c % customerNames.length];
    customerNames.push({
      name: `${base.name.split(" ")[0]} ${String.fromCharCode(65 + (c % 26))}.`,
      email: `user${c}.${base.email.split("@")[0]}@commercepilot.demo`,
      phone: `+91 98${(10000000 + c * 37192).toString().slice(0, 8)}`,
      segment: c % 5 === 0 ? "VIP Merchant" : c % 3 === 0 ? "Price Sensitive" : "High Intent",
      priceSens: c % 3 === 0 ? "High" : "Low",
      intent: 60 + (c * 7) % 38,
    });
  }

  const createdCustomers = [];
  for (let i = 0; i < customerNames.length; i++) {
    const c = customerNames[i];
    const spend = i === 0 ? 0 : 15000 + (i * 8500); // Rahul Sharma starts clean for hero scenario
    const orderCount = i === 0 ? 0 : Math.max(1, Math.floor(spend / 35000));
    const created = await prisma.customer.create({
      data: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + (i * 1000)}?w=150&auto=format&fit=crop&q=80`,
        segment: c.segment,
        priceSensitivity: c.priceSens,
        totalSpend: spend,
        ordersCount: orderCount,
        avgOrderValue: orderCount > 0 ? Math.round(spend / orderCount) : 0,
        purchaseProbability: +(c.intent / 100).toFixed(2),
        churnRisk: c.intent < 65 ? "High" : c.intent < 80 ? "Medium" : "Low",
        preferences: JSON.stringify({
          topCategory: i % 2 === 0 ? "Laptops" : "Headphones",
          brandAffinity: i % 3 === 0 ? "Apple" : "NovaTech",
          preferredPayment: "UPI (Razorpay)",
        }),
      },
    });
    createdCustomers.push(created);
  }
  console.log(`✅ Created ${createdCustomers.length} customers.`);

  // 7. Seed 100+ Orders
  console.log("🧾 Seeding 100+ orders with AI attribution tags...");
  let totalSeededRevenue = 0;
  let totalAiRevenue = 0;

  for (let o = 1; o <= 110; o++) {
    const customer = createdCustomers[1 + (o % (createdCustomers.length - 1))];
    const product = createdProducts[o % createdProducts.length];
    const isAi = o % 3 !== 0; // ~66% AI influenced
    const aiType = isAi
      ? o % 4 === 0
        ? "RECOVERED_CART"
        : o % 4 === 1
        ? "INTENT_RECOMMENDATION"
        : o % 4 === 2
        ? "UPSELL_CROSS_SELL"
        : "OFFER_OPTIMIZED"
      : null;

    const subtotal = product.price;
    const discount = isAi && aiType === "OFFER_OPTIMIZED" ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal - discount;

    totalSeededRevenue += total;
    if (isAi) totalAiRevenue += total;

    // Spread orders across past 45 days
    const daysAgo = Math.floor(Math.random() * 40);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    await prisma.order.create({
      data: {
        orderNumber: `ORD-${2026000 + o}`,
        customerId: customer.id,
        status: "COMPLETED",
        subtotal,
        discount,
        shipping: 0,
        total,
        currency: "INR",
        paymentMethod: o % 2 === 0 ? "UPI (Razorpay Sim)" : "Credit Card (Razorpay Sim)",
        paymentStatus: "PAID",
        isAiInfluenced: isAi,
        aiInfluenceType: aiType,
        shippingAddress: JSON.stringify({
          street: `${100 + o} Residency Road`,
          city: o % 3 === 0 ? "Bengaluru" : o % 3 === 1 ? "Mumbai" : "New Delhi",
          state: o % 3 === 0 ? "Karnataka" : o % 3 === 1 ? "Maharashtra" : "Delhi",
          postalCode: `${560000 + (o % 99)}`,
        }),
        createdAt,
        items: {
          create: [
            {
              productId: product.id,
              quantity: 1,
              unitPrice: product.price,
              totalPrice: product.price,
            },
          ],
        },
      },
    });
  }
  console.log(`✅ Seeded 110 orders (GMV: ₹${Math.round(totalSeededRevenue).toLocaleString("en-IN")}, AI: ₹${Math.round(totalAiRevenue).toLocaleString("en-IN")}).`);

  // 8. Seed Abandoned Carts (Including the Rahul Sharma Hero Scenario Cart!)
  console.log("🛒 Seeding abandoned carts & setting up Rahul Sharma Hero scenario...");
  const rahulCustomer = createdCustomers[0]; // Rahul Sharma
  const targetLaptop = createdProducts.find((p) => p.name.includes("Zenith Pro 16")) || createdProducts[0];

  // Rahul Sharma's abandoned cart
  const rahulCart = await prisma.cart.create({
    data: {
      customerId: rahulCustomer.id,
      sessionId: "session_rahul_hero_2026",
      subtotal: targetLaptop.price, // ₹74,999
      discount: 0,
      shipping: 0,
      total: targetLaptop.price,
      status: "ABANDONED",
      intentScore: 92,
      abandonmentRisk: "High",
      recoveryAction: "Personalized Reminder (No Discount)",
      recoveryStatus: "PENDING",
      abandonedAt: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
      items: {
        create: [
          {
            productId: targetLaptop.id,
            quantity: 1,
            priceAtAdd: targetLaptop.price,
          },
        ],
      },
    },
  });

  // Additional customer events for Rahul Sharma showing research behavior
  await prisma.customerEvent.createMany({
    data: [
      {
        customerId: rahulCustomer.id,
        sessionId: "session_rahul_hero_2026",
        eventType: "INTENT_SEARCH",
        eventData: JSON.stringify({ query: "I need a laptop for coding under ₹80,000", extractedBudget: 80000 }),
      },
      {
        customerId: rahulCustomer.id,
        sessionId: "session_rahul_hero_2026",
        eventType: "PRODUCT_VIEW",
        eventData: JSON.stringify({ productId: targetLaptop.id, productName: targetLaptop.name, durationSec: 140 }),
      },
      {
        customerId: rahulCustomer.id,
        sessionId: "session_rahul_hero_2026",
        eventType: "PRODUCT_VIEW",
        eventData: JSON.stringify({ productId: targetLaptop.id, productName: targetLaptop.name, repeat: 2 }),
      },
      {
        customerId: rahulCustomer.id,
        sessionId: "session_rahul_hero_2026",
        eventType: "ADD_TO_CART",
        eventData: JSON.stringify({ productId: targetLaptop.id, price: targetLaptop.price }),
      },
      {
        customerId: rahulCustomer.id,
        sessionId: "session_rahul_hero_2026",
        eventType: "CART_ABANDON",
        eventData: JSON.stringify({ cartId: rahulCart.id, timeOnCheckout: 45 }),
      },
    ],
  });

  // Seed 14 other abandoned carts
  for (let a = 1; a <= 14; a++) {
    const cust = createdCustomers[a + 1];
    const prod = createdProducts[(a * 5) % createdProducts.length];
    const isRecovered = a % 3 === 0;

    await prisma.cart.create({
      data: {
        customerId: cust.id,
        sessionId: `session_abandoned_${a}`,
        subtotal: prod.price,
        total: prod.price,
        status: isRecovered ? "RECOVERED" : "ABANDONED",
        intentScore: 70 + (a * 4) % 25,
        abandonmentRisk: a % 2 === 0 ? "High" : "Medium",
        recoveryAction: a % 2 === 0 ? "Personalized Reminder (No Discount)" : "Free Shipping Incentive",
        recoveryStatus: isRecovered ? "RECOVERED" : "PENDING",
        abandonedAt: new Date(Date.now() - (a * 45 + 20) * 60 * 1000),
        items: {
          create: [
            {
              productId: prod.id,
              quantity: 1,
              priceAtAdd: prod.price,
            },
          ],
        },
      },
    });
  }
  console.log("✅ Seeded 15 abandoned carts.");

  // 9. Seed 10 Specialized AI Agents
  console.log("🤖 Seeding 10 AI Agents with autonomy parameters and performance stats...");
  const agentsData = [
    {
      key: "INTENT",
      name: "Shopping Intent Agent",
      role: "Natural Language Parser & Intent Extractor",
      description: "Extracts product categories, hard budget ceilings, primary use cases, and purchase intent scores (0-100) from customer natural language inquiries.",
      status: "ACTIVE",
      autonomyLevel: "AUTO_EXECUTE",
      confidenceThreshold: 0.85,
      modelProvider: "Gemini 1.5 Pro (Dual-Engine Fallback)",
      totalExecutions: 1420,
      successfulActions: 1368,
      fallbackCount: 52,
      revenueInfluenced: 482000,
      successRate: 96.3,
      fallbackRate: 3.7,
      avgLatencyMs: 140,
    },
    {
      key: "DISCOVERY",
      name: "Product Discovery Agent",
      role: "Multi-Constraint Semantic Catalog Ranker",
      description: "Ranks catalog products into Best Match, Best Value, Budget Pick, and Premium Choice with transparent 'Why this matches' explanations.",
      status: "ACTIVE",
      autonomyLevel: "AUTO_EXECUTE",
      confidenceThreshold: 0.80,
      modelProvider: "Gemini 1.5 Pro + Vector Re-ranking",
      totalExecutions: 1290,
      successfulActions: 1240,
      fallbackCount: 50,
      revenueInfluenced: 395000,
      successRate: 96.1,
      fallbackRate: 3.9,
      avgLatencyMs: 165,
    },
    {
      key: "ADVISOR",
      name: "Commerce Advisor Agent",
      role: "Grounded Conversational Shopping Concierge",
      description: "Conducts conversational Q&A, specs comparisons, and student/workplace suitability assessments strictly grounded in catalog data.",
      status: "ACTIVE",
      autonomyLevel: "AUTO_EXECUTE",
      confidenceThreshold: 0.88,
      modelProvider: "Gemini 1.5 Pro",
      totalExecutions: 875,
      successfulActions: 840,
      fallbackCount: 35,
      revenueInfluenced: 215000,
      successRate: 96.0,
      fallbackRate: 4.0,
      avgLatencyMs: 210,
    },
    {
      key: "PERSONALIZATION",
      name: "Personalization Agent",
      role: "Customer 360 Behavioral Profiler",
      description: "Aggregates browse sequences, cart history, and order frequencies to build real-time behavioral profiles and price sensitivity scores.",
      status: "ACTIVE",
      autonomyLevel: "AUTO_EXECUTE",
      confidenceThreshold: 0.82,
      modelProvider: "CommercePilot Heuristic Engine",
      totalExecutions: 940,
      successfulActions: 912,
      fallbackCount: 28,
      revenueInfluenced: 180000,
      successRate: 97.0,
      fallbackRate: 3.0,
      avgLatencyMs: 95,
    },
    {
      key: "OFFER",
      name: "Offer Optimization Agent",
      role: "Margin-Guarding Incentive Governor",
      description: "Determines whether discounts are strictly required to convert. Prevents margin waste when buyer intent is already high.",
      status: "ACTIVE",
      autonomyLevel: "APPROVAL_REQUIRED",
      confidenceThreshold: 0.90,
      modelProvider: "Gemini 1.5 Pro + Heuristic Rules",
      totalExecutions: 610,
      successfulActions: 580,
      fallbackCount: 30,
      revenueInfluenced: 340000,
      successRate: 95.1,
      fallbackRate: 4.9,
      avgLatencyMs: 130,
    },
    {
      key: "RECOVERY",
      name: "Cart Recovery Agent",
      role: "Autonomous Abandonment Interceptor",
      description: "Monitors cart inactivity, computes abandonment risk, and triggers personalized reassurance nudges without unnecessary price concession.",
      status: "ACTIVE",
      autonomyLevel: "AUTO_EXECUTE",
      confidenceThreshold: 0.88,
      modelProvider: "Gemini 1.5 Flash + Decision Engine",
      totalExecutions: 450,
      successfulActions: 412,
      fallbackCount: 38,
      revenueInfluenced: 184500,
      successRate: 91.5,
      fallbackRate: 8.5,
      avgLatencyMs: 155,
    },
    {
      key: "UPSELL",
      name: "Upsell & Cross-Sell Agent",
      role: "Contextual Peripheral Companion Matcher",
      description: "Pairs hardware with highly relevant accessories (e.g. laptops with USB-C docks & padded sleeves) at checkout.",
      status: "ACTIVE",
      autonomyLevel: "AUTO_EXECUTE",
      confidenceThreshold: 0.85,
      modelProvider: "Catalog Graph Engine",
      totalExecutions: 820,
      successfulActions: 775,
      fallbackCount: 45,
      revenueInfluenced: 290000,
      successRate: 94.5,
      fallbackRate: 5.5,
      avgLatencyMs: 115,
    },
    {
      key: "RETENTION",
      name: "Customer Retention Agent",
      role: "Post-Purchase Lifecycle Orchestrator",
      description: "Nurtures customers following payment with tailored onboarding guides and consumable replenishment windows.",
      status: "ACTIVE",
      autonomyLevel: "AUTO_EXECUTE",
      confidenceThreshold: 0.85,
      modelProvider: "Lifecycle Automation Engine",
      totalExecutions: 380,
      successfulActions: 365,
      fallbackCount: 15,
      revenueInfluenced: 125000,
      successRate: 96.0,
      fallbackRate: 4.0,
      avgLatencyMs: 110,
    },
    {
      key: "GROWTH",
      name: "Growth Insights Agent",
      role: "Storefront Analytics & Conversion Strategist",
      description: "Analyzes funnel telemetry to detect latency bottlenecks, pricing resistance, and automated margin-expansion opportunities.",
      status: "ACTIVE",
      autonomyLevel: "AUTO_EXECUTE",
      confidenceThreshold: 0.92,
      modelProvider: "Gemini 1.5 Pro Analytics Core",
      totalExecutions: 290,
      successfulActions: 285,
      fallbackCount: 5,
      revenueInfluenced: 410000,
      successRate: 98.2,
      fallbackRate: 1.8,
      avgLatencyMs: 240,
    },
    {
      key: "ORCHESTRATOR",
      name: "Master Commerce Orchestrator",
      role: "Autonomous Agent Coordinator & Routing Bus",
      description: "Evaluates inbound shopper and merchant events and invokes the exact specialized agent pipeline required.",
      status: "ACTIVE",
      autonomyLevel: "AUTO_EXECUTE",
      confidenceThreshold: 0.95,
      modelProvider: "CommercePilot Core Bus",
      totalExecutions: 3100,
      successfulActions: 3040,
      fallbackCount: 60,
      revenueInfluenced: 482000,
      successRate: 98.1,
      fallbackRate: 1.9,
      avgLatencyMs: 65,
    },
  ];

  for (const agent of agentsData) {
    await prisma.aIAgent.create({ data: agent });
  }
  console.log("✅ Seeded 10 specialized AI agents.");

  // 10. Seed 25+ Transparent AI Decision Traces
  console.log("🔍 Seeding 25+ transparent AI decision traces...");
  const decisionsData = [
    {
      agentKey: "RECOVERY",
      eventType: "CART_ABANDONMENT_EVALUATION",
      customerId: rahulCustomer.id,
      entityType: "Cart",
      entityId: rahulCart.id,
      contextJson: JSON.stringify({
        event: "Customer added ₹74,999 laptop to cart then went inactive for 18 minutes",
        viewCount: 4,
        cartValue: 74999,
        sessions: 2,
      }),
      intentScore: 92,
      riskLevel: "High",
      optionsConsideredJson: JSON.stringify([
        "1. 15% discount coupon (-₹11,249 margin loss)",
        "2. Stock-urgency reminder with zero discount",
        "3. Alternative cheaper laptop recommendation",
        "4. No action",
      ]),
      decision: "Personalized Reminder (No Discount)",
      confidence: 0.93,
      reasoning: "High purchase intent detected (92/100). Customer viewed product 4 times. Price resistance is low. Concluding abandonment is due to external distraction. Preserving full gross margin.",
      status: "PENDING_APPROVAL",
      requiresApproval: false,
      outcome: "Awaiting simulation trigger in Hero Scenario demo",
      revenueImpact: 0,
    },
    {
      agentKey: "OFFER",
      eventType: "CHECKOUT_OFFER_OPTIMIZATION",
      customerId: createdCustomers[1].id,
      entityType: "Cart",
      entityId: "cart-offer-demo",
      contextJson: JSON.stringify({
        event: "Customer initiated checkout on high-end setup",
        cartValue: 84900,
        customerSegment: "VIP Merchant",
      }),
      intentScore: 94,
      riskLevel: "Low",
      optionsConsideredJson: JSON.stringify([
        "No Offer (Preserve Margin)",
        "5% Welcome Discount",
        "Free Next-Day Air Shipping",
      ]),
      decision: "No Offer — Retain Full Margin",
      confidence: 0.96,
      reasoning: "Customer has 94/100 intent score with zero price sensitivity. Offering discount would burn ₹4,245 unnecessarily.",
      status: "EXECUTED",
      requiresApproval: false,
      outcome: "Customer completed purchase at full retail price",
      revenueImpact: 84900,
    },
    {
      agentKey: "OFFER",
      eventType: "LARGE_DISCOUNT_REVIEW",
      customerId: createdCustomers[4].id,
      entityType: "Cart",
      entityId: "cart-approval-demo",
      contextJson: JSON.stringify({
        event: "Cart abandonment on enterprise multi-unit order",
        cartValue: 149990,
        customerSegment: "Price Sensitive",
      }),
      intentScore: 72,
      riskLevel: "High",
      optionsConsideredJson: JSON.stringify([
        "Offer 15% promotional concession",
        "Offer 5% concession",
        "No concession",
      ]),
      decision: "Proposed 15% Bulk Incentive (-₹22,498)",
      confidence: 0.86,
      reasoning: "High-value enterprise order at risk of abandonment. Concession projected to seal deal, but discount amount exceeds ₹10,000 threshold.",
      status: "PENDING_APPROVAL",
      requiresApproval: true,
      outcome: "Pending merchant review in Approvals Center",
      revenueImpact: 149990,
    },
  ];

  // Seed additional traces
  for (let d = 4; d <= 25; d++) {
    const cust = createdCustomers[d % createdCustomers.length];
    const isExec = d % 3 !== 0;
    decisionsData.push({
      agentKey: d % 2 === 0 ? "DISCOVERY" : "UPSELL",
      eventType: d % 2 === 0 ? "CATALOG_RANKING" : "CROSS_SELL_PAIRING",
      customerId: cust.id,
      entityType: "Product",
      entityId: createdProducts[d % createdProducts.length].id,
      contextJson: JSON.stringify({
        query: "Recommended accessories for laptop",
        shopperSegment: cust.segment,
      }),
      intentScore: 80 + (d % 15),
      riskLevel: "Low",
      optionsConsideredJson: JSON.stringify(["USB-C Hub", "Laptop Sleeve", "Ergonomic Mouse"]),
      decision: "Paired ConnectHub 8-in-1 Dual 4K Dock",
      confidence: 0.92,
      reasoning: "High contextual affinity with customer's recent laptop purchase.",
      status: isExec ? "EXECUTED" : "PENDING_APPROVAL",
      requiresApproval: !isExec,
      outcome: isExec ? "Added to cart and purchased" : "Awaiting review",
      revenueImpact: isExec ? 3499 : 0,
    });
  }

  for (const dec of decisionsData) {
    await prisma.aIDecision.create({ data: dec });
  }
  console.log(`✅ Seeded ${decisionsData.length} transparent decision traces.`);

  // 11. Seed Campaigns
  console.log("📣 Seeding automated marketing campaigns...");
  const sampleProductIds = createdProducts.slice(0, 3).map((p) => p.id);
  await prisma.campaign.createMany({
    data: [
      {
        name: "Complete Your Setup — Pro Peripherals",
        goal: "Increase Repeat Orders for Laptop Purchasers",
        targetAudience: "Customers who purchased a laptop in the last 30 days",
        message: "Unlock your machine's full potential. Enjoy handpicked multi-port docks, sleeves, and wireless precision accessories with next-day dispatch.",
        recommendedProductIds: JSON.stringify(sampleProductIds),
        status: "ACTIVE",
        expectedImpact: "+24% AOV Uplift, est. ₹3.8L incremental GMV",
        actualRevenue: 184000,
        sentCount: 1420,
        convertedCount: 198,
        aiReasoning: "Data shows 38% of laptop buyers purchase docks and sleeves within 21 days from 3rd-party retailers. Proactive in-app bundling captures this demand.",
      },
      {
        name: "Audiophile Loyalty Revival",
        goal: "Drive Upgrades for Premium Headphone Owners",
        targetAudience: "Customers with past audio purchases > ₹5,000",
        message: "Experience next-gen hybrid ANC with high-res LDAC codecs. Trade in or upgrade with priority member loyalty benefits.",
        recommendedProductIds: JSON.stringify(sampleProductIds),
        status: "ACTIVE",
        expectedImpact: "+15% Repeat Conversion",
        actualRevenue: 98000,
        sentCount: 890,
        convertedCount: 76,
        aiReasoning: "Audio buyers show an 82% brand affinity retention when contacted with spec-upgrade announcements.",
      },
    ],
  });

  // 12. Seed Notifications
  console.log("🔔 Seeding notifications...");
  await prisma.notification.createMany({
    data: [
      {
        title: "High-Value Abandoned Cart Detected",
        message: "Rahul Sharma abandoned a ₹74,999 cart. Cart Recovery Agent recommends a personalized stock-urgency reminder.",
        type: "ALERT",
        link: "/dashboard/abandoned-carts",
      },
      {
        title: "Human Approval Required: 15% Enterprise Concession",
        message: "Offer Agent proposed ₹22,498 discount on ₹1.49L bulk order. Review required.",
        type: "APPROVAL_REQUIRED",
        link: "/dashboard/approvals",
      },
      {
        title: "AI Influenced Revenue Milestone: ₹4.82L",
        message: "CommercePilot agents generated ₹4.82L in attributed revenue (+31.2% this month).",
        type: "SUCCESS",
        link: "/dashboard/analytics",
      },
    ],
  });

  // 13. Seed Activity Logs
  console.log("📋 Seeding audit activity logs...");
  await prisma.activityLog.createMany({
    data: [
      {
        actor: "Shopping Intent Agent",
        agentKey: "INTENT",
        action: "Extracted high purchase intent (92/100)",
        entityType: "Query",
        entityId: "query_coding_laptop",
        outcome: "Success",
        details: "Identified budget ₹80,000 and use case: Coding & College.",
      },
      {
        actor: "Cart Recovery Agent",
        agentKey: "RECOVERY",
        action: "Evaluated Rahul Sharma's abandoned cart",
        entityType: "Cart",
        entityId: rahulCart.id,
        outcome: "Pending",
        details: "High intent detected. Decided on zero-discount reminder to protect margin.",
      },
      {
        actor: "Offer Optimization Agent",
        agentKey: "OFFER",
        action: "Flagged bulk concession for human approval",
        entityType: "Cart",
        entityId: "cart-approval-demo",
        outcome: "Approval Required",
        details: "Concession exceeds ₹10,000 threshold.",
      },
    ],
  });

  console.log("🎉 CommercePilot AI database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
