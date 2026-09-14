export type CertificateBook = {
  id: string;
  title: string;
  coverTitle: string;
  roman: string;
  discipline: string;
  note: string;
  deck: string;
  binding: string;
  format: string;
  theme: string;
  motif: string;
  motifKey: string;
  paletteLabel: string;
  color: string;
  foil: string;
  palette: {
    paper: string;
    paperDeep: string;
    paperPale: string;
    ink: string;
    inkSoft: string;
    wall: string;
    shelf: string;
    shelfDark: string;
    light: string;
    fill: string;
  };
  width: number;
  height: number;
  depth: number;
  chapters: [string, string, string];
  seed: number;
  issuer: 'Fortinet' | 'Microsoft';
  issued: string;
  validity: string;
  credentialId?: string;
  status: 'active' | 'expired';
  statusLabel: string;
};

export const CERTIFICATE_BOOKS: CertificateBook[] = [
  {
    id: 'threat-landscape',
    title: 'Introduction to the Threat Landscape 3.0',
    coverTitle: 'Threat Landscape 3.0',
    roman: 'I',
    discipline: 'Fortinet · threat intelligence',
    note: 'A clear-eyed primer on the forces shaping modern security.',
    deck: 'Fortinet training in the threat landscape: understand the actors, patterns, and defensive decisions that keep systems resilient.',
    binding: 'Signal-red cloth · warm-white foil',
    format: 'Fortinet credential · issued Apr 2026',
    theme: 'Threat Landscape 3.0 · signals into decisions',
    motif: 'Threat signal matrix',
    motifKey: 'modules',
    paletteLabel: 'Fortinet red · bone · ember',
    color: '#d9281c',
    foil: '#fff2e6',
    palette: {
      paper: '#8b2119', paperDeep: '#4a1110', paperPale: '#fff1e3', ink: '#fff8f1',
      inkSoft: '#efb5a6', wall: '#2c1718', shelf: '#39130f', shelfDark: '#180807',
      light: '#ffd3bd', fill: '#d86a54'
    },
    width: 1.04, height: 1.6, depth: 0.27,
    chapters: ['Threat signals', 'Attack surface', 'Defensive posture'],
    seed: 101, issuer: 'Fortinet', issued: 'Apr 2026', validity: 'Issued Apr 2026', status: 'active', statusLabel: 'Active'
  },
  {
    id: 'networking-fundamentals',
    title: 'MTA: Networking Fundamentals - Certified 2019',
    coverTitle: 'MTA Networking',
    roman: 'II',
    discipline: 'Microsoft · networking',
    note: 'The dependable language of packets, protocols, and connected systems.',
    deck: 'Microsoft networking fundamentals: a foundation in the concepts that let infrastructure communicate, scale, and recover gracefully.',
    binding: 'Cobalt cloth · silver foil',
    format: 'Microsoft MTA · certified 2019 · issued Jul 2019',
    theme: 'Networking Fundamentals · the connected foundation',
    motif: 'Network topology',
    motifKey: 'orbits',
    paletteLabel: 'Cobalt · sky · silver',
    color: '#2868a8',
    foil: '#e6f3ff',
    palette: {
      paper: '#1e4f86', paperDeep: '#102d55', paperPale: '#e5f2fb', ink: '#f5fbff',
      inkSoft: '#b9d4e9', wall: '#142b47', shelf: '#1c2e43', shelfDark: '#0b1420',
      light: '#d4efff', fill: '#5a9cc9'
    },
    width: 0.98, height: 1.52, depth: 0.24,
    chapters: ['Packets', 'Protocols', 'Connectivity'],
    seed: 202, issuer: 'Microsoft', issued: 'Jul 2019', validity: 'Issued Jul 2019', status: 'active', statusLabel: 'Active'
  },
  {
    id: 'identity-access',
    title: 'Microsoft Certified: Identity and Access Administrator Associate',
    coverTitle: 'Identity & Access',
    roman: 'III',
    discipline: 'Microsoft · identity and access',
    note: 'Trust made tangible through policy, proof, and least privilege.',
    deck: 'Microsoft identity and access administration: shape secure access with disciplined identity lifecycle, authentication, and governance.',
    binding: 'Indigo cloth · copper foil',
    format: 'Microsoft Certified · issued Feb 2026 · expires Feb 2027',
    theme: 'Identity & Access · trust by design',
    motif: 'Identity rings',
    motifKey: 'brackets',
    paletteLabel: 'Indigo · paper · copper',
    color: '#384f9f',
    foil: '#f3d0a4',
    palette: {
      paper: '#28396e', paperDeep: '#141d43', paperPale: '#f5f0e7', ink: '#fffaf0',
      inkSoft: '#c7c9e4', wall: '#1a2143', shelf: '#211c31', shelfDark: '#0d0b16',
      light: '#ded7ff', fill: '#7e87cb'
    },
    width: 1.03, height: 1.58, depth: 0.25,
    chapters: ['Identity', 'Authentication', 'Governance'],
    seed: 303, issuer: 'Microsoft', issued: 'Feb 2026', validity: 'Issued Feb 2026 · Expires Feb 2027', credentialId: 'FFAF919937B3B865', status: 'active', statusLabel: 'Active · expires Feb 2027'
  },
  {
    id: 'azure-security',
    title: 'Microsoft Certified: Azure Security Engineer Associate',
    coverTitle: 'Azure Security',
    roman: 'IV',
    discipline: 'Microsoft · cloud security',
    note: 'Security principles carried through every layer of the cloud.',
    deck: 'Microsoft Azure security engineering: protect workloads, data, and identities with a measured cloud-first security practice.',
    binding: 'Azure-blue cloth · ice foil',
    format: 'Microsoft Certified · issued Nov 2025 · expires Nov 2026',
    theme: 'Azure Security · protection at cloud scale',
    motif: 'Cloud perimeter',
    motifKey: 'paths',
    paletteLabel: 'Azure blue · cloud · ice',
    color: '#0078d4',
    foil: '#d9f0ff',
    palette: {
      paper: '#07558f', paperDeep: '#073051', paperPale: '#e8f6ff', ink: '#f7fcff',
      inkSoft: '#b5d8ef', wall: '#102f4b', shelf: '#142b3a', shelfDark: '#07141c',
      light: '#c8edff', fill: '#55a6d9'
    },
    width: 1.08, height: 1.68, depth: 0.26,
    chapters: ['Cloud posture', 'Workloads', 'Response'],
    seed: 404, issuer: 'Microsoft', issued: 'Nov 2025', validity: 'Issued Nov 2025 · Expires Nov 2026', credentialId: '9FABF2B47ECAE10E', status: 'active', statusLabel: 'Active · expires Nov 2026'
  },
  {
    id: 'endpoint-administrator',
    title: 'Microsoft 365 Certified: Endpoint Administrator Associate',
    coverTitle: 'Endpoint Admin',
    roman: 'V',
    discipline: 'Microsoft · endpoint management',
    note: 'A calm operating layer for the devices people rely on every day.',
    deck: 'Microsoft 365 endpoint administration: secure, configure, and support modern endpoints while keeping the human workflow in view.',
    binding: 'Teal cloth · pale-gold foil',
    format: 'Microsoft Certified · issued Jan 2025 · expired Jan 2026',
    theme: 'Endpoint Administration · the human edge',
    motif: 'Device constellation',
    motifKey: 'caret',
    paletteLabel: 'Teal · parchment · gold',
    color: '#167c80',
    foil: '#f6df9a',
    palette: {
      paper: '#16676b', paperDeep: '#0e373d', paperPale: '#f5f0e3', ink: '#fff9eb',
      inkSoft: '#b8dad3', wall: '#173b3f', shelf: '#173036', shelfDark: '#091719',
      light: '#d4f1df', fill: '#62b8ad'
    },
    width: 1.02, height: 1.56, depth: 0.25,
    chapters: ['Devices', 'Configuration', 'Experience'],
    seed: 505, issuer: 'Microsoft', issued: 'Jan 2025', validity: 'Issued Jan 2025 · Expired Jan 2026', credentialId: 'A7E59AAED453E60B', status: 'expired', statusLabel: 'Expired Jan 2026'
  }
];
