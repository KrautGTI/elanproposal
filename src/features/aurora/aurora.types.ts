export enum AuroraSaveDesignStatus {
  IDLE,
  RUNNING_IRRADIANCE,
  RUNNING_PERFORMANCE,
  SYNCING_ENERFLO,
  FINISHED,
}

export type AuroraViewOptionKey =
  | "azimuthArrows"
  | "buildings"
  | "connections"
  | "designComponents"
  | "edges"
  | "electricalComponents"
  | "ground"
  | "irradianceMap"
  | "irradianceMapPanels"
  | "lidar"
  | "mapImagery"
  | "measurements"
  | "projectCenter"
  | "rulers"
  | "setbacks"
  | "shadows"
  | "sky"
  | "solarPanels"
  | "strings"
  | "sunpath"
  | "trees";

export interface AuroraViewOptions {
  azimuthArrows: boolean;
  buildings: boolean;
  connections: boolean;
  designComponents: boolean;
  edges: boolean;
  electricalComponents: boolean;
  ground: boolean;
  irradianceMap: boolean;
  irradianceMapPanels: boolean;
  lidar: boolean;
  mapImagery: boolean;
  measurements: boolean;
  projectCenter: boolean;
  rulers: boolean;
  setbacks: boolean;
  shadows: boolean;
  sky: boolean;
  solarPanels: boolean;
  strings: boolean;
  sunpath: boolean;
  trees: boolean;
}

export interface AuroraDesign {
  use_with_proposal: boolean;
  aurora_link: string;
  id: string;
  name: string;
  panel_count: number;
  size: number;
  is_ready: boolean;
  production: number;
}
