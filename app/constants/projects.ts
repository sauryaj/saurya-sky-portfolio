import { Project } from "../types";

export const PROJECTS: Project[] = [
  {
    title: 'FortiClient EMS & FortiGate ZTNA Architecture',
    date: 'Enterprise Security',
    subtext: 'Architected a zero-trust access model connecting hybrid endpoints through FortiClient EMS and FortiGate.',
  },
  {
    title: 'Microsoft Purview & Data Governance Framework',
    date: 'Security & Governance',
    subtext: 'Implemented data classification, information protection, and DLP controls for enterprise Microsoft 365 environments.',
  },
  {
    title: 'Enterprise Intune Autopilot & CIS Baseline',
    date: 'Endpoint Management',
    subtext: 'Delivered zero-touch Windows Autopilot provisioning with Microsoft Intune enrollment and CIS-aligned configuration baselines.',
    featured: true,
  },
  {
    title: 'Email Protection & DLP Policies',
    date: 'Microsoft 365 Security',
    subtext: 'Strengthened Exchange Online protection with Defender for Office 365 and practical data loss prevention controls.',
  },
  {
    title: 'Zero-Trust Conditional Access',
    date: 'Identity & Access',
    subtext: 'Designed Microsoft Entra ID conditional access controls with MFA, device compliance, and risk-based sign-in policies.',
  },
  {
    title: 'CrowdStrike & SentinelOne Deployment',
    date: 'Endpoint Security',
    subtext: 'Orchestrated endpoint detection and response rollouts across large enterprise fleets.',
  },
  {
    title: 'Infrastructure as Code Pipeline',
    date: 'Cloud & IaC',
    subtext: 'Automated repeatable infrastructure provisioning with Terraform and Azure DevOps pipelines.',
  },
  {
    title: 'SIEM Threat Detection',
    date: 'Cybersecurity Operations',
    subtext: 'Deployed Microsoft Sentinel monitoring for centralized log analytics, threat detection, and investigation.',
  },
  {
    title: 'Enterprise Cloud Migration',
    date: 'Cloud Modernization',
    subtext: 'Supported migrations from on-premises infrastructure to Azure with a resilient, security-led operating model.',
  }
];
