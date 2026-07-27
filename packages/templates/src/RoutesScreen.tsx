import { Stack, Inline, Text, FlowIcon } from "@flowds/primitives";
import { FlowCard, FlowMapCanvas, type MapPin } from "@flowds/components";
import "../css/RoutesScreen.css";

export interface Station {
  name: string;
  price: string;
  distance: string;
}

export interface RoutesScreenProps {
  pins: MapPin[];
  route?: { x: number; y: number }[];
  stations: Station[];
}

/** RoutesScreen — mobile map of stations with prices + a nearby list. */
export function RoutesScreen({ pins, route, stations }: RoutesScreenProps) {
  return (
    <div className="flow-routes">
      <Stack gap="5">
        <Text variant="title-lg" as="h1">
          Estaciones cerca
        </Text>
        <div className="flow-routes__map">
          <FlowMapCanvas ariaLabel="Estaciones y ruta" pins={pins} route={route} />
        </div>
        <FlowCard>
          <Stack gap="0">
            {stations.map((s) => (
              <Inline
                key={s.name}
                className="flow-routes__row"
                justify="between"
                align="center"
                gap="4"
              >
                <Inline gap="3" align="center">
                  <span className="flow-routes__icon" aria-hidden="true">
                    <FlowIcon name="ev_station" size="md" />
                  </span>
                  <Stack gap="1">
                    <Text variant="body-strong" as="span">
                      {s.name}
                    </Text>
                    <Text variant="caption" color="muted" as="span">
                      {s.distance}
                    </Text>
                  </Stack>
                </Inline>
                <Text variant="data" as="span">
                  {s.price}
                </Text>
              </Inline>
            ))}
          </Stack>
        </FlowCard>
      </Stack>
    </div>
  );
}
