export interface OnboardingSlide { icon?: string; illustration?: React.ReactNode; title: string; description?: string; }
/** Full-screen onboarding: illustration + dots + swipe, for Drivers App / onboarding móvil. */
export interface OnboardingCarouselProps {
  slides: OnboardingSlide[];
  index?: number;
  onIndexChange?: (index: number) => void;
  onSkip?: () => void;
  onDone?: () => void;
  skipLabel?: string;
  doneLabel?: string;
  style?: React.CSSProperties;
}
export declare function OnboardingCarousel(props: OnboardingCarouselProps): JSX.Element;
