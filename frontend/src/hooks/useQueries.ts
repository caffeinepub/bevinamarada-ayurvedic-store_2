import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, ProductInput, Inquiry, InquiryInput, Sale, SaleInput, IncomeStats, ProductId, InquiryId } from '../backend';

// ─── Products ────────────────────────────────────────────────────────────────

export function useGetProducts(hideOutOfStock: boolean = false) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products', hideOutOfStock],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts(hideOutOfStock);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductById(id: ProductId | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ['product', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getProductById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: ProductInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, product }: { id: ProductId; product: ProductInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: ProductId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] });
    },
  });
}

export function useGetLowStockProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['lowStockProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLowStockProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetLowStockThreshold() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (threshold: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setLowStockThreshold(threshold);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] });
    },
  });
}

// ─── Inquiries ────────────────────────────────────────────────────────────────

export function useGetInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<Inquiry[]>({
    queryKey: ['inquiries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: InquiryInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitInquiry(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

export function useMarkInquiryRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: InquiryId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markInquiryRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

export function useDeleteInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: InquiryId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteInquiry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}

// ─── Sales ────────────────────────────────────────────────────────────────────

export function useRecordSale() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SaleInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordSale(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['incomeStats'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] });
    },
  });
}

export function useGetSalesByDate(dayTimestamp: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Sale[]>({
    queryKey: ['sales', 'date', dayTimestamp?.toString()],
    queryFn: async () => {
      if (!actor || dayTimestamp === null) return [];
      return actor.getSalesByDate(dayTimestamp);
    },
    enabled: !!actor && !isFetching && dayTimestamp !== null,
  });
}

export function useGetSalesByMonth(year: bigint | null, month: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Sale[]>({
    queryKey: ['sales', 'month', year?.toString(), month?.toString()],
    queryFn: async () => {
      if (!actor || year === null || month === null) return [];
      return actor.getSalesByMonth(year, month);
    },
    enabled: !!actor && !isFetching && year !== null && month !== null,
  });
}

export function useGetSalesByProduct(productId: ProductId | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Sale[]>({
    queryKey: ['sales', 'product', productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === null) return [];
      return actor.getSalesByProduct(productId);
    },
    enabled: !!actor && !isFetching && productId !== null,
  });
}

// ─── Income ───────────────────────────────────────────────────────────────────

export function useGetIncomeStats() {
  const { actor, isFetching } = useActor();
  return useQuery<IncomeStats>({
    queryKey: ['incomeStats'],
    queryFn: async () => {
      if (!actor) return { totalIncome: 0, todayIncome: 0, monthlyIncome: 0 };
      return actor.getIncomeStats();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin Role ───────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
