/** Permissions x roles matrix with grouped rows and lockable roles. */
export interface RoleMatrixProps {
  roles: Array<{ id: string; label: string; locked?: boolean }>;
  permissions: Array<{ id: string; label: string; group?: string }>;
  /** {permId: {roleId: boolean}} */
  values: Record<string, Record<string, boolean>>;
  onChange?: (next: RoleMatrixProps['values'], permId: string, roleId: string) => void;
  style?: React.CSSProperties;
}
export declare function RoleMatrix(props: RoleMatrixProps): JSX.Element;
