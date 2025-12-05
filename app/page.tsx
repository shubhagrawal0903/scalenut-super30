'use client';

import { useState, useEffect } from 'react';
import ImageSetCircle, { ImageMeta } from '@/app/components/ImageSetCircle';

interface ImageSetResponse {
  name: string;
  count: number;
  images: ImageMeta[];
}

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        setError('');

        let response = await fetch('/api/images');
        
        if(!response.ok) {
          throw new Error('Failed to fetch images: ' + response.statusText);
        }

        let jsonData = await response.json();
        setData(jsonData);
      } catch(err) {
        if(err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading images...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-red-50 border-2 border-red-300 rounded-lg p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center mr-4">
              <span className="text-red-600 text-2xl font-bold">!</span>
            </div>
            <h2 className="text-xl font-semibold text-red-800">Error Loading Images</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <p className="text-gray-600">No data available</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <ImageSetCircle
          name={data.name}
          count={data.count}
          images={data.images}
          locationText="Moradabad, Uttar Pradesh"
        />
      </div>
    </main>
  );
}
