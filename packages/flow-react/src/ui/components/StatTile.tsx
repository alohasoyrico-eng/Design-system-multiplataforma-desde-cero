import type { CSSProperties, ReactNode } from "react";
import { Card } from "./Card";
import { Sparkline } from "../primitives/Sparkline";
import { Skeleton } from "../primitives/Skeleton";
import css from "./StatTile.module.css";

export interface StatTileProps {
  label: string;
  value: string | number;
  delta?: string;
  trend?: number[];
  icon?: string;
  tone?: "neutral" | "success" | "warning" | "danger";
  /** JUICIO del delta — el color verde/rojo. Sin él, se deriva del signo
      («+» sube = success), que solo vale cuando subir es bueno: en un KPI de
      gasto o consumo, «+330%» pintaba success (cazado en eOne). La flecha
      sigue diciendo la DIRECCIÓN por el signo; esto dice si es buena. */
  deltaTone?: "success" | "danger" | "neutral";
  /** Glifo de tendencia junto al delta. Con `deltaTone` en juego puede
      CONTRADECIR al color — trending_up (culturalmente «mejora») junto a un
      danger rojo manda dos señales opuestas (cazado en eOne: «↗ +325 %» en
      rojo). El signo del texto ya dice la dirección (stt-2); `false` deja
      signo + color, sin glifo que dispute. */
  deltaArrow?: boolean;
  /** Acción de la tarjeta en la esquina del encabezado — un IconButton
      (ajustar, abrir detalle). Nació de eOne: sus objetivos editables
      viven como StatTiles con el engrane a la vista. */
  action?: ReactNode;
  /** stt-8: la cifra SIN su tarjeta, para composiciones que ya tienen
      superficie propia — una fila de cifras dentro de un panel, una ficha
      dentro de una lámina. Sin esto el consumidor tenía dos salidas malas:
      anidar tarjeta dentro de tarjeta, o copiar a mano rótulo+cifra+nota
      (eOne lo hizo cinco veces en su organigrama y otras tantas en la ficha
      de estación, calcando estas mismas declaraciones). Mismo escape que
      `LimitBar.bare`. */
  bare?: boolean;
  description?: string;
  loading?: boolean;
  style?: CSSProperties;
}

export function StatTile({
  label,
  value,
  delta,
  trend,
  icon,
  tone = "neutral",
  deltaTone,
  deltaArrow = true,
  action,
  bare,
  description,
  loading,
  style,
}: StatTileProps) {
  const toneColor =
    tone === "success"
      ? "var(--status-success-text)"
      : tone === "danger"
        ? "var(--status-danger-text)"
        : tone === "warning"
          ? "var(--status-warning-text)"
          : "var(--text-muted)";

  const deltaUp = delta && (delta.startsWith("+") || delta.startsWith("↑"));
  const deltaDown =
    delta &&
    (delta.startsWith("-") || delta.startsWith("−") || delta.startsWith("↓"));
  const judgement =
    deltaTone ?? (deltaUp ? "success" : deltaDown ? "danger" : "neutral");
  const deltaColor =
    judgement === "success"
      ? "var(--status-success-text)"
      : judgement === "danger"
        ? "var(--status-danger-text)"
        : "var(--text-muted)";
  const deltaIcon = deltaUp
    ? "trending_up"
    : deltaDown
      ? "trending_down"
      : "trending_flat";

  // stt-6: en loading la cifra no existe — esqueleto oculto al lector, sin datos falsos
  /* La SUPERFICIE es del Card — una sola tarjeta en el sistema. StatTile
     dibujaba la suya propia (borde + sombra a la vez: un híbrido que no
     existe en el vocabulario del Card) y cualquier tarjeta vecina
     desentonaba por construcción (cazado en eOne, 7-sep). */
  if (loading) {
    return envolver(
      bare,
      style,
      <div className={css.root} aria-busy="true">
        <div className={css.header}>
          <span className={css.label}>{label}</span>
        </div>
        <div className={css.body}>
          <Skeleton variant="title" width={96} height={28} />
        </div>
        <Skeleton variant="text" width={64} />
      </div>,
    );
  }

  return envolver(
    bare,
    style,
    <div className={css.root}>
      <div className={css.header}>
        {icon && (
          <span
            className={`flow-symbol flow-symbol--md ${css.toneIcon}`}
            aria-hidden="true"
            style={{ color: toneColor }}
          >
            {icon}
          </span>
        )}
        <span className={css.label}>{label}</span>
        {action && <span className={css.action}>{action}</span>}
      </div>
      <div className={css.body}>
        <div className={css.value}>{value}</div>
        {trend && (
          <Sparkline
            values={trend}
            width={88}
            height={32}
            showDot={false}
            color={deltaDown ? "var(--status-danger)" : "var(--action-accent)"}
            aria-hidden="true"
            style={{ marginLeft: "auto", flexShrink: 0 }}
          />
        )}
      </div>
      {delta && (
        <div className={css.delta} style={{ color: deltaColor }}>
          {deltaArrow && (
            <span
              className={`flow-symbol flow-symbol--xs ${css.deltaIcon}`}
              aria-hidden="true"
            >
              {deltaIcon}
            </span>
          )}
          {delta}
        </div>
      )}
      {description && <p className={css.description}>{description}</p>}
    </div>,
  );
}

/* stt-8: la superficie se decide en UN sitio, y con una función que devuelve
   elementos — no con un componente definido dentro del render: eso cambiaría
   de tipo en cada pasada y React remontaría la tarjeta entera. */
function envolver(
  bare: boolean | undefined,
  style: CSSProperties | undefined,
  interior: ReactNode,
) {
  return bare ? (
    <div style={style}>{interior}</div>
  ) : (
    <Card padding="md" style={style}>
      {interior}
    </Card>
  );
}
