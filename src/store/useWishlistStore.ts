import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[]; // array of product IDs
  toggleItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (id) => {
        set((state) => {
          const exists = state.items.includes(id);
          if (exists) {
            return { items: state.items.filter((itemId) => itemId !== id) };
          }
          return { items: [...state.items, id] };
        });
      },
      isInWishlist: (id) => get().items.includes(id),
    }),
    {
      name: 'agrifresh-wishlist',
    }
  )
);
