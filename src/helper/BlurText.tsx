import { motion } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";
// Import necessary types from React and the Framer Motion-compatible types
import type { CSSProperties } from "react"; // refac: removed , RefObject

// We must define these types as they are not exported by the minimal "motion/react" path
// A flexible type for animation properties (CSS values, numbers for transform)
type AnimationValue = string | number;
type AnimationSnapshot = Record<string, AnimationValue>;
type KeyframeSet = Record<string, AnimationValue[]>;

/**
 * Generates an object of keyframes compatible with Framer Motion's `animate` prop.
 */
const buildKeyframes = (
  from: AnimationSnapshot,
  steps: AnimationSnapshot[]
): KeyframeSet => {
  const keys = new Set([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: KeyframeSet = {};
  keys.forEach((k) => {
    // Assert key existence and filter out undefined values
    keyframes[k] = [from[k], ...steps.map((s) => s[k])].filter(
      (val) => val !== undefined
    ) as AnimationValue[];
  });
  return keyframes;
};

// Define the Props interface
interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "chars";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: AnimationSnapshot;
  animationTo?: AnimationSnapshot[];
  // Transition's easing can be a function (t: number) => number, or a string/array (but we default to function)
  easing?: ((t: number) => number) | string | number[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
}

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  // Explicitly type the default easing function parameter
  easing = (t: number) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  // Explicit type for elements array
  const elements: string[] =
    animateBy === "words" ? text.split(" ") : text.split("");

  const [inView, setInView] = useState<boolean>(false);

  // Explicit type for the ref
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const currentRef = ref.current; // Capture ref.current for clean-up

    // Type the entry parameter explicitly
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(currentRef);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, rootMargin]);

  // Explicit type for defaultFrom
  const defaultFrom: AnimationSnapshot = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  );

  // Explicit type for defaultTo
  const defaultTo: AnimationSnapshot[] = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot: AnimationSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots: AnimationSnapshot[] = animationTo ?? defaultTo;

  const stepCount: number = toSnapshots.length + 1;
  const totalDuration: number = stepDuration * (stepCount - 1);
  const times: number[] = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  return (
    <p
      ref={ref}
      className={className}
      // Explicitly type the style object
      style={{ display: "flex", flexWrap: "wrap" } as CSSProperties}
    >
      {elements.map((segment, index) => {
        // Explicit type for the computed keyframes
        const animateKeyframes: KeyframeSet = buildKeyframes(
          fromSnapshot,
          toSnapshots
        );

        // REMOVE the local type definition for MotionTransition
        // type MotionTransition = { ... };

        // Define a flexible type for the transition object
        const spanTransition: {
          duration: number;
          times: number[];
          delay: number;
          ease?: ((t: number) => number) | string | number[];
        } = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000,
        };
        spanTransition.ease = easing;

        // Use a union type for the 'animate' prop (snapshot or keyframes)
        const animateProp: AnimationSnapshot | KeyframeSet = inView
          ? animateKeyframes
          : fromSnapshot;

        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            key={index}
            initial={fromSnapshot}
            animate={animateProp}
            // FIX: Use 'as any' to assert the type and bypass the compiler error.
            // This is necessary because the minimal "motion/react" import doesn't
            // provide the full 'Transition' type definition for 'ease'.
            transition={spanTransition as any}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
          >
            {segment === " " ? "\u00A0" : segment}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;
