const USER_STATUS = Object.freeze({
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  DELETED: 4,
});

// KIF Processing Constants
const KIF_PROCESSING = Object.freeze({
  BUCKET_NAME: 'kif',
  AI_MODEL: 'gemini-2.5-flash-lite',
  PROCESSING_DELAY: 1000,
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024, // 50MB
  PDF_EXTENSION: '.pdf'
});

const EXIT_CODES = Object.freeze({
  SUCCESS: 0,
  ERROR: 1
});

// CLI Configuration
const CLI_OPTIONS = Object.freeze({
  DRY_RUN: ['--dry-run', '-d'],
  VERBOSE: ['--verbose', '-v'],
  HELP: ['--help', '-h'],
  HEALTH_CHECK: ['--health'],
  INCLUDE_DATA: ['--include-data'],
  RESET_PROCESSING: ['--reset-processing'],
  FORCE: ['--force'],
  MAX_PREFIX: '--max='
});

const DISPLAY_ICONS = Object.freeze({
  SUCCESS: '✅',
  ERROR: '❌',
  INFO: '📊',
  PROGRESS: '📈',
  WARNING: '⚠️',
  SKIP: '⏭️',
  TIME: '⏱️',
  DOCUMENT: '📄',
  HEALTH: '🏥',
  CONFIG: '📦',
  ROBOT: '🤖'
});

// Supabase Configuration
const SUPABASE_CONFIG = Object.freeze({
  AUTH: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

// File Processing Configuration
const FILE_CONFIG = Object.freeze({
  MIME_TYPE: 'application/pdf',
  DEFAULT_DESCRIPTION: 'Auto-processed KIF invoice'
});

module.exports = {
  USER_STATUS,
  KIF_PROCESSING,
  EXIT_CODES,
  CLI_OPTIONS,
  DISPLAY_ICONS,
  SUPABASE_CONFIG,
  FILE_CONFIG
};
