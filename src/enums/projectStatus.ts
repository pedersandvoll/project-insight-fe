export enum ProjectStatus {
  Concept = 0, // Project is at the idea stage, being explored.
  Planning = 1, // Project approved, defining scope, timeline, etc.
  ReadyToStart = 2, // Planning complete, awaiting formal initiation.

  InProgress = 3, // Project is actively running.
  OnHold = 4, // Project is temporarily paused.
  Delayed = 5, // Project is behind schedule.
  Issues = 6, // Serious problems hindering progress.

  Completed = 7, // Project has been finalized.
  Cancelled = 8, // Project officially stopped before completion.
}
