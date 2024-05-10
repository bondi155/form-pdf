import React from 'react';
import { FaSpinner } from "react-icons/fa6";
import '../css/App.css';

function PlaneSpinner() {
  return (
    <div className="plane-spinner">
      <FaSpinner  color="black" size={35} />
    </div>
  );
}

export default PlaneSpinner;