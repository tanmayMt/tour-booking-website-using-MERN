import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';

function isNavActive(href, pathname) {
  if (href === '/account') {
    return pathname === '/account';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavItem({ to, label, icon, pathname, onNavigate }) {
  const active = isNavActive(to, pathname);
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={[
        'flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] transition-all duration-200',
        active
          ? 'bg-[#f3f4f6] font-semibold text-[#111827] shadow-[0_1px_3px_rgba(15,23,42,0.06)]'
          : 'font-medium text-[#4b5563] hover:bg-[#f9fafb]',
      ].join(' ')}
    >
      <span className={active ? 'text-[#ff385c]' : 'text-[#6b7280]'}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function AccountSidebar({ mobileOpen = false, onClose }) {
  const { pathname } = useLocation();
  const { user } = useContext(UserContext);
  const admin = user?.userType === 'Admin';
  const client = user?.userType === 'Customer';

  const handleNavigate = () => {
    if (onClose) onClose();
  };

  const nav = (
    <nav className="space-y-1">
      <NavItem
        to="/account"
        label="My Profile"
        pathname={pathname}
        onNavigate={handleNavigate}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        }
      />
      {admin && (
        <NavItem
          to="/account/places"
          label="My Accommodations"
          pathname={pathname}
          onNavigate={handleNavigate}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
            </svg>
          }
        />
      )}
      {client && (
        <NavItem
          to="/account/bookings"
          label="Bookings"
          pathname={pathname}
          onNavigate={handleNavigate}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          }
        />
      )}
      <NavItem
        to="/account/favorites"
        label="Favorites"
        pathname={pathname}
        onNavigate={handleNavigate}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        }
      />
      <NavItem
        to="/account/settings"
        label="Settings"
        pathname={pathname}
        onNavigate={handleNavigate}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
      />
    </nav>
  );

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-[#111827]/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-[min(300px,88vw)] transform border-r border-[#e5e7eb] bg-white transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-[240px] lg:shrink-0 lg:translate-x-0 lg:border-0 lg:bg-transparent',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div className="flex h-full flex-col overflow-y-auto px-5 py-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:px-0 lg:py-0">
          <div className="mb-6 flex items-center justify-between lg:mb-8">
            <h1 className="text-[32px] font-semibold leading-tight tracking-tight text-[#111827]">
              Profile
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[#6b7280] hover:bg-[#f3f4f6] lg:hidden"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {nav}
        </div>
      </aside>
    </>
  );
}
