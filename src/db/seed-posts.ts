import { getDb } from "./client";
import { posts } from "./schema";

async function seedPosts() {
  console.log("🌱 Seeding blog posts...");
  const db = getDb();

  const blogPosts = [
    {
      title: "The Art of the Slow Journey: Why We Love the Hill Country",
      slug: "slow-journey-hill-country",
      tag: "Travel Tips",
      readingTime: "5 min",
      image: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80",
      excerpt: "In a world that moves too fast, Sri Lanka's misty tea estates offer a different pace. Discover our favorite hidden trails in Ella.",
      content: "<p>The hill country of Sri Lanka is a world apart from the tropical heat of the coast. Here, the air is crisp, the landscape is a patchwork of emerald green, and the pace of life slows to the speed of a passing train...</p>",
      published: true,
    },
    {
      title: "Sigiriya at Dawn: A Photographer's Guide to the Lion Rock",
      slug: "sigiriya-dawn-guide",
      tag: "Photography",
      readingTime: "4 min",
      image: "https://images.unsplash.com/photo-1588598198321-9735fd52a9b8?w=800&q=80",
      excerpt: "Beating the crowds is just the beginning. Learn the best angles for capturing the majesty of the ancient sky palace.",
      content: "<p>Standing atop Sigiriya, you're not just looking at a view; you're looking at history. This 5th-century fortress is a masterpiece of ancient urban planning...</p>",
      published: true,
    },
    {
      title: "Beyond the Beach: Finding Peace in Southern Monasteries",
      slug: "southern-monasteries-peace",
      tag: "Culture",
      readingTime: "6 min",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
      excerpt: "The south coast is famous for surfing, but its true soul lies in the quiet forest hermitages just a few miles inland.",
      content: "<p>While the crowds flock to the waves of Mirissa and Weligama, a deeper silence can be found in the temples that dot the southern landscape...</p>",
      published: true,
    },
    {
      title: "Wild Heart of Lanka: A Safari Guide to Yala and Udawalawe",
      slug: "wild-heart-safari-guide",
      tag: "Wildlife",
      readingTime: "7 min",
      image: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&q=80",
      excerpt: "From the elusive leopards of Yala to the elephant gatherings of Udawalawe, here is how to make the most of your safari adventure.",
      content: "<p>Sri Lanka is one of the best places in Asia for wildlife viewing. Yala National Park boasts the highest density of leopards in the world...</p>",
      published: true,
    },
    {
      title: "Culina lanka: A Food Lover's Journey Through the Island",
      slug: "sri-lankan-food-journey",
      tag: "Food & Drink",
      readingTime: "5 min",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      excerpt: "Spicy curries, sweet hoppers, and the world's freshest seafood. Sri Lankan cuisine is a feast for the senses.",
      content: "<p>The secret to Sri Lankan food is in the spice. Not just the heat, but the complexity of flavors built from cinnamon, cardamom, and fresh curry leaves...</p>",
      published: true,
    }
  ];

  for (const p of blogPosts) {
    await db.insert(posts).values({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).onConflictDoNothing();
  }

  console.log(`✅ ${blogPosts.length} blog posts seeded`);
  process.exit(0);
}

seedPosts().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
