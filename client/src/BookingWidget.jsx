import { useContext, useEffect, useMemo, useState } from 'react';
import { differenceInCalendarDays, format } from 'date-fns';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.jsx';
import { setRedirectAfterLogin } from './auth.js';

function todayString() {
  return format(new Date(), 'yyyy-MM-dd');
}

export default function BookingWidget({ place }) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, ready } = useContext(UserContext);

  const isCustomer = user?.userType === 'Customer';
  const maxGuests = place?.maxGuests || 1;
  const pricePerNight = place?.price || 0;

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const numberOfNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }, [checkIn, checkOut]);

  const totalPrice = numberOfNights > 0 ? numberOfNights * pricePerNight : 0;

  function validateBooking() {
    if (!user) {
      return 'Please log in to book this place.';
    }
    if (!isCustomer) {
      return 'Booking is available for customer accounts only.';
    }
    if (!checkIn || !checkOut) {
      return 'Please select check-in and check-out dates.';
    }
    if (numberOfNights <= 0) {
      return 'Check-out must be after check-in.';
    }
    const guests = Number(numberOfGuests);
    if (!Number.isFinite(guests) || guests < 1) {
      return 'Number of guests must be at least 1.';
    }
    if (guests > maxGuests) {
      return `This place allows a maximum of ${maxGuests} guest(s).`;
    }
    if (!name.trim()) {
      return 'Please enter your full name.';
    }
    if (!phone.trim()) {
      return 'Please enter your phone number.';
    }
    return null;
  }

  function handleLoginClick() {
    setRedirectAfterLogin(`/place/${place._id}`);
  }

  async function bookThisPlace() {
    setError('');
    setSuccess('');

    const validationError = validateBooking();
    if (validationError) {
      setError(validationError);
      if (!user) {
        setRedirectAfterLogin(`/place/${place._id}`);
        navigate('/login');
      }
      return;
    }

    setLoading(true);
    try {
      await axios.post('/bookings', {
        place: place._id,
        checkIn,
        checkOut,
        numberOfGuests: Number(numberOfGuests),
        name: name.trim(),
        phone: phone.trim(),
        price: totalPrice,
      });
      setSuccess('Booking confirmed! Redirecting to your bookings…');
      setTimeout(() => {
        navigate('/account/bookings', { state: { booked: true } });
      }, 800);
    } catch (e) {
      const message = e.response?.data?.message || 'Booking failed. Please try again.';
      setError(message);
      if (e.response?.status === 401) {
        setRedirectAfterLogin(`/place/${place._id}`);
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#ff385c] focus:ring-1 focus:ring-[#ff385c]';

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-lg shadow-gray-200/60">
      <div className="flex items-baseline gap-1 border-b border-[#e5e7eb] pb-4">
        <span className="text-2xl font-bold text-[#111827]">${pricePerNight}</span>
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
                  min={todayString()}
                  onChange={(ev) => {
                    setCheckIn(ev.target.value);
                    setError('');
                    if (checkOut && ev.target.value >= checkOut) {
                      setCheckOut('');
                    }
                  }}
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
                  min={checkIn || todayString()}
                  disabled={!checkIn}
                  onChange={(ev) => {
                    setCheckOut(ev.target.value);
                    setError('');
                  }}
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
                max={maxGuests}
                className={inputClass}
                value={numberOfGuests}
                onChange={(ev) => {
                  setNumberOfGuests(ev.target.value);
                  setError('');
                }}
              />
              <p className="mt-1 text-xs text-[#6b7280]">Max {maxGuests} guest(s)</p>
            </div>
            <div className="space-y-3 p-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                  Full name
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={name}
                  onChange={(ev) => {
                    setName(ev.target.value);
                    setError('');
                  }}
                  placeholder="Your full name"
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
                  onChange={(ev) => {
                    setPhone(ev.target.value);
                    setError('');
                  }}
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>

          {numberOfNights > 0 && (
            <div className="mt-4 space-y-2 rounded-xl bg-[#f8fafc] p-4 text-sm">
              <div className="flex justify-between text-[#6b7280]">
                <span>
                  ${pricePerNight} × {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}
                </span>
                <span className="font-semibold text-[#111827]">${totalPrice}</span>
              </div>
              <div className="flex justify-between border-t border-[#e5e7eb] pt-2 font-semibold text-[#111827]">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800" role="status">
              {success}
            </p>
          )}

          <button
            type="button"
            onClick={bookThisPlace}
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-primary py-3.5 text-base font-semibold text-white transition hover:bg-[#e31c5f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Reserving…' : 'Reserve'}
            {!loading && numberOfNights > 0 && (
              <span> · ${totalPrice}</span>
            )}
          </button>
        </div>
      )}

      {ready && !user && (
        <div className="mt-6 text-center">
          <p className="mb-4 text-sm text-[#6b7280]">Sign in to book this place</p>
          <Link
            to="/login"
            onClick={handleLoginClick}
            className="inline-block w-full rounded-xl bg-primary px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#e31c5f]"
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
