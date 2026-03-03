import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

export const PressPrototypeViewer = () => {
  const [search] = useSearchParams();
  const page = (search.get('page') || 'bookshelf').toLowerCase();

  // Phase 3: retire demo iframe prototype pages and route directly
  // to the live production React experiences.
  if (page === 'reader') {
    return <Navigate to="/reader/ch1_intro" replace />;
  }

  if (page === 'textbook') {
    return <Navigate to="/textbook/NUR1100" replace />;
  }

  return <Navigate to="/bookshelf" replace />;
};

export default PressPrototypeViewer;
