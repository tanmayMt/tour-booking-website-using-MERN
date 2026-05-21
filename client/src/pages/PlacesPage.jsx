import { Link } from 'react-router-dom';
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
    <div className="relative space-y-8 pb-20 sm:pb-0">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[26px] font-semibold leading-tight text-[#111827] sm:text-[32px]">
            My Accommodations
          </h2>
          <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#6b7280]">
            Manage your listed stays and property details.
          </p>
        </div>
        <Link
          to="/account/places/new"
          className="hidden shrink-0 items-center gap-2 self-start rounded-lg bg-[#ff385c] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e31c5f] sm:inline-flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          Add New Place
        </Link>
      </header>

      {places.length === 0 ? (
        <div className="flex flex-col items-center rounded-[20px] border border-[#e5e7eb] bg-white px-6 py-16 text-center shadow-[0_2px_16px_rgba(15,23,42,0.05)]">
          <p className="max-w-md text-[15px] leading-relaxed text-[#6b7280]">
            You haven&apos;t listed any accommodations yet. Add your first property to start hosting on Tripify.
          </p>
          <Link
            to="/account/places/new"
            className="mt-6 rounded-lg bg-[#ff385c] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e31c5f]"
          >
            Add New Place
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {places.map((place) => (
            <li
              key={place._id}
              className="group rounded-[20px] border border-[#e5e7eb] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to={`/account/places/${place._id}`}
                  className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:gap-5"
                >
                  <div className="mx-auto h-[120px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-[#f3f4f6] sm:mx-0">
                    {place.photos?.length > 0 ? (
                      <Image
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        src={place.photos[0]}
                        alt=""
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#9ca3af]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-10 w-10">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 21 18.75V5.25A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25v13.5A2.25 2.25 0 0 0 5.25 21Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-[#111827]">{place.title}</h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#6b7280]">
                      {place.description}
                    </p>
                  </div>
                </Link>

                <div className="flex items-center justify-center gap-1 border-t border-[#e5e7eb] pt-4 sm:border-0 sm:pt-0">
                  <Link
                    to={`/account/places/${place._id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[#4b5563] transition-colors hover:bg-[#f3f4f6]"
                    title="Edit"
                    aria-label="Edit place"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </Link>
                  <button
                    type="button"
                    onClick={(ev) => deletePlace(ev, place._id)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[#ef4444] transition-colors hover:bg-red-50"
                    title="Delete"
                    aria-label="Delete place"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/account/places/new"
        className="fixed bottom-6 right-4 z-30 inline-flex items-center gap-2 rounded-lg bg-[#ff385c] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#e31c5f] sm:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
        </svg>
        Add New Place
      </Link>
    </div>
  );
}
