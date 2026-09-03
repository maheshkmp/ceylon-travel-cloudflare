import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ItineraryData } from '@/components/shared/ItineraryCard';

interface WishlistState {
  items: ItineraryData[];
  addItinerary: (item: ItineraryData) => void;
  removeItinerary: (idOrSlug: string) => void;
  isWishlisted: (idOrSlug: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItinerary: (item) => {
        const identifier = item.id || item.slug;
        if (!get().isWishlisted(identifier)) {
          set((state) => ({ items: [...state.items, item] }));
        }
      },
      removeItinerary: (idOrSlug) => {
        set((state) => ({
          items: state.items.filter((i) => (i.id || i.slug) !== idOrSlug),
        }));
      },
      isWishlisted: (idOrSlug) => {
        return get().items.some((i) => (i.id || i.slug) === idOrSlug);
      },
    }),
    {
      name: 'ceylon-travels-wishlist', // unique name in localStorage
    }
  )
);
