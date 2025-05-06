import React from 'react';

const AuthImagePattern = ({ title = "Welcome to Our Community!", subtitle = "Join us to access amazing features, stay connected, and grow together." }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-6"> {/* Reduced padding */}
      <div className="max-w-sm text-center"> {/* Reduced max-width */}
        {/* Grid Pattern */}
        <div className="grid grid-cols-3 gap-2 m-6"> {/* Reduced gap and margin */}
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square bg-red-200 rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
