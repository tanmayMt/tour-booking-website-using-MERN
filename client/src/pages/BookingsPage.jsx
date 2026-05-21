import { useEffect, useState } from 'react';
import axios from 'axios';
import PlaceImg from '../PlaceImg';
import { Link, useLocation } from 'react-router-dom';
import BookingDates from '../BookingDates';
import { format } from 'date-fns';

function StatusBadge({ status }) {
  const styles = {
    confirmed: 'bg-green-50 text-green-800 border-green-200',
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Confirmed';
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
        styles[status] || styles.confirmed
      }`}
    >
      {label}
    </span>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const justBooked = location.state?.booked;

  useEffect(() => {
    setLoading(true);
    setError('');
    axios
      .get('/bookings')
      .then((response) => {
        setBookings(response.data);
      })
      .catch((e) => {
        const message = e.response?.data?.message || 'Could not load your bookings.';
        setError(message);
        setBookings([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#e5e7eb] pb-6">
        <h1 className="text-[26px] font-semibold tracking-tight text-[#111827]">Bookings</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[#6b7280]">
          View and manage your upcoming and past trips.
        </p>
      </div>

      {justBooked && (
        <div
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
          role="status"
        >
          Your booking was confirmed successfully.
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <div
            className="h-9 w-9 animate-spin rounded-full border-2 border-[#ff385c] border-t-transparent"
            aria-label="Loading bookings"
          />
        </div>
      )}

      {!loading && !error && bookings?.length === 0 && (
        <div className="mx-auto max-w-md py-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ff385c]/10 text-[#ff385c]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-[#6b7280]">
            When you book a stay, it will appear here.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-[#ff385c] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e31c5f]"
          >
            Explore stays
          </Link>
        </div>
      )}

      {!loading && bookings?.length > 0 && (
        <ul className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <li key={booking._id}>
              <Link
                to={`/account/bookings/${booking._id}`}
                className="group flex flex-col overflow-hidden rounded-[20px] border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:flex-row"
              >
                <div className="h-48 w-full shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-auto sm:w-44">
                  {booking.place ? (
                    <PlaceImg
                      place={booking.place}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full min-h-[12rem] items-center justify-center text-[#9ca3af] sm:min-h-0 sm:h-full">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-[#111827]">
                      {booking.place?.title || 'Place unavailable'}
                    </h2>
                    <StatusBadge status={booking.status} />
                  </div>
                  <BookingDates booking={booking} className="mb-1 mt-2 text-sm text-[#6b7280]" />
                  <p className="text-sm text-[#6b7280]">
                    {booking.numberOfGuests}{' '}
                    {booking.numberOfGuests === 1 ? 'guest' : 'guests'}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-[#6b7280]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    <span className="text-base font-semibold text-[#111827]">
                      Total: ${booking.price}
                    </span>
                  </div>
                  {booking.createdAt && (
                    <p className="mt-1 text-xs text-[#9ca3af]">
                      Booked {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
