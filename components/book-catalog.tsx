"use client"

import { useState, useEffect } from "react"
import { Search, BookOpen, Heart, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getBooks, toggleFavorite, isFavorite } from "@/lib/storage"
import type { Book } from "@/lib/types"

export function BookCatalog() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    const allBooks = getBooks()
    setBooks(allBooks)

    // Load favorites
    const favSet = new Set<string>()
    allBooks.forEach((book) => {
      if (isFavorite(book.id)) {
        favSet.add(book.id)
      }
    })
    setFavorites(favSet)
  }, [])

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleToggleFavorite = (bookId: string) => {
    toggleFavorite(bookId)
    setFavorites((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(bookId)) {
        newSet.delete(bookId)
      } else {
        newSet.add(bookId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-library-dark">
      {/* Header */}
      <header className="border-b border-library-border bg-library-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-library-accent flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-library-dark" />
              </div>
              <h1 className="text-3xl font-bold text-library-light">E-Library</h1>
            </div>
            <Link href="/favorites">
              <Button
                variant="outline"
                className="gap-2 border-library-border hover:bg-library-muted/50 bg-transparent"
              >
                <Heart className="w-4 h-4" />
                My Favorites
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-library-muted" />
            <Input
              type="text"
              placeholder="Search books by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-library-muted/30 border-library-border text-library-light placeholder:text-library-muted/70"
            />
          </div>
        </div>
      </header>

      {/* Book Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-library-muted">
            Showing {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="group overflow-hidden bg-library-card border-library-border hover:border-library-accent/50 transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-library-muted/20">
                <img
                  src={book.coverUrl || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleToggleFavorite(book.id)}
                  className="absolute top-2 right-2 bg-library-dark/80 hover:bg-library-dark backdrop-blur-sm"
                >
                  <Heart
                    className={`w-4 h-4 ${favorites.has(book.id) ? "fill-library-accent text-library-accent" : "text-library-light"}`}
                  />
                </Button>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-library-light line-clamp-2 text-balance">{book.title}</h3>
                </div>

                <p className="text-sm text-library-muted mb-3">{book.author}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-library-muted/30 text-library-light border-0">
                    {book.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-library-accent">
                    <Star className="w-3 h-3 fill-library-accent" />
                    <span className="text-xs font-medium">{book.rating}</span>
                  </div>
                </div>

                <p className="text-xs text-library-muted/80 mb-4 line-clamp-2">{book.description}</p>

                <Link href={`/reader/${book.id}`}>
                  <Button className="w-full bg-library-accent hover:bg-library-accent/90 text-library-dark font-medium">
                    Read Now
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-library-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-library-light mb-2">No books found</h3>
            <p className="text-library-muted">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}
