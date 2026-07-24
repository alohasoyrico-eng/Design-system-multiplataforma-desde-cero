import { useState } from "react";
import {
  FlowOnboardingCarousel,
  FlowStatusView,
  FlowButton,
  type OnboardingSlide,
} from "@flow/components";
import "../css/OnboardingScreen.css";

export interface OnboardingScreenProps {
  slides: OnboardingSlide[];
  onFinish?: () => void;
}

/** OnboardingScreen — mobile intro flow: swipeable slides → success state. */
export function OnboardingScreen({ slides, onFinish }: OnboardingScreenProps) {
  const [done, setDone] = useState(false);
  return (
    <div className="flow-onboarding-screen">
      {done ? (
        <FlowStatusView
          tone="success"
          title="¡Todo listo!"
          message="Tu cuenta está activa. La ciudad es tu turno."
          primaryAction={
            <FlowButton variant="accent" size="lg" onClick={onFinish}>
              Entrar
            </FlowButton>
          }
        />
      ) : (
        <FlowOnboardingCarousel slides={slides} onDone={() => setDone(true)} />
      )}
    </div>
  );
}
