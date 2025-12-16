"use client"

import { useState, useEffect } from "react"
import { Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getFavoriteBooks, toggleFavorite } from "@/lib/storage"
import type { Book } from "@/lib/types"

export default function FavoritesPage() {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([])

  useEffect(() => {
    setFavoriteBooks(getFavoriteBooks())
  }, [])

  const handleRemoveFavorite = (bookId: string) => {
    toggleFavorite(bookId)
    setFavoriteBooks(getFavoriteBooks())
  }

  return (
    <main className="min-h-screen bg-library-dark">
      <header className="border-b border-library-border bg-library-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-library-light">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-library-accent fill-library-accent" />
              <h1 className="text-3xl font-bold text-library-light">My Favorites</h1>
            </div>
          </div>
          <p className="text-library-muted">
            {favoriteBooks.length} {favoriteBooks.length === 1 ? "book" : "books"} saved
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {favoriteBooks.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-library-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-library-light mb-2">No favorites yet</h3>
            <p className="text-library-muted mb-6">Start adding books to your favorites collection</p>
            <Link href="/">
              <Button className="bg-library-accent hover:bg-library-accent/90 text-library-dark">Browse Books</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteBooks.map((book) => (
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
                    onClick={() => handleRemoveFavorite(book.id)}
                    className="absolute top-2 right-2 bg-library-dark/80 hover:bg-library-dark backdrop-blur-sm"
                  >
                    <Heart className="w-4 h-4 fill-library-accent text-library-accent" />
                  </Button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-library-light line-clamp-2 mb-2 text-balance">{book.title}</h3>
                  <p className="text-sm text-library-muted mb-3">{book.author}</p>

                  <Badge variant="secondary" className="bg-library-muted/30 text-library-light border-0 mb-4">
                    {book.category}
                  </Badge>

                  <Link href={`/reader/${book.id}`}>
                    <Button className="w-full bg-library-accent hover:bg-library-accent/90 text-library-dark font-medium">
                      Read Now
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
