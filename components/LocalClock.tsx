"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Krasnoyarsk",
});

export default function LocalClock({ className }: { className?: string }) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const timer = window.setInterval(tick, 15000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className={className}>
      KJA <time>{time}</time>
    </span>
  );
}
