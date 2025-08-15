import React from 'react'
import bannerImg from "../../assets/banner.png"; // Assuming you have a banner image
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className='max-w-screen-2xl mx-auto px-4'>
        <div className='flex flex-col md:flex-row py-16 md:py-24 justify-between items-center gap-10'>
          <div className='md:w-1/2 w-full'>
            <p className='uppercase tracking-wider text-white/80 text-sm mb-3'>Read smarter, live better</p>
            <h1 className='leading-tight font-bold text-3xl sm:text-5xl md:text-6xl'>Discover Your Next Favorite Book</h1>
            <p className='mt-5 text-white/90 max-w-xl'>Browse bestsellers, trending picks, and hand‑picked recommendations. Find stories that inspire, teach, and entertain—anytime, anywhere.</p>

            <div className='mt-8 flex flex-wrap gap-3'>
              <Link to="/search?sort=totalSold:desc" className='inline-flex items-center gap-2 rounded-lg bg-white text-indigo-700 px-5 py-2.5 font-medium shadow/50 shadow-white/10 hover:bg-white/90'>
                Shop Bestsellers
              </Link>
              <Link to="/search" className='inline-flex items-center gap-2 rounded-lg bg-white/15 backdrop-blur px-5 py-2.5 font-medium text-white hover:bg-white/25 border border-white/20'>
                Explore Categories
              </Link>
            </div>

            <div className='mt-10 grid grid-cols-3 gap-4 text-center'>
              <div className='rounded-xl bg-white/10 p-4'>
                <div className='text-2xl font-bold'>10k+</div>
                <div className='text-white/80 text-sm'>Happy Readers</div>
              </div>
              <div className='rounded-xl bg-white/10 p-4'>
                <div className='text-2xl font-bold'>2k+</div>
                <div className='text-white/80 text-sm'>Titles</div>
              </div>
              <div className='rounded-xl bg-white/10 p-4'>
                <div className='text-2xl font-bold'>4.8★</div>
                <div className='text-white/80 text-sm'>Avg. Rating</div>
              </div>
            </div>
          </div>

          <div className='md:w-1/2 w-full flex items-center md:justify-end'>
            <img className='w-[520px] max-w-full drop-shadow-2xl' src={bannerImg} alt="Banner" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner;
