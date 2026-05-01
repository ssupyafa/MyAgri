import React from 'react';
import { AlertTriangle } from 'lucide-react';

const InputField = ({ label, type = "text", value, onChange, placeholder, name, required = false, className = "", isRandom = false }) => {
  return (
    <div className={`flex flex-col mb-4 relative ${className}`}>
      {label && (
        <label className={`label-text transition-colors duration-300 ${isRandom ? 'text-red-500 font-bold' : ''}`}>
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`input-field w-full transition-all duration-300 ${
            isRandom
              ? '!border-red-500 !ring-red-500/50 !ring-2 !bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              : ''
          }`}
        />
        {isRandom && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-pulse">
            <AlertTriangle size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;