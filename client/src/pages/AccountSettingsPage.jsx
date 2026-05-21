import { Link } from 'react-router-dom';

export default function AccountSettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-[26px] font-semibold leading-tight text-[#111827] sm:text-[32px]">
          Settings
        </h2>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#6b7280]">
          Manage your account preferences and notifications.
        </p>
      </header>

      <div className="flex flex-col items-center rounded-[20px] border border-[#e5e7eb] bg-white px-6 py-16 text-center shadow-[0_2px_16px_rgba(15,23,42,0.05)]">
        <p className="max-w-md text-[15px] leading-relaxed text-[#6b7280]">
          Account settings will be available here soon. For now, update your profile from My Profile.
        </p>
        <Link
          to="/account"
          className="mt-6 rounded-lg border border-[#111827] bg-white px-6 py-3 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#f3f4f6]"
        >
          Go to My Profile
        </Link>
      </div>
    </div>
  );
}
