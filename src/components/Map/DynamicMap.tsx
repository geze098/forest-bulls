'use client';

import dynamic from 'next/dynamic';
import { MapProps } from './Map';

// Dynamically import the Map component with no SSR to avoid hydration issues
const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-gray-100 rounded-lg" style={{ height: '400px' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

const MapWrapper: React.FC<MapProps> = (props) => {
  return <DynamicMap {...props} />;
};

export default MapWrapper;