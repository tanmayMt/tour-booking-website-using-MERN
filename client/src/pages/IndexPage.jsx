import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Image from '../Image.jsx';

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/places')
      .then((response) => {
        setPlaces(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <section className="mb-8 sm:mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
          Explore unique stays
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
          Discover hand-picked accommodations for your next trip — from city apartments to countryside retreats.
        </p>
        <p className="mt-3 text-sm font-medium text-gray-700">
          {!loading && (
            <span>{places.length} {places.length === 1 ? 'place' : 'places'} available</span>
          )}
        </p>
      </section>

      {loading && (
        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] rounded-xl bg-gray-200" />
              <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {!loading && places.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-gray-900">No places yet</p>
          <p className="mt-2 text-sm text-gray-500">Check back soon for new listings.</p>
        </div>
      )}

      {!loading && places.length > 0 && (
        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-4 lg:gap-8">
          {places.map((place) => (
            <Link
              key={place._id}
              to={`/place/${place._id}`}
              className="group block min-w-0"
            >
              <article className="flex h-full flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1">
                <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-100 shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    {place.photos?.[0] ? (
                      <Image
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        src={place.photos[0]}
                        alt={place.title || 'Place photo'}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="h-12 w-12">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-1 flex-col">
                  <h2 className="truncate text-base font-semibold text-gray-900 sm:text-[15px]">
                    {place.address}
                  </h2>
                  <h3 className="mt-0.5 truncate text-sm text-gray-500">
                    {place.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-800">
                    <span className="font-bold text-gray-900">${place.price}</span>
                    <span className="font-normal text-gray-600"> / night</span>
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
