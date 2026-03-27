import { pgTable, serial, text, timestamp, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// Enum for Match Status
export const statusEnum = pgEnum('match_status', ['scheduled', 'live', 'finished']);

// MATCH Table (Static/Anchor)
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  homeTeam: text('home_team').notNull(),
  awayTeam: text('away_team').notNull(),
  sport: text('sport').notNull(),
  startTime: timestamp('start_time').notNull(),
  status: statusEnum('status').default('scheduled').notNull(),
  homeScore: integer('home_score').default(0).notNull(),
  awayScore: integer('away_score').default(0).notNull(),
});

// COMMENTARY Table (Dynamic/Story/Events)
export const commentaries = pgTable('commentaries', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').notNull().references(() => matches.id, { onDelete: 'cascade' }),
  actor: text('actor'), // Who (e.g., Player Name, Referee)
  message: text('message').notNull(), // What (The commentary text)
  minute: integer('minute'), // When (Minute in the match)
  sequenceNo: integer('sequence_no').notNull(), // Order
  details: jsonb('details'), // Flexible JSON bucket (Anything Bucket)
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
