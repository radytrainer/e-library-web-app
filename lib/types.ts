export interface Book {
  id: string
  title: string
  author: string
  category: string
  description: string
  coverUrl: string
  pdfUrl: string
  rating: number
  pages: number
}

export interface ReadingProgress {
  bookId: string
  currentPage: number
  totalPages: number
  lastRead: string
  progress: number
}

export interface Bookmark {
  id: string
  bookId: string
  page: number
  note: string
  createdAt: string
}
