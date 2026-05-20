import {useContext, useEffect, useState} from "react";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import {Link, Navigate} from "react-router-dom";
import {UserContext} from "./UserContext.jsx";

export default function BookingWidget({place}) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');
  const {user, ready} = useContext(UserContext);

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

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>

      {!ready && (
        <p className="text-center text-gray-500 mt-4">Loading...</p>
      )}

      {ready && isCustomer && (
        <>
          <div className="border rounded-2xl mt-4">
            <div className="flex">
              <div className="py-3 px-4">
                <label><b>Check in:</b></label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={ev => setCheckIn(ev.target.value)}
                />
              </div>
              <div className="py-3 px-4 border-l">
                <label><b>Check out:</b></label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={ev => setCheckOut(ev.target.value)}
                />
              </div>
            </div>
            <div className="py-3 px-4 border-t">
              <label><b>Number of guests:</b></label>
              <input
                type="number"
                value={numberOfGuests}
                onChange={ev => setNumberOfGuests(ev.target.value)}
              />
            </div>
            {numberOfNights > 0 && (
              <div className="py-3 px-4 border-t">
                <label><b>Your full name:</b></label>
                <input
                  type="text"
                  value={name}
                  onChange={ev => setName(ev.target.value)}
                />
                <label><b>Phone number:</b></label>
                <input
                  type="tel"
                  value={phone}
                  onChange={ev => setPhone(ev.target.value)}
                />
              </div>
            )}
          </div>
          <button onClick={bookThisPlace} className="primary mt-4">
            Book this place
            {numberOfNights > 0 && (
              <span> ${numberOfNights * place.price}</span>
            )}
          </button>
        </>
      )}

      {ready && !user && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 mb-3">Sign in to book this place</p>
          <Link to="/login" className="primary inline-block px-6 py-2 rounded-2xl">
            Login to book
          </Link>
        </div>
      )}

      {ready && user && !isCustomer && (
        <p className="text-center text-gray-500 mt-4">
          Booking is available for customer accounts only.
        </p>
      )}
    </div>
  );
}
