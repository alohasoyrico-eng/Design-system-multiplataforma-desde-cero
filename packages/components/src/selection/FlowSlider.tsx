import { useCallback, type InputHTMLAttributes } from "react";
import "../../css/selection/Slider.css";

export type FlowSliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type">;

/** FlowSlider — a styled native range input. The filled track glows while dragging. */
export function FlowSlider({
  min = 0,
  max = 100,
  value,
  defaultValue,
  onInput,
  ...rest
}: FlowSliderProps) {
  const pctOf = (v: number) => ((v - Number(min)) / (Number(max) - Number(min))) * 100;
  const initial = pctOf(Number(value ?? defaultValue ?? min));

  const setPct = useCallback((el: HTMLInputElement | null) => {
    if (el)
      el.style.setProperty(
        "--flow-slider-pct",
        `${((Number(el.value) - Number(el.min || 0)) / (Number(el.max || 100) - Number(el.min || 0))) * 100}%`,
      );
  }, []);

  return (
    <input
      ref={setPct}
      type="range"
      className="flow-slider"
      min={min}
      max={max}
      value={value}
      defaultValue={defaultValue}
      style={{ ["--flow-slider-pct" as string]: `${initial}%` }}
      onInput={(e) => {
        setPct(e.currentTarget);
        onInput?.(e);
      }}
      {...rest}
    />
  );
}
