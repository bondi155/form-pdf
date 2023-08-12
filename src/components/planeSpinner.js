import React from 'react';
import { FaPlane } from 'react-icons/fa';
import '../css/App.css';

function PlaneSpinner() {
  return (
    <div className="plane-spinner">
      <FaPlane  color="black" size={35} />
    </div>
  );
}

export default PlaneSpinner;