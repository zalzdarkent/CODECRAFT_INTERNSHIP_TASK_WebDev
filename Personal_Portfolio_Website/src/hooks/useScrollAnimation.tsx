"use client";

import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  delay?: number;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, triggerOnce = true, delay = 0 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, triggerOnce, delay]);

  return { ref, isVisible };
};

// Predefined animation classes
export const animations = {
  fadeInUp: {
    initial: "opacity-0 translate-y-8",
    animate: "opacity-100 translate-y-0",
    transition: "transition-all duration-700 ease-out"
  },
  fadeInDown: {
    initial: "opacity-0 -translate-y-8",
    animate: "opacity-100 translate-y-0",
    transition: "transition-all duration-700 ease-out"
  },
  fadeInLeft: {
    initial: "opacity-0 -translate-x-8",
    animate: "opacity-100 translate-x-0",
    transition: "transition-all duration-700 ease-out"
  },
  fadeInRight: {
    initial: "opacity-0 translate-x-8",
    animate: "opacity-100 translate-x-0",
    transition: "transition-all duration-700 ease-out"
  },
  fadeIn: {
    initial: "opacity-0",
    animate: "opacity-100",
    transition: "transition-opacity duration-700 ease-out"
  },
  scaleIn: {
    initial: "opacity-0 scale-95",
    animate: "opacity-100 scale-100",
    transition: "transition-all duration-700 ease-out"
  },
  slideInLeft: {
    initial: "opacity-0 -translate-x-16",
    animate: "opacity-100 translate-x-0",
    transition: "transition-all duration-800 ease-out"
  },
  slideInRight: {
    initial: "opacity-0 translate-x-16",
    animate: "opacity-100 translate-x-0",
    transition: "transition-all duration-800 ease-out"
  }
};
