import { useState } from 'react';
import Image from './Image.jsx';

function ShowMoreButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-sm font-semibold text-[#111827] shadow-md transition hover:shadow-lg"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
      </svg>
      Show more photos
    </button>
  );
}

function GalleryImage({ src, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative block h-full w-full min-h-0 overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </button>
  );
}

export default function PlaceGallery({ place }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const photos = place?.photos || [];
  const displayPhotos = photos.slice(0, 3);

  const openGallery = () => setShowAllPhotos(true);
  const showMoreButton = photos.length > 1;

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#111827]/95">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111827]/90 px-4 py-4 backdrop-blur sm:px-6">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Photos of {place.title}
          </h2>
          <button
            type="button"
            onClick={() => setShowAllPhotos(false)}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-2 text-sm font-medium text-[#111827] transition hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
            Close
          </button>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6">
          {photos.map((photo, index) => (
            <div key={index} className="overflow-hidden rounded-xl">
              <Image src={photo} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-2xl border border-[#e5e7eb] bg-gray-100 text-[#6b7280] md:h-[400px] lg:h-[440px]">
        No photos available
      </div>
    );
  }

  const lastDisplayIndex = displayPhotos.length - 1;

  return (
    <div className="w-full">
      {/* Mobile & tablet: stacked */}
      <div className="flex flex-col gap-3 md:hidden">
        {displayPhotos.map((photo, index) => (
          <div
            key={index}
            className="relative h-56 overflow-hidden rounded-2xl sm:h-64"
          >
            <GalleryImage src={photo} onClick={openGallery} />
            {showMoreButton && index === lastDisplayIndex && (
              <ShowMoreButton onClick={openGallery} />
            )}
          </div>
        ))}
      </div>

      {/* Desktop: 65% left + 35% right (2 stacked) */}
      <div className="hidden h-[400px] overflow-hidden rounded-2xl md:grid md:grid-cols-[65fr_35fr] md:gap-3 lg:h-[440px]">
        {/* Left: main image */}
        <div className="relative min-h-0">
          <GalleryImage src={displayPhotos[0]} onClick={openGallery} />
          {showMoreButton && displayPhotos.length === 1 && (
            <ShowMoreButton onClick={openGallery} />
          )}
        </div>

        {/* Right: one full-height image (2 photos) or two stacked (3 photos) */}
        {displayPhotos.length > 1 && (
          displayPhotos.length === 2 ? (
            <div className="relative min-h-0">
              <GalleryImage src={displayPhotos[1]} onClick={openGallery} />
              {showMoreButton && <ShowMoreButton onClick={openGallery} />}
            </div>
          ) : (
            <div className="grid min-h-0 grid-rows-2 gap-3">
              <div className="relative min-h-0">
                <GalleryImage src={displayPhotos[1]} onClick={openGallery} />
              </div>
              <div className="relative min-h-0">
                <GalleryImage src={displayPhotos[2]} onClick={openGallery} />
                {showMoreButton && <ShowMoreButton onClick={openGallery} />}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
