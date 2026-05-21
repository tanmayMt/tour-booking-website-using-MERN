import { useContext, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from './UserContext';
import AccountSidebar from './AccountSidebar';

function getPageTitle(pathname) {
  if (pathname === '/account') return 'My Profile';
  if (pathname === '/account/places') return 'My Accommodations';
  if (pathname.startsWith('/account/bookings')) return 'Bookings';
  if (pathname.startsWith('/account/favorites')) return 'Favorites';
  if (pathname.startsWith('/account/settings')) return 'Settings';
  return 'Profile';
}

export default function AccountLayout() {
  const { ready, user } = useContext(UserContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-[#ff385c] border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (ready && !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="-mx-4 min-h-[calc(100vh-5rem)] bg-white px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:bg-[#f8fafc] lg:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col lg:min-h-[calc(100vh-8rem)] lg:flex-row lg:gap-10 lg:py-8">
        {/* Mobile menu bar */}
        <div className="sticky top-0 z-30 -mx-4 flex items-center gap-3 border-b border-[#e5e7eb] bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center rounded-lg border border-[#e5e7eb] p-2 text-[#111827]"
            aria-label="Open account menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-[#111827]">{getPageTitle(pathname)}</span>
        </div>

        <AccountSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <main className="min-w-0 flex-1 bg-white pb-10 pt-6 lg:rounded-[20px] lg:border lg:border-[#e5e7eb] lg:bg-white lg:px-8 lg:py-8 lg:shadow-[0_2px_16px_rgba(15,23,42,0.04)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
