#!/usr/bin/env bun

import { runCLI } from "@cli/index.ts";

// Handle unhandled rejections
process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled rejection:", reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught exception:", error.message);
  process.exit(1);
});

// Run the CLI
runCLI();
