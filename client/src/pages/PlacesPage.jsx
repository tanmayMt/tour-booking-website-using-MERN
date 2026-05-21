import { Link } from 'react-router-dom';
import AccountNav from '../AccountNav';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from '../Image.jsx';

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  async function deletePlace(ev, id) {
    ev.preventDefault();
    ev.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this place?')) {
      return;
    }

    try {
      await axios.delete(`/places/${id}`);
      setPlaces((prev) => prev.filter((place) => place._id !== id));
    } catch (e) {
      const message = e.response?.data?.message || 'Failed to delete place';
      alert(message);
    }
  }

  return (
    <div>
      <AccountNav />
      <div className="text-center">
        List of all added Places<br />
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to="/account/places/new"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          Add new place
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {places.length > 0 && places.map((place) => (
          <div
            key={place._id}
            className="relative flex gap-4 bg-gray-100 p-4 rounded-2xl"
          >
            <Link
              to={`/account/places/${place._id}`}
              className="flex flex-1 gap-4 min-w-0 cursor-pointer"
            >
              <div className="flex w-32 h-32 bg-gray-300 shrink-0 overflow-hidden rounded-xl">
                {place.photos?.length > 0 && (
                  <Image className="object-cover w-full h-full" src={place.photos[0]} alt="" />
                )}
              </div>
              <div className="grow min-w-0 pr-10">
                <h2 className="text-xl">{place.title}</h2>
                <p className="text-sm mt-2 line-clamp-2">{place.description}</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={(ev) => deletePlace(ev, place._id)}
              className="absolute top-4 right-4 p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
              title="Delete place"
              aria-label="Delete place"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
