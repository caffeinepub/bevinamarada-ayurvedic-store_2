import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface InquiryInput {
    name: string;
    productId?: ProductId;
    message: string;
    phone: string;
}
export interface ProductInput {
    stockQuantity: bigint;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    price: number;
}
export type InquiryId = bigint;
export interface Inquiry {
    id: InquiryId;
    name: string;
    productId?: ProductId;
    isRead: boolean;
    message: string;
    timestamp: bigint;
    phone: string;
}
export interface IncomeStats {
    todayIncome: number;
    totalIncome: number;
    monthlyIncome: number;
}
export interface SaleInput {
    customerName?: string;
    productId: ProductId;
    quantity: bigint;
    phone?: string;
}
export type SaleId = bigint;
export interface Sale {
    id: SaleId;
    customerName?: string;
    productId: ProductId;
    productName: string;
    pricePerUnit: number;
    totalAmount: number;
    quantity: bigint;
    phone?: string;
    saleDate: bigint;
}
export type ProductId = bigint;
export interface UserProfile {
    name: string;
}
export interface Product {
    id: ProductId;
    status: ProductStatus;
    stockQuantity: bigint;
    name: string;
    description: string;
    imageUrl: string;
    isHidden: boolean;
    category: string;
    price: number;
}
export enum ProductStatus {
    inStock = "inStock",
    outOfStock = "outOfStock"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(product: ProductInput): Promise<ProductId>;
    deleteInquiry(id: InquiryId): Promise<void>;
    deleteProduct(id: ProductId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getIncomeStats(): Promise<IncomeStats>;
    getInquiries(): Promise<Array<Inquiry>>;
    getLowStockProducts(): Promise<Array<Product>>;
    getMonthlyIncome(): Promise<number>;
    getProductById(id: ProductId): Promise<Product | null>;
    getProducts(hideOutOfStock: boolean): Promise<Array<Product>>;
    getSalesByDate(dayTimestamp: bigint): Promise<Array<Sale>>;
    getSalesByMonth(year: bigint, month: bigint): Promise<Array<Sale>>;
    getSalesByProduct(productId: ProductId): Promise<Array<Sale>>;
    getTodayIncome(): Promise<number>;
    getTotalIncome(): Promise<number>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markInquiryRead(id: InquiryId): Promise<void>;
    recordSale(input: SaleInput): Promise<SaleId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setLowStockThreshold(newThreshold: bigint): Promise<void>;
    submitInquiry(input: InquiryInput): Promise<InquiryId>;
    updateProduct(id: ProductId, product: ProductInput): Promise<void>;
}
