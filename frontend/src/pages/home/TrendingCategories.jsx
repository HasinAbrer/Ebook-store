import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchCategoriesQuery } from '../../redux/features/books/booksApi';
import { LuBookOpen, LuFeather, LuPenTool, LuSparkles, LuLibrary, LuBookMarked, LuScroll, LuBookCopy } from 'react-icons/lu';

const iconPool = [LuBookOpen, LuFeather, LuPenTool, LuSparkles, LuLibrary, LuBookMarked, LuScroll, LuBookCopy];

export default function TrendingCategories() {
  const { data: categoriesData = [], isLoading, isError } = useFetchCategoriesQuery();
  const categories = Array.isArray(categoriesData) ? categoriesData.slice(0, 8) : [];

  return (
    <section className="py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="uppercase tracking-wider text-primary text-sm">Discover</p>
          <h2 className="text-3xl md:text-4xl font-bold">Trending Categories</h2>
        </div>
      </div>

      {isError && <p className="text-red-500">Failed to load categories.</p>}

      {isLoading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border bg-white p-5">
              <div className="h-10 w-10 rounded-full bg-gray-200 mb-3" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const Icon = iconPool[idx % iconPool.length];
            return (
              <Link
                key={cat}
                to={`/search?cat=${encodeURIComponent(cat)}`}
                className="group block rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="text-xl" />
                  </div>
                  <div>
                    <div className="font-semibold group-hover:text-primary">{cat}</div>
                    <div className="text-sm text-gray-500">Browse books</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
