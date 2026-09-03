import { getDb } from "./client";
import { testimonials } from "./schema";

const TESTIMONIALS_DATA = [
  {
    name: "Sophie & Liam Anderson",
    origin: "London, United Kingdom",
    text: "Our 10-day tour through Sri Lanka with Ceylon Travels was absolute perfection. From private tea estate tours in Ella to watching elephants at dusk, every single detail was handled seamlessly!",
    trip: "Honeymoon in Paradise, 10 Days",
    rating: 5,
    order: 1,
  },
  {
    name: "Dr. Marcus Weber",
    origin: "Zurich, Switzerland",
    text: "As a wildlife enthusiast, seeing leopards in Yala and blue whales off Mirissa was a dream come true. Our driver-guide was exceptionally knowledgeable and attentive.",
    trip: "Wild Coast Explorer, 12 Days",
    rating: 5,
    order: 2,
  },
  {
    name: "The Takashi Family",
    origin: "Tokyo, Japan",
    text: "Traveling with our two kids was so stress-free. The ancient Sigiriya fortress climb and cultural village lunch were highlights we will treasure forever.",
    trip: "Golden Triangle & Coast, 10 Days",
    rating: 5,
    order: 3,
  },
  {
    name: "Camille & Antoine Dubois",
    origin: "Paris, France",
    text: "Bespoke luxury at its finest. The private villas, boutique beach retreats in Tangalle, and warm Sri Lankan hospitality made our anniversary trip unforgettable.",
    trip: "Luxury Villa Escape, 8 Days",
    rating: 5,
    order: 4,
  },
  {
    name: "Hannah & Oliver Smith",
    origin: "Sydney, Australia",
    text: "From catching dawn waves on the south coast to scenic train rides through misty mountains, Ceylon Travels created our ultimate dream holiday.",
    trip: "Coast & Country Adventure, 14 Days",
    rating: 5,
    order: 5,
  },
  {
    name: "Freja & Gustav Nilsson",
    origin: "Stockholm, Sweden",
    text: "Impeccable service, luxurious eco-lodges, and incredible local food! Exploring the ancient ruins of Polonnaruwa with our expert guide was truly inspiring.",
    trip: "Grand Island Cultural Tour, 15 Days",
    rating: 5,
    order: 6,
  },
];

async function seedTestimonials() {
  const db = getDb();
  console.log("🌱 Seeding testimonials...");
  await db.delete(testimonials);

  for (const t of TESTIMONIALS_DATA) {
    await db.insert(testimonials).values({
      name: t.name,
      origin: t.origin,
      text: t.text,
      trip: t.trip,
      rating: t.rating,
      order: t.order,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log("✅ Testimonials seeded successfully!");
  process.exit(0);
}

seedTestimonials().catch((err) => {
  console.error("❌ Seeding testimonials failed:", err);
  process.exit(1);
});
