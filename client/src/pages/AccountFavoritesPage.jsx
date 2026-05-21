import { Link } from 'react-router-dom';

export default function AccountFavoritesPage() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-[26px] font-semibold leading-tight text-[#111827] sm:text-[32px]">
          Favorites
        </h2>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#6b7280]">
          Save places you love and find them here later.
        </p>
      </header>

      <div className="flex flex-col items-center rounded-[20px] border border-[#e5e7eb] bg-white px-6 py-16 text-center shadow-[0_2px_16px_rgba(15,23,42,0.05)]">
        <p className="max-w-md text-[15px] leading-relaxed text-[#6b7280]">
          You haven&apos;t saved any favorites yet. Explore stays and add them to your wishlist.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-lg bg-[#ff385c] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e31c5f]"
        >
          Explore stays
        </Link>
      </div>
    </div>
  );
}
