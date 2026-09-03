import { WishlistClient } from "./WishlistClient";
import type { Metadata } from "next";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Your Wishlist | Ceylon Travels",
  description: "View your saved itineraries and start planning your dream journey to Sri Lanka.",
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen bg-white">
      <WishlistClient />
    </main>
  );
}
