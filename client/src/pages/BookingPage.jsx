import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

// const navigate = useNavigate();
//Single Booking
export default function BookingPage()
{
  const {id} = useParams();
  const [booking,setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get('/bookings').then(response => {
        const foundBooking = response.data.find(({_id}) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) 
  {
    return '';
  }

// const cancelBooking = async(id) => {
//   try{
//     alert("Hi");
//   }catch(error)
//   {
//     alert("Unable to cancel the booking");
//   }
// };

  return (
    <div className="my-8">
        {/* Single Booking : {id} */}
      <h1 className="text-3xl">{booking.place.title}</h1>
      <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4"><b>Your booking information</b></h2>
          <BookingDates booking={booking} />
          <div>Booking ID: {id}</div>

        </div>
      
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${booking.price}</div>
        </div>
        {/* <div className="bg-primary p-6 text-black rounded-2xl" style={{cursor: "pointer"}} onClick={() => navigate(`/account/bookings/cancel/${id}`)} >
          <div><b>Cancel Booking</b></div>
        </div> */}
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}