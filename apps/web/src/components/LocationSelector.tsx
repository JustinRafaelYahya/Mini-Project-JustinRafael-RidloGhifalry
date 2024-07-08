import React from 'react';

const LocationSelector = ({ className, locations, onSelectLocation }) => {
  return (
    <select
      className={className}
      onChange={(e) => onSelectLocation(e.target.value)}
    >
      {locations.map((location, index) => (
        <option key={index} value={location}>
          {location}
        </option>
      ))}
    </select>
  );
};

export default LocationSelector;
