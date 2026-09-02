import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function currentPreference() {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(currentPreference);

  useEffect(() => {
    const query = window.matchMedia(QUERY);
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
