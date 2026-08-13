export function LogoIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <circle cx="45" cy="45" r="45" fill="#1D4ED8" />
      <path
        d="M 25 55 L 40 35 L 50 45 L 65 25"
        stroke="#FFFFFF"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 55 25 L 65 25 L 65 35"
        stroke="#FFFFFF"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({
  size = 32,
  textSize,
  showWordmark = true,
  className = "",
}: {
  size?: number;
  textSize?: number;
  showWordmark?: boolean;
  className?: string;
}) {
  const wordmarkSize = textSize ?? Math.round(size * 0.5);

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={size} />
      {showWordmark && (
        <span
          className="tracking-tight"
          style={{ fontSize: wordmarkSize, fontWeight: 800, lineHeight: 1 }}
        >
          <span style={{ color: "#1D4ED8" }}>brique</span>
          <span style={{ color: "#3B82F6" }}>.gg</span>
        </span>
      )}
    </span>
  );
}
