import React from 'react';

export const TransFlowLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 36 : size === 'lg' ? 68 : 52;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Icon: Stylized circular road & transit swirl */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <circle cx="50" cy="50" r="46" stroke="#0d1747" strokeWidth="4" className="opacity-15" />
        {/* Outer curved dynamic path */}
        <path
          d="M 50 10 A 40 40 0 0 1 90 50 A 40 40 0 0 1 50 90 A 40 40 0 0 1 18 72"
          stroke="#0d1747"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Road perspective winding inside */}
        <path
          d="M 22 76 C 35 70, 48 55, 48 30 C 48 22, 54 18, 62 20 C 72 23, 76 34, 76 46 C 76 68, 52 82, 36 84"
          fill="#1c2c77"
        />
        {/* Road center dash marks */}
        <path
          d="M 32 76 L 36 68"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 42 58 L 45 50"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 50 40 L 52 34"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Accent green flash */}
        <path
          d="M 28 85 C 38 88, 54 86, 68 76"
          stroke="#84ad32"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      {/* TRANSFLOW Typography */}
      <div className="mt-3 flex items-center tracking-tight font-extrabold text-[#0d1747]">
        <span className={size === 'sm' ? 'text-lg tracking-wider' : size === 'lg' ? 'text-2xl tracking-widest' : 'text-xl tracking-widest'}>
          TRANSFLOW
        </span>
      </div>
    </div>
  );
};
