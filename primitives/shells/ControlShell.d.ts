/** Carcasa unica de todo control de formulario. Generado desde contracts/control-shell.json. */
export interface ControlShellProps {
  size?: 'sm' | 'md' | 'lg';
  invalid?: boolean;
  disabled?: boolean;
  /** Padding en bloque y contenido estirado, para Textarea. */
  multiline?: boolean;
  /** Glifo Material Symbols o nodo. Si es glifo, la carcasa lo tinta segun foco. */
  leading?: string | React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
  onShellClick?: () => void;
  style?: React.CSSProperties;
}
export declare function ControlShell(props: ControlShellProps): JSX.Element;
