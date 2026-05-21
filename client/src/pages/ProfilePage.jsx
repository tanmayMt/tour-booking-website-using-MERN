import { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { setAuthToken } from '../auth.js';

function getInitials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function roleLabel(userType) {
  if (userType === 'Admin') return 'Admin';
  return 'User';
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#ff385c] shadow-sm">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7280]">{label}</p>
        <p className="mt-1 text-[15px] font-semibold text-[#111827]">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { user, setUser } = useContext(UserContext);

  async function logout() {
    await axios.post('/logout');
    setAuthToken(null);
    setRedirect('/');
    setUser(null);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="space-y-8">
      {/* Profile header — Airbnb-style centered block */}
      <section className="border-b border-[#e5e7eb] pb-8">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff385c] to-[#e31c5f] text-2xl font-bold text-white shadow-md">
            {getInitials(user.name)}
          </div>
          <div className="mt-4 min-w-0 sm:mt-0">
            <p className="text-sm font-medium text-[#6b7280]">Welcome back</p>
            <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-[#111827]">{user.name}</h1>
            <p className="mt-1 text-[15px] text-[#6b7280]">{user.email}</p>
            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                user.userType === 'Admin'
                  ? 'bg-[#111827] text-white'
                  : 'bg-[#ff385c]/10 text-[#ff385c]'
              }`}
            >
              {roleLabel(user.userType)}
            </span>
          </div>
        </div>
      </section>

      {/* Account details */}
      <section>
        <h2 className="text-lg font-semibold text-[#111827]">Personal information</h2>
        <p className="mt-1 text-[15px] text-[#6b7280]">Your account details on Tripify.</p>

        <div className="mt-5 flex flex-col gap-3">
          <DetailRow
            label="Name"
            value={user.name}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            }
          />
          <DetailRow
            label="Email"
            value={user.email}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 00-1.07-1.916l-7.5-4.615a2.25 2.25 0 00-2.36 0L3.32 8.91a2.25 2.25 0 00-1.07 1.916V19.5" />
              </svg>
            }
          />
          <DetailRow
            label="Role"
            value={roleLabel(user.userType)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            }
          />
        </div>

        <div className="mt-8 border-t border-[#e5e7eb] pt-6">
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff385c] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e31c5f]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Logout
          </button>
        </div>
      </section>
    </div>
  );
}
