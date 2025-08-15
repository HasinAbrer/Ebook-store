import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import getBaseUrl from "../../utils/baseURL";

import news1 from "../../assets/news/news-1.png";
import news2 from "../../assets/news/news-2.png";
import news3 from "../../assets/news/news-3.png";
import news4 from "../../assets/news/news-4.png";

// fallback images if needed
const thumbs = [news1, news2, news3, news4];

const News = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const base = getBaseUrl();
        const { data } = await axios.get(`${base}/api/news/books`, {
          // cache-bust and avoid stale cached responses
          params: { t: Date.now() },
        });
        if (!mounted) return;
        let arr = Array.isArray(data?.items) ? data.items : [];
        // Fallback to curated local items if API returns empty
        if (!arr.length) {
          arr = [
            { title: 'Author Spotlight: Rising Voices in Sci‑Fi', contentSnippet: 'Discover groundbreaking new worlds and visionary authors redefining science fiction.', link: 'https://news.google.com/search?q=books%20science%20fiction', source: 'Curated' },
            { title: 'Literary Awards Season: The Shortlist', contentSnippet: 'This year’s most talked‑about titles across fiction and non‑fiction—did your favorite make it?', link: 'https://news.google.com/search?q=literary%20awards%20books', source: 'Curated' },
            { title: 'Must‑Read Debuts This Month', contentSnippet: 'Fresh voices and unforgettable stories launching to rave early reviews.', link: 'https://news.google.com/search?q=debut%20novels', source: 'Curated' },
            { title: 'Adaptations: From Page to Screen', contentSnippet: 'The books hitting theaters and streaming—read before you watch.', link: 'https://news.google.com/search?q=book%20to%20screen%20adaptations', source: 'Curated' },
          ];
        }
        setItems(arr);
      } catch (e) {
        setError("Failed to load news");
        // Also show curated items if request fails entirely
        if (mounted) {
          setItems([
            { title: 'Author Spotlight: Rising Voices in Sci‑Fi', contentSnippet: 'Discover groundbreaking new worlds and visionary authors redefining science fiction.', link: 'https://news.google.com/search?q=books%20science%20fiction', source: 'Curated' },
            { title: 'Literary Awards Season: The Shortlist', contentSnippet: 'This year’s most talked‑about titles across fiction and non‑fiction—did your favorite make it?', link: 'https://news.google.com/search?q=literary%20awards%20books', source: 'Curated' },
            { title: 'Must‑Read Debuts This Month', contentSnippet: 'Fresh voices and unforgettable stories launching to rave early reviews.', link: 'https://news.google.com/search?q=debut%20novels', source: 'Curated' },
            { title: 'Adaptations: From Page to Screen', contentSnippet: 'The books hitting theaters and streaming—read before you watch.', link: 'https://news.google.com/search?q=book%20to%20screen%20adaptations', source: 'Curated' },
          ]);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);
  return (
    <section className="py-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="uppercase tracking-wider text-primary text-sm">Latest</p>
          <h2 className="text-3xl md:text-4xl font-bold">News & Updates</h2>
        </div>
        <Link to="/" className="text-primary hover:underline">View all</Link>
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border bg-white p-4">
              <div className="bg-gray-200 h-40 w-full mb-4 rounded" />
              <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded" />
              <div className="bg-gray-200 h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
        {(items || []).map((item, index) => (
          <article key={index} className="group h-full overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
            <div className="relative overflow-hidden">
              <img src={thumbs[index % thumbs.length]} alt="" className="h-40 w-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="p-5">
              <a href={item.link} target="_blank" rel="noreferrer noopener">
                <h3 className="text-lg font-semibold leading-snug hover:text-primary line-clamp-2 min-h-[48px]">{item.title}</h3>
              </a>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3 min-h-[60px]">{item.contentSnippet}</p>
              <p className="mt-2 text-xs text-gray-500">{item.source}</p>
              <div className="mt-4 flex items-center justify-between">
                <a href={item.link} target="_blank" rel="noreferrer noopener" className="text-sm text-primary hover:underline">Read more</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default News;
