import { Stack, Text } from "@flowds/primitives";
import { FlowRoleMatrix, type Permission } from "@flowds/components";
import "../css/ConfigScreen.css";

export interface ConfigScreenProps {
  roles: string[];
  permissions: Permission[];
}

/** ConfigScreen — roles & permissions administration. */
export function ConfigScreen({ roles, permissions }: ConfigScreenProps) {
  return (
    <div className="flow-config">
      <Stack gap="6">
        <Stack gap="2">
          <Text variant="title-lg" as="h1">
            Roles y permisos
          </Text>
          <Text variant="body" color="secondary">
            Controla qué puede hacer cada rol en Internal Tools.
          </Text>
        </Stack>
        <FlowRoleMatrix caption="Permisos por rol" roles={roles} permissions={permissions} />
      </Stack>
    </div>
  );
}
