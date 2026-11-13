import React from 'react';

/**
 * PriceSpy Brand Logo Component
 * Incorporates Charcoal Black (#171717), Forest Green (#06110C), and Crimson Red (#A31C1B)
 * with a high-precision spy lens aperture, algorithmic price drop trajectory, and glowing target bullseye.
 *
 * @param {number} size - Pixel dimensions (width & height). Default 36.
 * @param {boolean} animated - Whether to enable the pulsing beacon glow on the target bullseye.
 * @param {string} className - Optional Tailwind or CSS class names.
 * @param {boolean} showText - Whether to render horizontal typography alongside the emblem.
 */
export default function PriceSpyLogo({ 
  size = 36, 
  animated = true, 
  className = "", 
  showText = false 
}) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
        role="img"
        aria-label="PriceSpy Brand Logo"
      >
        <defs>
          {/* Base Background Gradient: Charcoal Black to Deep Forest Green */}
          <linearGradient id="ps-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1E1E" />
            <stop offset="50%" stopColor="#171717" />
            <stop offset="100%" stopColor="#06110C" />
          </linearGradient>

          {/* Border Metallic Rim */}
          <linearGradient id="ps-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF385C" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#A31C1B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06110C" stopOpacity="0.9" />
          </linearGradient>

          {/* Laser Trajectory Gradient */}
          <linearGradient id="ps-laser" x1="20%" y1="20%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#FFA4B0" />
            <stop offset="35%" stopColor="#FF2E56" />
            <stop offset="100%" stopColor="#A31C1B" />
          </linearGradient>

          {/* Aperture Shutter Gradient */}
          <linearGradient id="ps-shutter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#171717" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#08140E" stopOpacity="0.95" />
          </linearGradient>

          {/* Crimson Neon Bloom Filter */}
          <filter id="ps-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="ps-target-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Outer Shield Squircle */}
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="24"
          fill="url(#ps-bg)"
          stroke="url(#ps-border)"
          strokeWidth="2.2"
        />

        {/* Ambient Inner Shadow Ring */}
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="21"
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="1"
        />

        {/* Spy Aperture Reticle Base */}
        <circle
          cx="48"
          cy="49"
          r="29"
          fill="url(#ps-shutter)"
          stroke="#A31C1B"
          strokeWidth="1.8"
          strokeOpacity="0.6"
        />

        {/* Aperture Blades (Spy Camera Lens Geometry) */}
        <g stroke="#A31C1B" strokeWidth="1.2" strokeOpacity="0.45" fill="none">
          <path d="M 48,20 C 58,26 68,36 71,46" />
          <path d="M 77,49 C 72,61 63,70 51,75" />
          <path d="M 48,78 C 36,73 27,63 24,51" />
          <path d="M 19,49 C 24,37 34,27 45,21" />
          <circle cx="48" cy="49" r="14" stroke="#A31C1B" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.4" />
        </g>

        {/* Telemetry Reticle Ticks */}
        <line x1="48" y1="14" x2="48" y2="18" stroke="#FF385C" strokeWidth="1.5" strokeOpacity="0.7" />
        <line x1="48" y1="80" x2="48" y2="84" stroke="#FF385C" strokeWidth="1.5" strokeOpacity="0.7" />
        <line x1="13" y1="49" x2="17" y2="49" stroke="#FF385C" strokeWidth="1.5" strokeOpacity="0.7" />
        <line x1="79" y1="49" x2="83" y2="49" stroke="#FF385C" strokeWidth="1.5" strokeOpacity="0.7" />

        {/* Glow Underlay for Forecast Line */}
        <path
          d="M 19,23 L 37,45 L 48,36 L 76,73"
          stroke="#A31C1B"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.45"
          filter="url(#ps-glow)"
        />

        {/* Dynamic Algorithmic Price Drop Line */}
        <path
          d="M 19,23 L 37,45 L 48,36 L 76,73"
          stroke="url(#ps-laser)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* High-Price Origin Node */}
        <circle cx="19" cy="23" r="3" fill="#FF8A9B" />

        {/* Mid-Inflection Volatility Node */}
        <circle cx="37" cy="45" r="2.5" fill="#FFA4B0" />
        <circle cx="48" cy="36" r="2.5" fill="#FF8A9B" />

        {/* Target Bullseye - "Market Low / Buy Zone" */}
        <g transform="translate(76, 73)">
          {/* Animated Pulsing Beacon Ring */}
          {animated && (
            <circle
              cx="0"
              cy="0"
              r="9"
              fill="none"
              stroke="#FF2E56"
              strokeWidth="1.2"
              className="animate-ping"
              style={{ transformOrigin: 'center', opacity: 0.75 }}
            />
          )}

          {/* Outer Target Ring */}
          <circle
            cx="0"
            cy="0"
            r="8.5"
            fill="#171717"
            stroke="#FF2E56"
            strokeWidth="2"
            filter="url(#ps-target-glow)"
          />

          {/* Middle Reticle Ring */}
          <circle
            cx="0"
            cy="0"
            r="5"
            fill="none"
            stroke="#A31C1B"
            strokeWidth="1.6"
          />

          {/* Bullseye Core Node */}
          <circle
            cx="0"
            cy="0"
            r="2.8"
            fill="#FFFFFF"
          />
        </g>
      </svg>

      {/* Optional Horizontal Brand Lockup */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-base sm:text-lg font-display font-bold text-white tracking-tight">
              PriceSpy
            </span>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#A31C1B]/20 border border-[#A31C1B]/40 text-rose-300">
              PRO
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 tracking-wider uppercase mt-0.5">
            Predictive Price Engine
          </span>
        </div>
      )}
    </div>
  );
}
