import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(1.5, 0, 0),
    year: '2019',
    title: 'BCA',
    subtitle: 'Computer Engineer',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-3, -1.5, -3.5),
    year: '2021',
    title: 'DTSL',
    subtitle: 'Computer Engineer',
    position: 'left',
  },
  {
    point: new THREE.Vector3(2.5, -1, -7.5),
    year: '2022',
    title: 'CodeBlue New Zealand',
    subtitle: 'Systems Engineer | Trusted Advisor',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-2.5, -0.5, -11.5),
    year: '2025',
    title: 'Focus Technology Group',
    subtitle: 'Systems Engineer | Trusted Advisor',
    position: 'left',
  },
];
