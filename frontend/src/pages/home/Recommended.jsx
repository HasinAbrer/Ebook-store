import React from "react";
// Static grid (no carousel)
import { useFetchRecommendedBooksQuery } from "../../redux/features/books/booksApi";

import BookCard from "../books/BookCard";

const Recommended = () => {
  const FALLBACK_RECOMMENDED = [
    { _id: 'rec-en-1', title: 'The Psychology of Money', description: 'Timeless lessons on wealth, greed, and happiness.', category: 'Finance', newPrice: 9.49, imageUrl: 'https://covers.openlibrary.org/b/id/12609263-L.jpg' },
    { _id: 'rec-en-2', title: 'Rich Dad Poor Dad', description: 'What the rich teach their kids about money.', category: 'Finance', newPrice: 8.99, imageUrl: 'https://covers.openlibrary.org/b/id/8641702-L.jpg' },
    { _id: 'rec-bn-1', title: 'হিমু (Himu)', description: 'হুমায়ূন আহমেদের কালজয়ী চরিত্র।', category: 'Bangla', newPrice: 4.99, imageUrl: 'https://covers.openlibrary.org/b/id/12721450-L.jpg' },
    { _id: 'rec-en-3', title: 'The Midnight Library', description: 'Between life and death there is a library.', category: 'Fiction', newPrice: 7.99, imageUrl: 'https://covers.openlibrary.org/b/id/10584759-L.jpg' },
    { _id: 'rec-bn-2', title: 'লালশালু (Lalsalu)', description: 'সৈয়দ ওয়ালীউল্লাহর শক্তিশালী উপন্যাস।', category: 'Bangla', newPrice: 4.79, imageUrl: 'https://covers.openlibrary.org/b/id/12721442-L.jpg' },
    { _id: 'rec-en-4', title: 'The Kite Runner', description: 'A powerful story of friendship and redemption.', category: 'Fiction', newPrice: 7.49, imageUrl: 'https://covers.openlibrary.org/b/id/8235116-L.jpg' },
  ];
  const { data, isLoading, isError } = useFetchRecommendedBooksQuery({ limit: 10 });
  const rec = Array.isArray(data?.items) ? data.items : [];

  return (
    <section className="py-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="uppercase tracking-wider text-primary text-sm">Hand‑picked</p>
          <h2 className="text-3xl md:text-4xl font-bold">Recommended for you</h2>
        </div>
      </div>

      {isError && <p className="text-red-500">Failed to load recommended books.</p>}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse border rounded-xl p-4">
              <div className="bg-gray-200 h-40 w-full mb-4 rounded" />
              <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded" />
              <div className="bg-gray-200 h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : (rec && rec.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {rec.map((book, idx) => (
            <BookCard key={book?._id || idx} book={book} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {FALLBACK_RECOMMENDED.map((book, idx) => (
            <BookCard key={book?._id || idx} book={book} />
          ))}
        </div>
      ))}
    </section>
  );
};

export default Recommended;
