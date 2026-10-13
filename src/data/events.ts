import records from "./events.json";
import { eventsSchema } from "./event-schema";
export type { KrowdEvent, EventType, EventRelationship } from "./event-schema";
export {
  relationshipLabels,
  typeLabels,
  kolkataToday,
  isUpcoming,
  formatEventDate,
} from "./event-utils";
export const events = eventsSchema.parse(records);
