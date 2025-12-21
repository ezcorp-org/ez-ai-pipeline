export const APP_NAME = "EZ Ai Pipeline";
export const APP_VERSION = "1.3.0";
export const APP_DESCRIPTION = "Prompt Optimization with Cost-Efficient Model Selection";

export const DEFAULT_TIMEOUT_MS = 60000;
export const DEFAULT_MAX_RETRIES = 2;
export const DEFAULT_MAX_TOKENS = 4096;
export const DEFAULT_TEMPERATURE = 0.7;

export const PIPELINES_DIR = "./pipelines";
export const OUTPUTS_DIR = "./outputs";

export const RETRY_DELAYS = [1000, 2000, 4000];

export const COLORS = {
  primary: "#00bcd4",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  info: "#2196f3",
  muted: "#9e9e9e",
} as const;

export const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
