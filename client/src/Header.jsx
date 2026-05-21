import { Link } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from './UserContext';

export default function Header() {
  const { user } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user
    ? user.userType === 'Admin'
      ? `${user.name} (Admin)`
      : user.name
    : 'Log in';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-gray-900 transition-opacity hover:opacity-80"
          >
            <span className="flex h-9 w-9 items-center justify-center text-[#111827]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 -rotate-90">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
              </svg>
            </span>
            <span className="text-xl font-bold tracking-tight text-[#111827]">Tripify</span>
          </Link>

          <div className="hidden flex-1 justify-center px-4 md:flex lg:px-8">
            <SearchPill />
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-1.5 shadow-sm transition-shadow hover:shadow-md"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-gray-700 sm:inline">
                {displayName}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                {user ? (
                  <>
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.userType}</p>
                    </div>
                    <Link
                      to="/account"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      My account
                    </Link>
                    {user.userType === 'Admin' && (
                      <Link
                        to="/account/places"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My accommodations
                      </Link>
                    )}
                    {user.userType === 'Customer' && (
                      <Link
                        to="/account/bookings"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My bookings
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden">
          <SearchPill compact />
        </div>
      </div>
    </header>
  );
}

function SearchPill({ compact = false }) {
  return (
    <div
      className={`flex w-full items-center rounded-full border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md ${
        compact ? 'py-2 px-3 text-xs' : 'max-w-xl py-2.5 px-4 text-sm'
      }`}
    >
      <div className={`flex flex-1 items-center gap-2 overflow-hidden ${compact ? 'min-w-0' : ''}`}>
        <span className={`shrink-0 font-medium text-gray-800 ${compact ? 'truncate' : ''}`}>Anywhere</span>
        <span className="hidden h-4 w-px bg-gray-200 sm:block" />
        <span className={`hidden shrink-0 text-gray-600 sm:inline ${compact ? 'truncate' : ''}`}>Any week</span>
        <span className="hidden h-4 w-px bg-gray-200 md:block" />
        <span className="hidden shrink-0 text-gray-600 md:inline">Add guests</span>
      </div>
      <button
        type="button"
        className={`ml-2 flex shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-transform hover:scale-105 ${
          compact ? 'h-8 w-8' : 'h-9 w-9'
        }`}
        aria-label="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>
    </div>
  );
}
