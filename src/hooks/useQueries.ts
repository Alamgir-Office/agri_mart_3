import { useQuery } from '@tanstack/react-query';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/data/products.json');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });
};

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch('/data/products.json');
      if (!res.ok) throw new Error('Failed to fetch product');
      const products = await res.json();
      const product = products.find((p: any) => p.id === id);
      if (!product) throw new Error('Product not found');
      return product;
    },
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/data/categories.json');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
  });
};

export const useFarmers = () => {
  return useQuery({
    queryKey: ['farmers'],
    queryFn: async () => {
      const res = await fetch('/data/farmers.json');
      if (!res.ok) throw new Error('Failed to fetch farmers');
      return res.json();
    },
  });
};

export const useSeasonal = () => {
  return useQuery({
    queryKey: ['seasonal'],
    queryFn: async () => {
      const res = await fetch('/data/seasonal.json');
      if (!res.ok) throw new Error('Failed to fetch seasonal products');
      return res.json();
    },
  });
};

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const res = await fetch('/data/banners.json');
      if (!res.ok) throw new Error('Failed to fetch banners');
      return res.json();
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/data/user.json');
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/data/orders.json');
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
  });
};

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await fetch('/data/locations.json');
      if (!res.ok) throw new Error('Failed to fetch locations');
      return res.json();
    },
  });
};
