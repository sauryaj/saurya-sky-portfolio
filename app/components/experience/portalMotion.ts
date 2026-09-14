import type { PortalId } from '@stores';

type CameraTarget = {
  desktop: [number, number, number];
  mobile: [number, number, number];
};

type PortalMotion = {
  enter: number;
  exit: number;
  camera: CameraTarget;
};

export const PORTAL_MOTION: Record<PortalId, PortalMotion> = {
  work: {
    enter: 0.9,
    exit: 1,
    camera: {
      desktop: [-0.5, -39, 13],
      mobile: [0.5, -39, 13],
    },
  },
  projects: {
    enter: 0.9,
    exit: 1,
    camera: {
      desktop: [0, -39, 11.5],
      mobile: [0, -39, 11.5],
    },
  },
  certificates: {
    enter: 1.05,
    exit: 1.05,
    camera: {
      desktop: [2.8, -37, 11.5],
      mobile: [0, -37, 13],
    },
  },
};

export function getPortalDuration(portalId: PortalId, direction: 'enter' | 'exit') {
  return PORTAL_MOTION[portalId][direction];
}
