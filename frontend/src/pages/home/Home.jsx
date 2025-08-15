import React from 'react'
import Banner from './Banner'
import TrendingCategories from './TrendingCategories'
import TopSellers from './TopSellers'
import Recommended from './Recommended'
import News from './News'

const Home = () => {
  return (
    <div className='max-w-screen-2xl mx-auto px-4'>
      <Banner/>
      <TrendingCategories/>
      <TopSellers/>
      <Recommended/>

      {/* CTA strip */}
      <section className='my-16 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-violet-50 p-6 md:p-10'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          <div>
            <h3 className='text-2xl md:text-3xl font-bold'>Never miss a great read</h3>
            <p className='mt-2 text-gray-600'>Subscribe for curated book picks, deals, and news—delivered weekly.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className='flex w-full md:w-auto items-center gap-3'
          >
            <input type='email' required placeholder='Enter your email' className='w-full md:w-80 rounded-lg border border-gray-200 bg-white px-4 py-3 focus:outline-none' />
            <button className='rounded-lg bg-primary px-5 py-3 font-medium text-white hover:opacity-90'>Subscribe</button>
          </form>
        </div>
      </section>

      <News/>
    </div>
  )
}

export default Home;