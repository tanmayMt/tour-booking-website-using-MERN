import { useContext, useEffect, useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from './UserContext.jsx';

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');
  const { user, ready } = useContext(UserContext);

  const isCustomer = user?.userType === 'Customer';

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisPlace() {
    const response = await axios.post('/bookings', {
      checkIn, checkOut, numberOfGuests, name, phone,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    alert('Booking confirmed!');
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827]';

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-lg shadow-gray-200/60">
      <div className="flex items-baseline gap-1 border-b border-[#e5e7eb] pb-4">
        <span className="text-2xl font-bold text-[#111827]">${place.price}</span>
        <span className="text-base font-normal text-[#6b7280]">/ night</span>
      </div>

      {!ready && (
        <p className="mt-6 text-center text-sm text-[#6b7280]">Loading...</p>
      )}

      {ready && isCustomer && (
        <div className="mt-4">
          <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
              <div className="border-b border-[#e5e7eb] p-3 sm:border-b-0 sm:border-r lg:border-b lg:border-r-0">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                  Check-in
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                />
              </div>
              <div className="border-b border-[#e5e7eb] p-3 lg:border-b">
                <label className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                  Check-out
                </label>
                <input
                  type="date"
                  className={inputClass}
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                />
              </div>
            </div>
            <div className="border-b border-[#e5e7eb] p-3">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                Guests
              </label>
              <input
                type="number"
                min={1}
                className={inputClass}
                value={numberOfGuests}
                onChange={(ev) => setNumberOfGuests(ev.target.value)}
              />
            </div>
            {numberOfNights > 0 && (
              <div className="space-y-3 p-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                    Full name
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className={inputClass}
                    value={phone}
                    onChange={(ev) => setPhone(ev.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {numberOfNights > 0 && (
            <div className="mt-4 flex justify-between text-sm text-[#6b7280]">
              <span>
                ${place.price} × {numberOfNights} nights
              </span>
              <span className="font-semibold text-[#111827]">
                ${numberOfNights * place.price}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={bookThisPlace}
            className="mt-4 w-full rounded-xl bg-[#111827] py-3.5 text-base font-semibold text-white transition hover:bg-gray-800"
          >
            Reserve
            {numberOfNights > 0 && (
              <span> · ${numberOfNights * place.price}</span>
            )}
          </button>
        </div>
      )}

      {ready && !user && (
        <div className="mt-6 text-center">
          <p className="mb-4 text-sm text-[#6b7280]">Sign in to book this place</p>
          <Link
            to="/login"
            className="inline-block w-full rounded-xl bg-[#111827] px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Log in to book
          </Link>
        </div>
      )}

      {ready && user && !isCustomer && (
        <p className="mt-6 text-center text-sm leading-relaxed text-[#6b7280]">
          Booking is available for customer accounts only.
        </p>
      )}
    </div>
  );
}
