export enum LoadingState {
  IDLE = 'IDLE',
  READING_FILE = 'READING_FILE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface SummaryResult {
  summary: string;
  timestamp: string;
}

export interface FileData {
  name: string;
  type: string;
  size: number;
  base64: string;
}
