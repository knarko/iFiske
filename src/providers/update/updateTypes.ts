export type UpdateFn = () => boolean;
export type UpdateStrategy = 'timed' | 'always' | UpdateFn;
