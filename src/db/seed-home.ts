import { getDb } from "./client";
import { travelCategories, testimonials, galleryImages } from "./schema";
import { TRAVEL_CATEGORIES, TESTIMONIALS, GALLERY_IMAGES } from "@/data/home";

async function seedHome() {
  console.log("🌱 Seeding Home Page data...");
  const db = getDb();

  try {
    // Seed Travel Categories
    console.log("Seeding Travel Categories...");
    await db.delete(travelCategories);
    const categoryInserts = TRAVEL_CATEGORIES.map((cat, index) => ({
      label: cat.label,
      icon: cat.icon,
      image: cat.image,
      description: cat.desc,
      order: index,
    }));
    if (categoryInserts.length > 0) {
      await db.insert(travelCategories).values(categoryInserts);
    }
    console.log(`✅ Seeded ${categoryInserts.length} travel categories`);

    // Seed Testimonials
    console.log("Seeding Testimonials...");
    await db.delete(testimonials);
    const testimonialInserts = TESTIMONIALS.map((test, index) => ({
      name: test.name,
      origin: test.origin,
      text: test.text,
      trip: test.trip,
      rating: test.rating,
      order: index,
    }));
    if (testimonialInserts.length > 0) {
      await db.insert(testimonials).values(testimonialInserts);
    }
    console.log(`✅ Seeded ${testimonialInserts.length} testimonials`);

    // Seed Gallery Images
    console.log("Seeding Gallery Images...");
    await db.delete(galleryImages);
    const galleryInserts = GALLERY_IMAGES.map((url, index) => ({
      url: url,
      alt: `Gallery image ${index + 1}`,
      order: index,
    }));
    if (galleryInserts.length > 0) {
      await db.insert(galleryImages).values(galleryInserts);
    }
    console.log(`✅ Seeded ${galleryInserts.length} gallery images`);

    console.log("🎉 Home Page seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Home Page data:", error);
    process.exit(1);
  }
}

seedHome();
