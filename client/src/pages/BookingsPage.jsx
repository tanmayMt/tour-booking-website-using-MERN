import { useEffect, useState } from 'react';
import axios from 'axios';
import PlaceImg from '../PlaceImg';
import { Link } from 'react-router-dom';
import BookingDates from '../BookingDates';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('/bookings').then((response) => {
      setBookings(response.data);
    });
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-[26px] font-semibold leading-tight text-[#111827] sm:text-[32px]">
          Bookings
        </h2>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#6b7280]">
          View and manage your upcoming and past trips.
        </p>
      </header>

      {bookings?.length === 0 ? (
        <div className="flex flex-col items-center rounded-[20px] border border-[#e5e7eb] bg-white px-6 py-16 text-center shadow-[0_2px_16px_rgba(15,23,42,0.05)]">
          <p className="max-w-md text-[15px] leading-relaxed text-[#6b7280]">
            When you join a trip or book a stay, you&apos;ll find your bookings here.
          </p>
          <Link
            to="/"
            className="mt-6 rounded-lg bg-[#ff385c] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e31c5f]"
          >
            Book a trip
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <li key={booking._id}>
              <Link
                to={`/account/bookings/${booking._id}`}
                className="group flex flex-col overflow-hidden rounded-[20px] border border-[#e5e7eb] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:flex-row"
              >
                <div className="h-48 w-full shrink-0 overflow-hidden bg-[#f3f4f6] sm:h-auto sm:w-44">
                  <PlaceImg place={booking.place} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-[#111827]">{booking.place.title}</h3>
                  <BookingDates booking={booking} className="mb-1 mt-2 text-sm text-[#6b7280]" />
                  <p className="mt-2 text-base font-semibold text-[#111827]">
                    Total: ${booking.price}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
