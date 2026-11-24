const paths = {
  search: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-4.3-4.3" />,
  bag: <path d="M5 8h14l-1 12H6L5 8ZM9 8V6a3 3 0 0 1 6 0v2" />,
  truck: <path d="M3 6h11v10H3V6ZM14 10h4l3 3v3h-7M7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />,
  cake: <path d="M4 20h16M5 20v-6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6M12 13V9M12 6.5c.8-.9.8-1.6 0-2.5-.8.9-.8 1.6 0 2.5Z" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  cap: <path d="M2 9l10-5 10 5-10 5L2 9ZM6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />,
  home: <path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6" />,
  gift: <path d="M3 8h18v4H3V8ZM12 8v13M5 12v8h14v-8M7.5 8a2.5 2.5 0 1 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 1 1 0 5" />,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  layers: <path d="M12 3l9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17.5l9 5 9-5" />,
  sliders: <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6" />,
  receipt: <path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3ZM9 8h6M9 12h6" />,
};

export default function Icon({ name, width = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
