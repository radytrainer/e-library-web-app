"use client"

import { useState, useEffect, use } from "react"
import { ArrowLeft, BookOpen, Bookmark, Heart, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import {
  getBookById,
  getProgress,
  saveProgress,
  getBookmarks,
  addBookmark,
  deleteBookmark,
  toggleFavorite,
  isFavorite,
} from "@/lib/storage"
import type { Book, Bookmark as BookmarkType } from "@/lib/types"

export default function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [book, setBook] = useState<Book | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([])
  const [newBookmarkNote, setNewBookmarkNote] = useState("")
  const [favorite, setFavorite] = useState(false)

  useEffect(() => {
    const foundBook = getBookById(id)
    if (foundBook) {
      setBook(foundBook)
      setFavorite(isFavorite(id))

      // Load progress
      const progress = getProgress(id)
      if (progress) {
        setCurrentPage(progress.currentPage)
      }

      // Load bookmarks
      setBookmarks(getBookmarks(id))
    }
  }, [id])

  useEffect(() => {
    if (book) {
      // Save progress whenever page changes
      saveProgress({
        bookId: id,
        currentPage,
        totalPages: book.pages,
        lastRead: new Date().toISOString(),
        progress: Math.round((currentPage / book.pages) * 100),
      })
    }
  }, [currentPage, book, id])

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (book && currentPage < book.pages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 10)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 10)
    }
  }

  const handleAddBookmark = () => {
    if (newBookmarkNote.trim()) {
      addBookmark({
        bookId: id,
        page: currentPage,
        note: newBookmarkNote,
      })
      setBookmarks(getBookmarks(id))
      setNewBookmarkNote("")
    }
  }

  const handleDeleteBookmark = (bookmarkId: string) => {
    deleteBookmark(bookmarkId)
    setBookmarks(getBookmarks(id))
  }

  const handleToggleFavorite = () => {
    toggleFavorite(id)
    setFavorite(!favorite)
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-library-dark flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-library-muted mx-auto mb-4" />
          <p className="text-library-light text-xl">Book not found</p>
          <Link href="/">
            <Button className="mt-4 bg-library-accent hover:bg-library-accent/90 text-library-dark">
              Back to Library
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const progress = Math.round((currentPage / book.pages) * 100)

  return (
    <div className="min-h-screen bg-library-dark flex flex-col">
      {/* Header */}
      <header className="border-b border-library-border bg-library-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-library-light hover:bg-library-muted/20">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-library-light text-balance">{book.title}</h1>
                <p className="text-sm text-library-muted">{book.author}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                className="text-library-light hover:bg-library-muted/20"
              >
                <Heart className={`w-5 h-5 ${favorite ? "fill-library-accent text-library-accent" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBookmarks(!showBookmarks)}
                className="text-library-light hover:bg-library-muted/20"
              >
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-library-muted mb-2">
              <span>
                Page {currentPage} of {book.pages}
              </span>
              <span>{progress}% complete</span>
            </div>
            <div className="w-full h-2 bg-library-muted/20 rounded-full overflow-hidden">
              <div className="h-full bg-library-accent transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* PDF Viewer */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-library-border bg-library-card/30 px-4 py-3">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="text-library-light hover:bg-library-muted/20 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Input
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const page = Number.parseInt(e.target.value)
                    if (page >= 1 && page <= book.pages) {
                      setCurrentPage(page)
                    }
                  }}
                  className="w-20 text-center bg-library-muted/20 border-library-border text-library-light"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={currentPage === book.pages}
                  className="text-library-light hover:bg-library-muted/20 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom === 50}
                  className="text-library-light hover:bg-library-muted/20 disabled:opacity-50"
                >
                  <ZoomOut className="w-5 h-5" />
                </Button>
                <span className="text-library-light text-sm w-12 text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom === 200}
                  className="text-library-light hover:bg-library-muted/20 disabled:opacity-50"
                >
                  <ZoomIn className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* PDF Content Area */}
          <ScrollArea className="flex-1">
            <div className="container mx-auto px-4 py-8">
              <Card
                className="mx-auto bg-white shadow-2xl overflow-hidden"
                style={{
                  width: `${zoom}%`,
                  maxWidth: "900px",
                  minHeight: "1200px",
                }}
              >
                <div className="p-12">
                  <div className="prose prose-lg max-w-none">
                    <h1 className="text-4xl font-bold mb-8 text-gray-900">{book.title}</h1>
                    <h2 className="text-2xl text-gray-700 mb-12">by {book.author}</h2>

                    <div className="text-gray-800 leading-relaxed space-y-6">
                      <p className="text-lg first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-gray-900">
                        This is a simulated PDF reader displaying page {currentPage} of {book.pages}. In a production
                        environment, you would integrate a PDF.js library or similar solution to render actual PDF
                        files.
                      </p>

                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat.
                      </p>

                      <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                        mollit anim id est laborum.
                      </p>

                      <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                        beatae vitae dicta sunt explicabo.
                      </p>

                      <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">Chapter Content</h3>

                      <p>
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                        consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                        qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                      </p>

                      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-8 text-gray-700">
                        "This is a sample quote from the book. It demonstrates how the text would appear in a formatted
                        PDF document with proper styling and layout."
                      </blockquote>

                      <p>
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                        deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
                        provident.
                      </p>

                      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                        Page {currentPage}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </ScrollArea>
        </div>

        {/* Bookmarks Sidebar */}
        {showBookmarks && (
          <div className="w-80 border-l border-library-border bg-library-card/50 backdrop-blur-sm flex flex-col">
            <div className="p-4 border-b border-library-border">
              <h2 className="text-lg font-semibold text-library-light flex items-center gap-2">
                <Bookmark className="w-5 h-5" />
                Bookmarks
              </h2>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {bookmarks.map((bookmark) => (
                  <Card key={bookmark.id} className="p-3 bg-library-muted/20 border-library-border">
                    <div className="flex items-start justify-between mb-2">
                      <button
                        onClick={() => setCurrentPage(bookmark.page)}
                        className="text-sm font-medium text-library-accent hover:underline"
                      >
                        Page {bookmark.page}
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteBookmark(bookmark.id)}
                        className="h-6 w-6 text-library-muted hover:text-library-light"
                      >
                        ×
                      </Button>
                    </div>
                    {bookmark.note && <p className="text-sm text-library-light">{bookmark.note}</p>}
                    <p className="text-xs text-library-muted mt-2">
                      {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                  </Card>
                ))}

                {bookmarks.length === 0 && (
                  <div className="text-center py-8">
                    <Bookmark className="w-12 h-12 text-library-muted mx-auto mb-3" />
                    <p className="text-sm text-library-muted">No bookmarks yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-library-border space-y-2">
              <Textarea
                placeholder="Add a note (optional)"
                value={newBookmarkNote}
                onChange={(e) => setNewBookmarkNote(e.target.value)}
                className="bg-library-muted/20 border-library-border text-library-light placeholder:text-library-muted/70 resize-none"
                rows={3}
              />
              <Button
                onClick={handleAddBookmark}
                className="w-full bg-library-accent hover:bg-library-accent/90 text-library-dark"
              >
                Bookmark Current Page
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
