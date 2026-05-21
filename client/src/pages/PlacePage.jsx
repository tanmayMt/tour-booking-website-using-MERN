import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BookingWidget from '../BookingWidget';
import PlaceGallery from '../PlaceGallery';
import AddressLink from '../AddressLink';

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#e5e7eb] bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-[#111827]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">{label}</p>
        <p className="mt-1 text-base font-medium text-[#111827]">{value}</p>
      </div>
    </div>
  );
}

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    setError(null);
    axios.get(`/places/${id}`)
      .then((response) => {
        setPlace(response.data);
      })
      .catch(() => {
        setError('Could not load this place. It may not exist.');
        setPlace(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-2/3 rounded-lg bg-gray-200" />
        <div className="h-5 w-1/3 rounded bg-gray-200" />
        <div className="h-[360px] rounded-2xl bg-gray-200 lg:h-[440px]" />
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <div className="h-32 rounded-xl bg-gray-200" />
            <div className="h-24 rounded-xl bg-gray-200" />
          </div>
          <div className="h-80 rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
        <p className="font-medium text-red-700">{error || 'Place not found.'}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden pb-12">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl lg:text-4xl">
          {place.title}
        </h1>
        <div className="mt-2">
          <AddressLink>{place.address}</AddressLink>
        </div>
      </header>

      <PlaceGallery place={place} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 xl:gap-16">
        <div className="min-w-0 space-y-8 lg:space-y-10">
          <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#111827]">About this place</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-[#374151]">
              {place.description || 'No description provided.'}
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-bold text-[#111827]">Stay details</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <DetailItem
                label="Check-in"
                value={`${place.checkIn}:00`}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <DetailItem
                label="Check-out"
                value={`${place.checkOut}:00`}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <DetailItem
                label="Max guests"
                value={place.maxGuests}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.748-.5c-.8-.534-1.604-1.064-2.448-1.58M12 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                }
              />
            </div>
          </section>

          {place.perks?.length > 0 && (
            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#111827]">What this place offers</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {place.perks.map((perk) => (
                  <span
                    key={perk}
                    className="rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-4 py-2 text-sm font-medium capitalize text-[#374151]"
                  >
                    {perk}
                  </span>
                ))}
              </div>
            </section>
          )}

          {place.extraInfo && (
            <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#111827]">House rules & extra info</h2>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-[#374151]">
                {place.extraInfo}
              </p>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget place={place} />
        </aside>
      </div>
    </div>
  );
}
