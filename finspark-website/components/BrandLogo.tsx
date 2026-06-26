import { useId } from "react";

export default function BrandLogo({ className }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4D03F" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="#0A0A0F" stroke={`url(#${gradientId})`} strokeWidth="2" />
      <text
        x="24"
        y="31"
        fontFamily="Playfair Display, Georgia, serif"
        fontSize="18"
        fontWeight="900"
        fill={`url(#${gradientId})`}
        textAnchor="middle"
      >
        FS
      </text>
    </svg>
  );
}
