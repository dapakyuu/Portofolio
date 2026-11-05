import { useInView } from "../hooks/useInView";

/** Animasi muncul saat elemen masuk ke layar. */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  direction = "up",
  className = "",
  children,
  ...rest
}) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${direction} ${inView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
