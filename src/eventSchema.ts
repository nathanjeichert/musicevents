// Event Schema using Zod for Structured Outputs

import { z } from 'zod';

export const EventSchema = z.object({
  title: z.string({
    required_error: "Title is required"
  }),
  date: z.string({
    required_error: "Date is required"
  }),
  location: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional()
});

export type Event = z.infer<typeof EventSchema>;

// Example usage:
// const eventData = {
//   title: "Science Fair",
//   date: "2025-03-15",
//   location: "City Hall",
//   description: "A community science fair.",
//   url: "https://example.com/event"
// };
//
// const parseResult = EventSchema.safeParse(eventData);
// if (!parseResult.success) {
//   console.error("Validation failed:", parseResult.error.format());
// } else {
//   console.log("Valid event data:", parseResult.data);
// }
