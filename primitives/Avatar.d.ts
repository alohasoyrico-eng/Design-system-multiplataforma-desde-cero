/** Initials or photo avatar; deterministic color per name; optional presence dot. */
export interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Presence: online (green), busy (pulsing red), offline (gray). */
  status?: 'online' | 'busy' | 'offline';
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
