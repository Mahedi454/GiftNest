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
  grid: <path d="M4 4h6v6H4V4ZM14 4h6v6h-6V4ZM4 14h6v6H4v-6ZM14 14h6v6h-6v-6Z" />,
  box: <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3ZM4 7.5l8 4.5 8-4.5M12 12v9" />,
  users: <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM20 19v-1a4 4 0 0 0-3-3.9M15.5 4.2a3.5 3.5 0 0 1 0 6.6" />,
  wallet: <path d="M4 7a2 2 0 0 1 2-2h12v4M4 7v10a2 2 0 0 0 2 2h14V9H6a2 2 0 0 1-2-2ZM16 14h2" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5H5V6h5" />,
  logout: <path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9" />,
  alert: <path d="M12 9v4M12 17h.01M10.3 4l-8 14h19.4l-8-14a2 2 0 0 0-3.4 0Z" />,
  tag: <path d="M3 12V4h8l10 10-8 8L3 12ZM7.5 8.5h.01" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  clock: <path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4ZM13 7l4 4" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
  user: <path d="M20 21v-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v1M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
  lock: <path d="M6 11h12v9H6v-9ZM8.5 11V8a3.5 3.5 0 0 1 7 0v3" />,
  pin: <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  chat: <path d="M4 5h16v11H9l-5 4V5ZM8 9.5h8M8 12.5h5" />,
  receipt: <path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3ZM9 8h6M9 12h6" />,
};

export default function Icon({ name, width = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
