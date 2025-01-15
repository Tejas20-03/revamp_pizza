const DISABLE_ALL_INFO_LOGS = false;
const DISABLE_ALL_WARNING_LOGS = false;
const DISABLE_ALL_ERROR_LOGS = false;

export const LogInfo = (title?: string, message?: string) => !DISABLE_ALL_INFO_LOGS && console.log(`[INFO] ${title} - ${message}`);
export const LogWarning = (title?: string, message?: string, warning?: any) => !DISABLE_ALL_WARNING_LOGS && console.warn(`[WARNING] ${title} - ${message} - ${warning}`);
export const LogError = (title?: string, message?: string, error?: any) => {
  if (DISABLE_ALL_ERROR_LOGS) return;
  console.error(`[ERROR] ${title} - ${message} - ${error}`);
};
