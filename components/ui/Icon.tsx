/**
 * Íconos SVG inline (sin dependencias). Trazo fino, coherente con la estética limpia.
 * Incluye el isotipo "estrella" de la marca.
 */
type IconProps = { name: string; className?: string };

const paths: Record<string, React.ReactNode> = {
  tech: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <line x1="11" y1="18.5" x2="13" y2="18.5" />
    </>
  ),
  appliance: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <line x1="5" y1="8" x2="19" y2="8" />
      <circle cx="8" cy="5.5" r="0.4" />
      <circle cx="11" cy="5.5" r="0.4" />
      <circle cx="12" cy="14.5" r="3" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M6 9.5V20h12V9.5" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  shirt: (
    <path d="M8 3 4 6l2 2.5L7.5 7v13h9V7L18 8.5 20 6l-4-3-2 1.8a2.2 2.2 0 0 1-4 0Z" />
  ),
  shoe: (
    <path d="M3 16.5V11l5 .5 4 3.5 8 .8c1 .1 1.5.8 1.5 2v.7H3Z M8 11.5 9.5 9" />
  ),
  toy: (
    <>
      <circle cx="12" cy="13" r="6" />
      <path d="M9.5 4.5 12 7l2.5-2.5" />
      <circle cx="12" cy="13" r="1.6" />
    </>
  ),
  baby: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c1.5-4 4-6 7-6s5.5 2 7 6" />
      <circle cx="10.5" cy="8" r="0.4" />
      <circle cx="13.5" cy="8" r="0.4" />
    </>
  ),
  sport: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c3 2.5 3 14.5 0 17M12 3.5c-3 2.5-3 14.5 0 17" />
    </>
  ),
  star: <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.9 6.1 21.2l1.3-6.6L2.5 9.4l6.6-.8z" />,
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  whatsapp: (
    <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3Zm0 2a7 7 0 0 1 5.9 10.8.9.9 0 0 0-.1.8l.4 1.4-1.5-.4a.9.9 0 0 0-.7.1A7 7 0 1 1 12 5Zm-2.4 3.2c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2 0 1.2.9 2.4 1 2.5.1.2 1.7 2.7 4.2 3.7 2 .8 2.4.6 2.9.6.5 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.2-.5-.3l-1.5-.7c-.2-.1-.4-.1-.5.1l-.6.8c-.1.2-.3.2-.5.1-.6-.2-1.3-.5-2-1.3-.5-.6-.9-1.2-1-1.4-.1-.2 0-.3.1-.5l.4-.5c.1-.1.1-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4Z" />
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5 10 17l9-10" />,
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 6.5 7 9 4-2.5 7-5 7-9V6Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </>
  ),
  sparkle: (
    <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" />
  ),
  chat: (
    <path d="M4 5h16v11H9l-5 4z" />
  ),
  refresh: (
    <>
      <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16" />
      <path d="M4 20v-4h4" />
    </>
  ),
  store: (
    <>
      <path d="M4 9 5.5 4h13L20 9" />
      <path d="M4 9h16v2.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-4-.5z" />
      <path d="M5 12.5V20h14v-7.5" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12 12 3h8v8l-9 9z" />
      <circle cx="16" cy="8" r="1.3" />
    </>
  ),

  /* --- Panel interno: tipos de pieza y navegación (monocromo, trazo fino) --- */
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v3.5M16 3v3.5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20h16" />
      <rect x="5" y="11" width="3.2" height="6" rx="1" />
      <rect x="10.4" y="6.5" width="3.2" height="10.5" rx="1" />
      <rect x="15.8" y="13" width="3.2" height="4" rx="1" />
    </>
  ),
  film: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="M3.5 9.2h17M3.5 14.8h17M9 5v14M15 5v14" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M4 16.5l4.5-4.2 3.5 3 3-2.6L20.5 16" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 21 8l-9 5-9-5z" />
      <path d="M3.2 13 12 18l8.8-5" />
    </>
  ),
  broadcast: (
    <>
      <circle cx="12" cy="12" r="2.3" />
      <path d="M7.9 7.9a5.8 5.8 0 0 0 0 8.2M16.1 7.9a5.8 5.8 0 0 1 0 8.2" />
      <path d="M5 5a9.8 9.8 0 0 0 0 14M19 5a9.8 9.8 0 0 1 0 14" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="12.5" height="12" rx="2.5" />
      <path d="M15.5 10l5-2.5v9l-5-2.5z" />
    </>
  ),
  bolt: <path d="M13 2.5 4.7 13.2H11l-1 8.3L19.3 10H13z" />,
  alert: (
    <>
      <path d="M12 3.5 2.8 19.5h18.4z" />
      <path d="M12 10v4.2M12 17.3v.4" />
    </>
  ),
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.3 11 15.3 16.3 9" />
    </>
  ),
};

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? paths.sparkle}
    </svg>
  );
}
