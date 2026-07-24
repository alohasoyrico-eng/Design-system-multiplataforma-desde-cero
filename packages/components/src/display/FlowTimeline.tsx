import type { ReactNode } from "react";
import "../../css/display/Timeline.css";

export interface TimelineItem {
  title: ReactNode;
  time: string;
  description?: ReactNode;
}

export interface FlowTimelineProps {
  items: TimelineItem[];
}

/** FlowTimeline — vertical activity history for a record. */
export function FlowTimeline({ items }: FlowTimelineProps) {
  return (
    <ol className="flow-timeline">
      {items.map((item, i) => (
        <li key={i} className="flow-timeline__item">
          <span className="flow-timeline__dot" aria-hidden="true" />
          <div className="flow-timeline__body">
            <div className="flow-timeline__head">
              <span className="flow-timeline__title">{item.title}</span>
              <time className="flow-timeline__time">{item.time}</time>
            </div>
            {item.description && <p className="flow-timeline__desc">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
