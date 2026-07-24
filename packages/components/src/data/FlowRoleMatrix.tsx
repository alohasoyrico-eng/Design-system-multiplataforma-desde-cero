import { FlowIcon } from "@flow/primitives";
import "../../css/data/RoleMatrix.css";

export interface Permission {
  label: string;
  /** Whether each role (by column index) has this permission. */
  allowed: boolean[];
}

export interface FlowRoleMatrixProps {
  roles: string[];
  permissions: Permission[];
  caption: string;
}

/** FlowRoleMatrix — permissions × roles table. Check = allowed, dash = denied. */
export function FlowRoleMatrix({ roles, permissions, caption }: FlowRoleMatrixProps) {
  return (
    <div className="flow-role-matrix">
      <table className="flow-role-matrix__table">
        <caption className="flow-role-matrix__caption">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Permiso</th>
            {roles.map((r) => (
              <th key={r} scope="col">
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissions.map((p) => (
            <tr key={p.label}>
              <th scope="row">{p.label}</th>
              {roles.map((r, i) => (
                <td key={r} data-allowed={p.allowed[i] || undefined}>
                  {p.allowed[i] ? (
                    <FlowIcon name="check" size="md" filled label="Permitido" />
                  ) : (
                    <FlowIcon name="remove" size="md" label="Denegado" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
