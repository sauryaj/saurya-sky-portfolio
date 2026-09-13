import { Certification } from "../types";

// Replace these clearly marked slots with your verified credentials.
// Keeping the content in one file makes the archive easy to maintain.
export const CERTIFICATIONS: Certification[] = [
  {
    id: "credential-01",
    title: "ADD CLOUD CERTIFICATION",
    issuer: "Issuer name",
    category: "CLOUD",
    issued: "YYYY",
    description: "Replace this slot with a verified cloud or infrastructure credential.",
    skills: ["Cloud architecture", "Infrastructure", "Resilience"],
    status: "replace",
    accent: "#8bbce3",
  },
  {
    id: "credential-02",
    title: "ADD SECURITY CERTIFICATION",
    issuer: "Issuer name",
    category: "SECURITY",
    issued: "YYYY",
    description: "Replace this slot with a verified security credential.",
    skills: ["Threat detection", "Security operations", "Risk"],
    status: "replace",
    accent: "#e0a46a",
  },
  {
    id: "credential-03",
    title: "ADD IDENTITY CERTIFICATION",
    issuer: "Issuer name",
    category: "IDENTITY",
    issued: "YYYY",
    description: "Replace this slot with a verified identity or access credential.",
    skills: ["Identity", "Zero trust", "Access management"],
    status: "replace",
    accent: "#b7a2e4",
  },
  {
    id: "credential-04",
    title: "ADD ENDPOINT CERTIFICATION",
    issuer: "Issuer name",
    category: "ENDPOINT",
    issued: "YYYY",
    description: "Replace this slot with a verified endpoint or device-management credential.",
    skills: ["Endpoint management", "Device compliance", "Automation"],
    status: "replace",
    accent: "#8fc7a4",
  },
];
