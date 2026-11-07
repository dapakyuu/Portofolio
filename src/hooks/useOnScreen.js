import { useEffect, useRef, useState } from "react";

/**
 * Mengembalikan [ref, onScreen]. Berbeda dengan useInView, nilainya ikut berubah
 * setiap kali elemen keluar/masuk layar, jadi animasi bisa diputar ulang.
 */
export function useOnScreen({ threshold = 0.4, rootMargin = "0px" } = {}) {
  const ref = useRef(null);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      threshold,
      rootMargin,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, onScreen];
}
