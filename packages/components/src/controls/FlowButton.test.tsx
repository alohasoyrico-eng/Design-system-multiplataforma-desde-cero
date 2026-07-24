import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { FlowButton } from "./FlowButton";
import { FlowIconButton } from "./FlowIconButton";

describe("FlowButton", () => {
  it("renders its label and variant", () => {
    render(<FlowButton variant="accent">Iniciar sesión</FlowButton>);
    const btn = screen.getByRole("button", { name: "Iniciar sesión" });
    expect(btn).toHaveAttribute("data-variant", "accent");
  });

  it("is disabled and busy while loading", () => {
    render(<FlowButton loading>Cargando</FlowButton>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<FlowButton variant="primary">Guardar</FlowButton>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("FlowIconButton", () => {
  it("exposes its required accessible name", () => {
    render(<FlowIconButton icon="notifications" ariaLabel="Notificaciones" />);
    expect(screen.getByRole("button", { name: "Notificaciones" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<FlowIconButton icon="favorite" ariaLabel="Favorito" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
