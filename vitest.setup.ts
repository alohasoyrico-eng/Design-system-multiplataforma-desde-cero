import "@testing-library/jest-dom/vitest";
import { expect, vi } from "vitest";
import * as axeMatchers from "vitest-axe/matchers";

expect.extend(axeMatchers);

// jsdom does not implement canvas; stub getContext so axe's icon-ligature probe stays quiet.
HTMLCanvasElement.prototype.getContext = vi.fn(
  () => null,
) as unknown as typeof HTMLCanvasElement.prototype.getContext;
