import React from 'react';
import { useLocation } from 'react-router-dom';

// No transition animations — prevents white shattering on page change.
// Fluidity comes from per-section scroll animations instead.
export default function FluidWrapper({ children }) {
    return <>{children}</>;
}
