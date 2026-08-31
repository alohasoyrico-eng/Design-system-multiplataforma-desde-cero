/** Capa modal. Generado desde contracts/overlay-shell.json. */
export interface OverlayShellProps {
  open: boolean;
  onClose: () => void;
  /** center=Dialog, end / side-start=Drawer, bottom=BottomSheet, start=palette. */
  align?: 'center' | 'start' | 'end' | 'side-start' | 'bottom';
  dismissOnBackdrop?: boolean;
  /** Id del titulo. Si no hay, usa label. */
  labelledBy?: string;
  label?: string;
  /** false para capas dentro de un contenedor relativo (marco de telefono). */
  fixed?: boolean;
  zIndex?: number;
  /** Un solo hijo: el panel. Recibe role, aria-modal, la animacion y el foco. */
  children: React.ReactElement;
  backdropStyle?: React.CSSProperties;
}
export declare function OverlayShell(props: OverlayShellProps): JSX.Element | null;
