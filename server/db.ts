import { users, posts, products, orders, transactions, wallets } from "../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";

// Mock database instance
const mockDb = {};

// Export db for backward compatibility
export const db = mockDb;

// Export getDb function for other files
export async function getDb() {
  return mockDb;
}

// Mock database functions - these will be replaced with real DB calls
// For now, returning mock data to get the app running

// ============ USER HELPERS ============
export async function getUserById(id: string) {
  return { id, name: "User", email: "user@example.com", balance: 0 };
}

export async function getUserByEmail(email: string) {
  return { id: "1", name: "User", email, balance: 0 };
}

export async function createUser(data: any) {
  return { id: "1", ...data };
}

export async function updateUserBalance(userId: string, amount: number) {
  return { success: true };
}

// ============ POST HELPERS ============
export async function getPosts(limit = 20, offset = 0) {
  return [];
}

export async function getPostsByUser(userId: string) {
  return [];
}

export async function createPost(userId: string, content: string, media?: string) {
  return { id: "1", userId, content, media };
}

// ============ PRODUCT HELPERS ============
export async function getProducts(limit = 20, category?: string) {
  return [];
}

export async function getProductById(id: string) {
  return null;
}

export async function createProduct(data: any) {
  return { id: "1", ...data };
}

// ============ ORDER HELPERS ============
export async function getOrders(userId: string) {
  return [];
}

export async function createOrder(userId: string, productId: string, quantity: number) {
  return { id: "1", userId, productId, quantity };
}

export async function updateOrderStatus(orderId: string, status: string) {
  return { success: true };
}

// ============ TRANSACTION HELPERS ============
export async function getTransactions(userId: string) {
  return [];
}

export async function createTransaction(data: any) {
  return { id: "1", ...data };
}

// ============ WALLET HELPERS ============
export async function getWallet(userId: string) {
  return { userId, balance: 0, address: "" };
}

export async function updateWallet(userId: string, balance: number) {
  return { success: true };
}

// ============ COMMENT HELPERS ============
export async function getComments(postId: string) {
  return [];
}

export async function createComment(postId: string, userId: string, content: string) {
  return { id: "1", postId, userId, content };
}

// ============ LIKE HELPERS ============
export async function getLikes(postId: string) {
  return [];
}

export async function createLike(postId: string, userId: string) {
  return { success: true };
}

export async function removeLike(postId: string, userId: string) {
  return { success: true };
}

// ============ FOLLOW HELPERS ============
export async function getFollowers(userId: string) {
  return [];
}

export async function getFollowing(userId: string) {
  return [];
}

export async function createFollow(followerId: string, followingId: string) {
  return { success: true };
}

export async function removeFollow(followerId: string, followingId: string) {
  return { success: true };
}

// ============ NOTIFICATION HELPERS ============
export async function getNotifications(userId: string) {
  return [];
}

export async function createNotification(userId: string, type: string, content: string) {
  return { id: "1", userId, type, content };
}

export async function markNotificationAsRead(notificationId: string) {
  return { success: true };
}

// ============ MESSAGE HELPERS ============
export async function getMessages(userId: string) {
  return [];
}

export async function createMessage(senderId: string, recipientId: string, content: string) {
  return { id: "1", senderId, recipientId, content };
}

// ============ REVIEW HELPERS ============
export async function getReviews(productId: string) {
  return [];
}

export async function createReview(productId: string, userId: string, rating: number, content: string) {
  return { id: "1", productId, userId, rating, content };
}

// ============ STREAM HELPERS ============
export async function getStreams(limit = 20) {
  return [];
}

export async function createStream(userId: string, title: string, description: string) {
  return { id: "1", userId, title, description };
}

export async function updateStreamStatus(streamId: string, status: string) {
  return { success: true };
}

// ============ SEARCH HELPERS ============
export async function searchUsers(query: string) {
  return [];
}

export async function searchProducts(query: string) {
  return [];
}

export async function searchPosts(query: string) {
  return [];
}
