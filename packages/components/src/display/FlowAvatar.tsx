import type { HTMLAttributes } from "react";
import "../../css/display/Avatar.css";

export type AvatarSize = "sm" | "md" | "lg";
export type Presence = "online" | "busy" | "offline";

export interface FlowAvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Full name — used for initials and as the accessible label when no image is set. */
  name: string;
  /** Optional image URL. */
  src?: string;
  size?: AvatarSize;
  presence?: Presence;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** FlowAvatar — user chip with initials or image and an optional presence dot. */
export function FlowAvatar({ name, src, size = "md", presence, ...rest }: FlowAvatarProps) {
  return (
    <span className="flow-avatar" data-size={size} {...rest}>
      {src ? (
        <img className="flow-avatar__img" src={src} alt={name} />
      ) : (
        <span className="flow-avatar__initials" aria-label={name} role="img">
          {initials(name)}
        </span>
      )}
      {presence && (
        <span className="flow-avatar__presence" data-presence={presence} aria-hidden="true" />
      )}
    </span>
  );
}
