import React from 'react';

const GlassCard = ({ children, title, subtitle, className = "", icon: Icon }) => {
  return (
    <div className={`glass-card p-6 md:p-8 ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-6">
          {Icon && <div className="p-2 bg-primary/20 rounded-lg text-primary"><Icon size={24} /></div>}
          <div>
            {title && <h3 className="text-xl font-serif text-text-heading">{title}</h3>}
            {subtitle && <p className="text-xs text-text-body uppercase tracking-wider">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default GlassCard;