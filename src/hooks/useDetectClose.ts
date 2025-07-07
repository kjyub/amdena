import { useState, useEffect, useRef } from 'react';

export const useDetectClose = <T extends HTMLElement>(): [
  React.MutableRefObject<T | null>,
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] => {
  const ref = useRef<T | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const pageClickEvent = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(!isOpen);
      }
    };

    if (isOpen) {
      window.addEventListener('click', pageClickEvent);
    }

    return () => {
      window.removeEventListener('click', pageClickEvent);
    };
  }, [isOpen]);

  return [ref, isOpen, setIsOpen];
};
