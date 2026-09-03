import { getDb } from "./client";
import { destinations } from "./schema";

const DESTINATIONS_DATA = [
  { 
    name: "Sigiriya", 
    slug: "sigiriya",
    region: "Cultural Triangle", 
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&q=80", 
    tagline: "Ancient rock citadel",
    featured: true,
    order: 1
  },
  { 
    name: "Galle", 
    slug: "galle",
    region: "Southern Coast",   
    image: "https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?w=700&q=80", 
    tagline: "Dutch colonial splendour",
    featured: true,
    order: 2
  },
  { 
    name: "Ella", 
    slug: "ella",
    region: "Hill Country",     
    image: "https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=700&q=80", 
    tagline: "Misty peaks & tea gardens",
    featured: true,
    order: 3
  },
  { 
    name: "Yala", 
    slug: "yala",
    region: "National Park",    
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=700&q=80", 
    tagline: "Leopards & wild elephants",
    featured: true,
    order: 4
  },
  { 
    name: "Mirissa", 
    slug: "mirissa",
    region: "Beach Coast",      
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=700&q=80", 
    tagline: "Blue whale encounters",
    featured: true,
    order: 5
  },
  { 
    name: "Kandy", 
    slug: "kandy",
    region: "Hill Capital",     
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=700&q=80", 
    tagline: "Sacred tooth relic city",
    featured: true,
    order: 6
  },
];

async function main() {
  const db = getDb();
  console.log("🌱 Seeding destinations...");

  for (const data of DESTINATIONS_DATA) {
    await db
      .insert(destinations)
      .values({
        ...data,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: destinations.slug,
        set: {
          ...data,
          updatedAt: new Date(),
        },
      });
  }

  console.log("✅ Destinations seeded successfully!");
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
