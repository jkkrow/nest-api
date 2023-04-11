export interface MediaConvertJobResult {
  version: string;
  id: string;
  'detail-type': string;
  source: string;
  account: string;
  time: string;
  region: string;
  resources: string[];
  detail: Detail;
}

export interface Detail {
  timestamp: number;
  accountId: string;
  queue: string;
  jobId: string;
  status: string;
  userMetadata: UserMetadata;
  outputGroupDetails: OutputGroupDetail[];
  paddingInserted: number;
  blackVideoDetected: number;
}

export interface UserMetadata {
  applicationId: string;
  key: string;
  thumbnail: string;
  name: string;
}

export interface OutputGroupDetail {
  outputDetails?: OutputDetail[];
  playlistFilePaths?: string[];
  type: string;
}

export interface OutputDetail {
  durationInMs: number;
  videoDetails?: VideoDetails;
  outputFilePaths?: string[];
}

export interface VideoDetails {
  widthInPx?: number;
  heightInPx?: number;
  averageBitrate?: number;
  qvbrAvgQuality?: number;
  qvbrMinQuality?: number;
  qvbrMaxQuality?: number;
  qvbrMinQualityLocation?: number;
  qvbrMaxQualityLocation?: number;
}
