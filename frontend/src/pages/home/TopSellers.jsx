import React, { useState } from "react";
import BookCard from "../books/BookCard";
import { useFetchTopBooksQuery, useFetchCategoriesQuery } from "../../redux/features/books/booksApi";
// Static grid (no carousel)

const TopSellers = () => {

  const FALLBACK_TOP = [
    { _id: 'bn-1', title: 'শঙ্খনীল কারাগার (Shonkhonil Karagar)', description: 'হুমায়ূন আহমেদের জনপ্রিয় উপন্যাস।', category: 'Bangla', newPrice: 4.99, imageUrl: '/images/books-1.png' },
    { _id: 'bn-2', title: 'পথের পাঁচালী (Pather Panchali)', description: 'বিভূতিভূষণ বন্দ্যোপাধ্যায়ের শ্রেষ্ঠ সৃষ্টি।', category: 'Bangla', newPrice: 5.99, imageUrl: '/images/books-2.png' },
    { _id: 'bn-3', title: 'দেবদাস (Devdas)', description: 'শরৎচন্দ্র চট্টোপাধ্যায়ের অমর প্রেমকাহিনী।', category: 'Bangla', newPrice: 3.99, imageUrl: '/images/books-3.png' },
    { _id: 'en-1', title: 'The Alchemist', description: 'A fable about following your dream by Paulo Coelho.', category: 'Fiction', newPrice: 7.99, imageUrl: '/images/books-4.png' },
    { _id: 'en-2', title: 'Atomic Habits', description: 'Tiny changes, remarkable results by James Clear.', category: 'Self Help', newPrice: 9.99, imageUrl: '/images/books-5.png' },
    { _id: 'en-3', title: "Harry Potter and the Sorcerer's Stone", description: 'The first book in the Harry Potter series.', category: 'Fantasy', newPrice: 8.99, imageUrl: '/images/books-6.png' },
    { _id: 'en-4', title: 'The Subtle Art of Not Giving a F*ck', description: 'A counterintuitive approach to living a good life.', category: 'Nonfiction', newPrice: 8.49, imageUrl: '/images/books-7.png' },
    { _id: 'en-5', title: 'Sapiens: A Brief History of Humankind', description: 'Yuval Noah Harari on the history of us.', category: 'History', newPrice: 10.99, imageUrl: '/images/books-8.png' },
    { _id: 'bn-4', title: 'কপালকুণ্ডলা (Kapal Kundala)', description: 'বঙ্কিমচন্দ্র চট্টোপাধ্যায়ের বিখ্যাত উপন্যাস।', category: 'Bangla', newPrice: 4.49, imageUrl: '/images/books-9.png' },
    { _id: 'bn-5', title: 'ফেলুদা সমগ্র (Feluda Omnibus)', description: 'সত্যজিৎ রায়ের গোয়েন্দা গল্প।', category: 'Bangla', newPrice: 6.99, imageUrl: '/images/books-10.png' },
    { _id: 'en-6', title: 'To Kill a Mockingbird', description: "Harper Lee's classic novel of justice and race.", category: 'Fiction', newPrice: 7.49, imageUrl: '/images/books-11.png' },
    { _id: 'en-7', title: '1984', description: "George Orwell's dystopian masterpiece.", category: 'Fiction', newPrice: 6.99, imageUrl: '/images/books-12.png' },
  ];

  const [selectedCategory, setSelectedCategory] = useState("Choose a genre");
  const { data, isLoading, isError } = useFetchTopBooksQuery(12);
  const { data: categoriesData } = useFetchCategoriesQuery();

  const categories = ["Choose a genre", ...(Array.isArray(categoriesData) ? categoriesData : [])];

  const books = Array.isArray(data?.items) ? data.items : [];

  const filteredBooks =
    selectedCategory !== "Choose a genre"
      ? books.filter(
          (book) =>
            book?.category &&
            book.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      : books;

  const displayBooks = (filteredBooks && filteredBooks.length > 0)
    ? filteredBooks
    : FALLBACK_TOP;

  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="uppercase tracking-wider text-primary text-sm">Bestsellers</p>
          <h2 className="text-3xl md:text-4xl font-bold">Top Sellers</h2>
        </div>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((cat, idx) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full border transition ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {isError && <p className="text-red-500">Failed to load books.</p>}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse border rounded-xl p-4">
              <div className="bg-gray-200 h-40 w-full mb-4 rounded" />
              <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded" />
              <div className="bg-gray-200 h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : displayBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {displayBooks.map((book, idx) => (
            <BookCard key={book?._id || idx} book={book} />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-gray-500">No books found.</div>
      )}
    </section>
  );
};

export default TopSellers;
