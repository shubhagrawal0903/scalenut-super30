'use client';

import { useState } from 'react';

export interface ImageMeta {
  url: string;
  ready: boolean;
  error: boolean;
}

interface ImageSetCircleProps {
  name: string;
  count: number;
  images: ImageMeta[];
  locationText?: string;
}

export default function ImageSetCircle({ name, count, images, locationText }: ImageSetCircleProps) {
  const [imgStates, setImgStates] = useState(
    images.map(() => ({
      loaded: false,
      failed: false,
      retries: 0,
      retrying: false,
    }))
  );

  let hasError = false;
  for(let i = 0; i < images.length; i++) {
    if(images[i].error || imgStates[i].failed) {
      hasError = true;
      break;
    }
  }

  function onImageLoad(idx: number) {
    let newStates = [...imgStates];
    newStates[idx].loaded = true;
    newStates[idx].retrying = false;
    setImgStates(newStates);
  }

  function onImageError(idx: number) {
    let currentState = imgStates[idx];
    
    if(currentState.retries < 3) {
      let newStates = [...imgStates];
      newStates[idx].retries = currentState.retries + 1;
      newStates[idx].retrying = true;
      setImgStates(newStates);

      setTimeout(() => {
        let temp = [...imgStates];
        temp[idx].retrying = true;
        setImgStates(temp);
      }, 5000);
    } else {
      let newStates = [...imgStates];
      newStates[idx].failed = true;
      newStates[idx].retrying = false;
      setImgStates(newStates);
    }
  }

  function getTooltipText(idx: number) {
    let img = images[idx];
    let state = imgStates[idx];

    if(!img) return 'Empty slot';
    if(img.error) return 'Backend error';
    if(!img.ready) return 'Not ready';
    
    if(state.retrying) {
      return 'Loading / Retrying (Retry count: ' + state.retries + ')';
    }
    
    if(state.failed) {
      return 'Error after retries (Retry count: ' + state.retries + ')';
    }
    
    if(state.loaded) {
      if(state.retries > 0) {
        return 'Loaded (Retry count: ' + state.retries + ')';
      }
      return 'Loaded';
    }

    return 'Loading';
  }

  function renderImage(img: ImageMeta, idx: number) {
    let state = imgStates[idx];

    if(!img.ready) {
      return null;
    }

    if(img.error) {
      return (
        <div
          className="relative w-16 h-16 rounded-full bg-red-600 flex items-center justify-center border-4 border-white shadow-lg"
          title={getTooltipText(idx)}
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }

    if(state.failed) {
      return (
        <div
          className="relative w-16 h-16 rounded-full bg-red-600 flex items-center justify-center border-4 border-white shadow-lg"
          title={getTooltipText(idx)}
        >
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }

    return (
      <div
        className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg"
        title={getTooltipText(idx)}
      >
        <img
          src={img.url}
          alt={'Image ' + (idx + 1)}
          className="w-full h-full object-cover"
          onLoad={() => onImageLoad(idx)}
          onError={() => onImageError(idx)}
        />
        
        {state.retrying ? (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[800px] mx-auto bg-black rounded-xl shadow-2xl p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative w-[100px] h-[100px]">
            {images[0] && (
              <div className="absolute top-0 left-0 z-40">
                {renderImage(images[0], 0)}
              </div>
            )}
            
            {images[1] && (
              <div className="absolute top-0 left-11 z-30">
                {renderImage(images[1], 1)}
              </div>
            )}
            
            {images[2] && (
              <div className="absolute top-11 left-0 z-20">
                {renderImage(images[2], 2)}
              </div>
            )}
            
            {images[3] && (
              <div className="absolute top-11 left-11 z-10">
                {renderImage(images[3], 3)}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-white text-2xl font-bold mb-1">{name}</h2>
            {locationText && (
              <p className="text-gray-400 text-base">{locationText}</p>
            )}
          </div>
        </div>

        {hasError && (
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
