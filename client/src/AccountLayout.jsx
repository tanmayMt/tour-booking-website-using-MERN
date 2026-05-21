import { useContext, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserContext } from './UserContext';
import AccountSidebar from './AccountSidebar';

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
    <div className="-mx-4 min-h-[calc(100vh-5rem)] bg-[#f8fafc] px-4 py-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto max-w-[1120px]">
        {/* Mobile menu trigger */}
        <div className="mb-4 flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-semibold text-[#111827] shadow-sm"
            aria-label="Open account menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            Profile menu
          </button>
        </div>

        <div className="flex gap-10 lg:gap-16 xl:gap-20">
          <AccountSidebar
            mobileOpen={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />

          <main className="min-w-0 flex-1 pb-12" key={pathname}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
