import React, { useEffect, useMemo, useState } from 'react';
import { useSearchBooksQuery, useFetchCategoriesQuery } from '../../redux/features/books/booksApi';
import { useSearchParams } from 'react-router-dom';
import BookCard from './BookCard';

export default function Search() {
  const { data: categoriesData, isLoading: catsLoading } = useFetchCategoriesQuery();
  const categories = ['All', ...(Array.isArray(categoriesData) ? categoriesData : [])];
  const [searchParams, setSearchParams] = useSearchParams();

  // initialize from URL
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('cat') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'createdAt:desc');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [limit, setLimit] = useState(Number(searchParams.get('limit') || 12));

  // debounce query to reduce requests while typing
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  const params = useMemo(() => ({
    query: debouncedQuery,
    category: category === 'All' ? undefined : category,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    sort,
    page,
    limit,
  }), [debouncedQuery, category, minPrice, maxPrice, sort, page, limit]);

  const { data, isLoading, isError } = useSearchBooksQuery(params);
  const items = Array.isArray(data?.items) ? data.items : [];
  const total = Number(data?.total || 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  // sync state -> URL
  useEffect(() => {
    const sp = new URLSearchParams();
    if (query) sp.set('q', query);
    if (category && category !== 'All') sp.set('cat', category);
    if (minPrice) sp.set('min', String(minPrice));
    if (maxPrice) sp.set('max', String(maxPrice));
    if (sort) sp.set('sort', sort);
    if (page && page !== 1) sp.set('page', String(page));
    if (limit && limit !== 12) sp.set('limit', String(limit));
    setSearchParams(sp);
  }, [query, category, minPrice, maxPrice, sort, page, limit, setSearchParams]);

  return (
    <div className="py-10">
      <h2 className="text-3xl font-semibold mb-6">Search Books</h2>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-6 gap-3 items-end mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Query</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)}
                 className="w-full border rounded px-3 py-2" placeholder="Title, description..." />
        </div>
        <div>
          <label className="block text-sm mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Min Price</label>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Max Price</label>
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="createdAt:desc">Newest</option>
            <option value="createdAt:asc">Oldest</option>
            <option value="newPrice:asc">Price: Low to High</option>
            <option value="newPrice:desc">Price: High to Low</option>
            <option value="ratingAvg:desc">Rating</option>
            <option value="totalSold:desc">Top Sold</option>
          </select>
        </div>
        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Search</button>
        </div>
      </form>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse border rounded p-4">
              <div className="bg-gray-200 h-40 w-full mb-4" />
              <div className="bg-gray-200 h-4 w-3/4 mb-2" />
              <div className="bg-gray-200 h-4 w-1/2" />
            </div>
          ))}
        </div>
      )}
      {isError && <p className="text-red-500">Failed to load results.</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((book, idx) => (
          <BookCard key={idx} book={book} />
        ))}
      </div>

      {!isLoading && items.length === 0 && (
        <p className="mt-6">No results found.</p>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >Prev</button>
          <span className="px-2">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >Next</button>
        </div>
        <div>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-2">
            {[6, 12, 24].map((n) => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
