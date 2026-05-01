import React from 'react';

const ActionButton = ({ children, onClick, type = "button", disabled = false, className = "", icon: Icon }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary flex items-center justify-center gap-2 w-full ${className}`}
    >
      {Icon && <Icon size={20} className="text-[#0B110A]" />}
      <span>{children}</span>
    </button>
  );
};

export default ActionButton;