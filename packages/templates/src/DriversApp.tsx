import { useState } from "react";
import { Stack, Inline, Grid, Text } from "@flowds/primitives";
import {
  FlowCard,
  FlowButton,
  FlowSwitch,
  FlowBadge,
  FlowStatTile,
  FlowAvatar,
  FlowMapCanvas,
  type MapPin,
} from "@flowds/components";
import "../css/DriversApp.css";

export interface IncomingTrip {
  pickup: string;
  dropoff: string;
  fare: string;
  eta: string;
}

export interface DriversAppProps {
  driver: string;
  earningsToday: string;
  trips: string;
  /** Demand pins for the map. */
  demand?: MapPin[];
  incoming?: IncomingTrip;
}

/** DriversApp — mobile driver home: connect to shift, see demand, accept trips. */
export function DriversApp({
  driver,
  earningsToday,
  trips,
  demand = [],
  incoming,
}: DriversAppProps) {
  const [online, setOnline] = useState(false);

  return (
    <div className="flow-driver">
      <Stack gap="5">
        <Inline justify="between" align="center">
          <Inline gap="3" align="center">
            <FlowAvatar name={driver} presence={online ? "online" : "offline"} />
            <Stack gap="1">
              <Text variant="body-strong" as="span">
                {driver}
              </Text>
              <FlowBadge tone={online ? "success" : "neutral"} live={online}>
                {online ? "En línea" : "Desconectado"}
              </FlowBadge>
            </Stack>
          </Inline>
        </Inline>

        <FlowCard>
          <Inline justify="between" align="center" gap="4">
            <Stack gap="1">
              <Text variant="title-sm" as="h2">
                {online ? "Estás en turno" : "Conéctate a tu turno"}
              </Text>
              <Text variant="caption" color="muted">
                {online
                  ? "Recibiendo viajes cerca de ti."
                  : "Actívate para empezar a recibir viajes."}
              </Text>
            </Stack>
            <FlowSwitch
              checked={online}
              onChange={(e) => setOnline(e.target.checked)}
              label="En línea"
            />
          </Inline>
        </FlowCard>

        <FlowMapCanvas ariaLabel="Demanda cerca de ti" pins={demand} />

        <Grid columns="repeat(2, 1fr)" gap="4">
          <FlowStatTile label="Ganancias hoy" value={earningsToday} detail="+8%" />
          <FlowStatTile label="Viajes" value={trips} detail="hoy" />
        </Grid>

        {online && incoming && (
          <FlowCard>
            <Stack gap="4">
              <Inline justify="between" align="center">
                <Text variant="title-sm" as="h3">
                  Viaje entrante
                </Text>
                <Text variant="data" color="accent" as="span">
                  {incoming.fare}
                </Text>
              </Inline>
              <Stack gap="2">
                <Text variant="body" color="secondary">
                  Recoger en <strong>{incoming.pickup}</strong> · {incoming.eta}
                </Text>
                <Text variant="body" color="secondary">
                  Destino: {incoming.dropoff}
                </Text>
              </Stack>
              <Inline gap="3">
                <FlowButton variant="ghost" fullWidth>
                  Rechazar
                </FlowButton>
                <FlowButton variant="accent" fullWidth>
                  Aceptar
                </FlowButton>
              </Inline>
            </Stack>
          </FlowCard>
        )}
      </Stack>
    </div>
  );
}
