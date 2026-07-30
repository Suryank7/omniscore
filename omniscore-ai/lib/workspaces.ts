// OmniScore AI — Multi-Tenant Workspaces & RBAC Store

export type WorkspaceRole = "owner" | "admin" | "recruiter" | "viewer";

export interface WorkspaceMember {
  id: string;
  email: string;
  name: string;
  role: WorkspaceRole;
  joinedAt: string;
}

export interface CandidatePoolItem {
  id: string;
  candidateName: string;
  email: string;
  targetRole: string;
  overallScore: number;
  grade: string;
  atsScore: number;
  skillMatchScore: number;
  proofOfWorkScore: number;
  impactScore: number;
  matchedSkillsCount: number;
  missingCriticalSkillsCount: number;
  analyzedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  tier: "pro" | "enterprise";
  members: WorkspaceMember[];
  candidatePool: CandidatePoolItem[];
}

// Memory Store
const sampleWorkspace: Workspace = {
  id: "ws-tech-corp",
  name: "Tech Corp Recruiting Team",
  ownerId: "usr-owner-1",
  createdAt: new Date().toISOString(),
  tier: "enterprise",
  members: [
    { id: "usr-1", email: "hiring.manager@techcorp.com", name: "Sarah Jenkins", role: "owner", joinedAt: "2026-01-10" },
    { id: "usr-2", email: "lead.recruiter@techcorp.com", name: "David Miller", role: "recruiter", joinedAt: "2026-02-14" },
  ],
  candidatePool: [
    {
      id: "cand-1",
      candidateName: "Alex Rivera",
      email: "alex.rivera@example.com",
      targetRole: "Senior Full-Stack Developer",
      overallScore: 88,
      grade: "A",
      atsScore: 92,
      skillMatchScore: 85,
      proofOfWorkScore: 90,
      impactScore: 84,
      matchedSkillsCount: 14,
      missingCriticalSkillsCount: 1,
      analyzedAt: "2026-07-28T10:00:00Z",
    },
    {
      id: "cand-2",
      candidateName: "Elena Rostova",
      email: "elena.r@example.com",
      targetRole: "Senior Full-Stack Developer",
      overallScore: 82,
      grade: "A",
      atsScore: 88,
      skillMatchScore: 79,
      proofOfWorkScore: 82,
      impactScore: 80,
      matchedSkillsCount: 12,
      missingCriticalSkillsCount: 2,
      analyzedAt: "2026-07-29T14:30:00Z",
    },
    {
      id: "cand-3",
      candidateName: "Marcus Chen",
      email: "m.chen@example.com",
      targetRole: "Senior Full-Stack Developer",
      overallScore: 74,
      grade: "B+",
      atsScore: 78,
      skillMatchScore: 71,
      proofOfWorkScore: 75,
      impactScore: 72,
      matchedSkillsCount: 10,
      missingCriticalSkillsCount: 4,
      analyzedAt: "2026-07-30T09:15:00Z",
    },
  ],
};

export function getWorkspace(): Workspace {
  return sampleWorkspace;
}

export function addCandidateToWorkspace(candidate: Omit<CandidatePoolItem, "id" | "analyzedAt">): CandidatePoolItem {
  const item: CandidatePoolItem = {
    id: `cand-${Date.now()}`,
    analyzedAt: new Date().toISOString(),
    ...candidate,
  };
  sampleWorkspace.candidatePool.unshift(item);
  return item;
}
