"use client"

import { useSelector } from 'react-redux';
import { StoreState } from '@/redux/reduxStore';

const LoadingSpinner = () => {
  const isLoading = useSelector((state: StoreState) => state.toaster.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400" />
    </div>
  );
};

export default LoadingSpinner;
