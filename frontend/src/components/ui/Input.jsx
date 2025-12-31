import { AlertCircle } from 'lucide-react';
import React from 'react';

const Input = React.forwardRef(({ 
  label, 
  error, 
  className = '', 
  type = 'text', 
  ...props 
}, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-2.5 bg-white border-2 rounded-xl transition-all duration-200
            outline-none focus:ring-4
            disabled:bg-slate-50 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10 pr-10' 
              : 'border-slate-200 focus:border-primary focus:ring-primary/10'
            }
            ${className}
          `}
          {...props}
        />
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5 pointer-events-none" />
        )}
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 ml-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
