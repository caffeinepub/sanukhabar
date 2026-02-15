import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ArticleState {
    id: ArticleId;
    title: string;
    content: string;
    publishedAt: Time;
    author: string;
    imageUrl?: string;
    category: CategoryId;
}
export type Time = bigint;
export type CategoryId = bigint;
export interface ArticleInput {
    title: string;
    content: string;
    author: string;
    imageUrl?: string;
    category: CategoryId;
}
export type ArticleId = bigint;
export interface UserProfile {
    name: string;
}
export interface Category {
    id: CategoryId;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createArticle(input: ArticleInput): Promise<ArticleId>;
    createCategory(name: string): Promise<CategoryId>;
    deleteArticle(id: ArticleId): Promise<void>;
    deleteCategory(id: CategoryId): Promise<void>;
    getArticle(id: ArticleId): Promise<ArticleState>;
    getArticles(): Promise<Array<ArticleState>>;
    getArticlesByCategory(categoryId: CategoryId): Promise<Array<ArticleState>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateArticle(id: ArticleId, input: ArticleInput): Promise<void>;
    updateCategory(id: CategoryId, name: string): Promise<void>;
}
