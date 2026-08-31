/** OpenStreetMap tile map with price pins and optional dotted route. Attribution included. */
export interface MapPin { id: string; lat: number; lng: number; label: string; icon?: string; ariaLabel?: string; }
export interface MapCanvasProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  width?: string | number;
  height?: string | number;
  pins?: MapPin[];
  selectedId?: string;
  onPinClick?: (pin: MapPin) => void;
  /** Polyline of {lat,lng} — dotted accent route. */
  route?: Array<{ lat: number; lng: number }>;
  dark?: boolean;
  style?: React.CSSProperties;
}
export declare function MapCanvas(props: MapCanvasProps): JSX.Element;
