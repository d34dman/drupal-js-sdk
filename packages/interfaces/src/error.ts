export interface DrupalErrorInterface extends Error {
  code: number;
  getErrorCode(): number;
}
