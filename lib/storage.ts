import type { Book, ReadingProgress, Bookmark } from "./types"
import { booksData } from "./books-data"

// Books
export function getBooks(): Book[] {
  return booksData
}

export function getBookById(id: string): Book | undefined {
  return booksData.find((book) => book.id === id)
}

// Favorites
const FAVORITES_KEY = "elibrary_favorites"

export function getFavorites(): string[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(FAVORITES_KEY)
  return stored ? JSON.parse(stored) : []
}

export function toggleFavorite(bookId: string): void {
  if (typeof window === "undefined") return
  const favorites = getFavorites()
  const index = favorites.indexOf(bookId)

  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(bookId)
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

export function isFavorite(bookId: string): boolean {
  return getFavorites().includes(bookId)
}

export function getFavoriteBooks(): Book[] {
  const favoriteIds = getFavorites()
  return booksData.filter((book) => favoriteIds.includes(book.id))
}

// Reading Progress
const PROGRESS_KEY = "elibrary_progress"

export function getProgress(bookId: string): ReadingProgress | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem(PROGRESS_KEY)
  const allProgress: Record<string, ReadingProgress> = stored ? JSON.parse(stored) : {}
  return allProgress[bookId] || null
}

export function saveProgress(progress: ReadingProgress): void {
  if (typeof window === "undefined") return
  const stored = localStorage.getItem(PROGRESS_KEY)
  const allProgress: Record<string, ReadingProgress> = stored ? JSON.parse(stored) : {}
  allProgress[progress.bookId] = progress
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress))
}

export function getAllProgress(): ReadingProgress[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(PROGRESS_KEY)
  const allProgress: Record<string, ReadingProgress> = stored ? JSON.parse(stored) : {}
  return Object.values(allProgress)
}

// Bookmarks
const BOOKMARKS_KEY = "elibrary_bookmarks"

export function getBookmarks(bookId: string): Bookmark[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(BOOKMARKS_KEY)
  const allBookmarks: Bookmark[] = stored ? JSON.parse(stored) : []
  return allBookmarks.filter((b) => b.bookId === bookId)
}

export function addBookmark(bookmark: Omit<Bookmark, "id" | "createdAt">): void {
  if (typeof window === "undefined") return
  const stored = localStorage.getItem(BOOKMARKS_KEY)
  const allBookmarks: Bookmark[] = stored ? JSON.parse(stored) : []

  const newBookmark: Bookmark = {
    ...bookmark,
    id: `bookmark_${Date.now()}_${Math.random()}`,
    createdAt: new Date().toISOString(),
  }

  allBookmarks.push(newBookmark)
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(allBookmarks))
}

export function deleteBookmark(bookmarkId: string): void {
  if (typeof window === "undefined") return
  const stored = localStorage.getItem(BOOKMARKS_KEY)
  const allBookmarks: Bookmark[] = stored ? JSON.parse(stored) : []
  const filtered = allBookmarks.filter((b) => b.id !== bookmarkId)
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered))
}

export function getAllBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(BOOKMARKS_KEY)
  return stored ? JSON.parse(stored) : []
}
