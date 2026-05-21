import { Link } from 'react-router-dom';

export default function AccountFavoritesPage() {
  return (
    <div className="mx-auto max-w-lg space-y-8 text-center">
      <div className="text-left lg:text-center">
        <h1 className="text-[26px] font-semibold tracking-tight text-[#111827]">Favorites</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[#6b7280]">
          Save places you love and find them here later.
        </p>
      </div>

      <div className="py-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ff385c]/10 text-[#ff385c]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </div>
        <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-[#6b7280]">
          When you save a stay you love, you&apos;ll find it here. Start exploring to build your wishlist.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-lg bg-[#ff385c] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e31c5f]"
        >
          Explore stays
        </Link>
      </div>
    </div>
  );
}
