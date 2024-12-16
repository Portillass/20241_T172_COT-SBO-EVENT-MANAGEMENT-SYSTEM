import React from 'react';
import { FaCalendarCheck } from 'react-icons/fa';

function Logo() {
  return (
    <div className="d-flex align-items-center">
      <FaCalendarCheck className="me-2" size={24} />
      <span className="fw-bold">EventHub</span>
    </div>
  );
}

export default Logo; 