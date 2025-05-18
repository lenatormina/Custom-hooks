import { useState, useRef, useEffect } from "react";

type UseHoverReturn <T extends HTMLElement> = {
  hovered: boolean;
  ref: React.RefObject<T | null>;
};

export function useHover<T extends HTMLElement = HTMLElement>(): UseHoverReturn<T> {
  const [hovered, setHover] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.addEventListener("mouseover", () => setHover(true));
    node.addEventListener("mouseout", () => setHover(false));

    return () => {
      node.removeEventListener("mouseover", () => setHover(true));
      node.removeEventListener("mouseout", () => setHover(false));
    };
  }, []);

  return { hovered, ref };  
}
