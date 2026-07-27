import { useRef, useState, type TouchEvent } from "react";
import { FlowIcon } from "@flowds/primitives";
import "../../css/navigation/OnboardingCarousel.css";

export interface OnboardingSlide {
  /** Material Symbols name shown in the illustration circle. */
  icon?: string;
  title: string;
  description: string;
}

export interface FlowOnboardingCarouselProps {
  slides: OnboardingSlide[];
  onDone?: () => void;
  doneLabel?: string;
  backLabel?: string;
  nextLabel?: string;
}

/** FlowOnboardingCarousel — dot-paginated intro slides with swipe + keyboard. */
export function FlowOnboardingCarousel({
  slides,
  onDone,
  doneLabel = "Empezar",
  backLabel = "Atrás",
  nextLabel = "Siguiente",
}: FlowOnboardingCarouselProps) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const last = index === slides.length - 1;
  const slide = slides[index];

  const go = (i: number) => setIndex(Math.max(0, Math.min(slides.length - 1, i)));

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx < -40) go(index + 1);
    else if (dx > 40) go(index - 1);
    touchX.current = null;
  };

  return (
    <div
      className="flow-onboarding"
      role="group"
      aria-roledescription="carrusel"
      aria-label={`Paso ${index + 1} de ${slides.length}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flow-onboarding__slide">
        <span className="flow-onboarding__illustration" aria-hidden="true">
          <FlowIcon name={slide.icon ?? "bolt"} filled size="xl" />
        </span>
        <h2 className="flow-onboarding__title">{slide.title}</h2>
        <p className="flow-onboarding__desc">{slide.description}</p>
      </div>

      <div className="flow-onboarding__dots" aria-hidden="true">
        {slides.map((_, i) => (
          <span key={i} className="flow-onboarding__dot" data-active={i === index || undefined} />
        ))}
      </div>

      <div className="flow-onboarding__nav">
        <button
          type="button"
          className="flow-onboarding__back"
          onClick={() => go(index - 1)}
          disabled={index === 0}
        >
          {backLabel}
        </button>
        <button
          type="button"
          className="flow-onboarding__next"
          onClick={() => (last ? onDone?.() : go(index + 1))}
        >
          {last ? doneLabel : nextLabel}
        </button>
      </div>
    </div>
  );
}
