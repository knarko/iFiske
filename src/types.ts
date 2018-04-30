export interface Dictionary<T> {
  [key: string]: T;
}

// Needed for this file to be exported in some situations
export const keepThisFileAroundInWebpack = 1;
