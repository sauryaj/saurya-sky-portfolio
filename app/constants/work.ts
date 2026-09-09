import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2021',
    title: 'DTSL',
    subtitle: 'Computer Engineer',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: '2022',
    title: 'CodeBlue New Zealand',
    subtitle: 'Systems Engineer | Trusted Advisor',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: '2025',
    title: 'Focus Technology Group',
    subtitle: 'Integrated Systems & Cloud Security',
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: 'Today',
    title: 'Enterprise Systems',
    subtitle: 'Zero-Trust Architecture & Advisory',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 1, -12),
    year: new Date().toLocaleDateString('default', { year: 'numeric' }),
    title: 'Building resilient systems',
    subtitle: 'New Zealand',
    position: 'right',
  }
]
