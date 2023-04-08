export interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  owner: Owner;
  private: boolean;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  clone_url: string;
  mirror_url: string;
  hooks_url: string;
  svn_url: string;
  homepage: string;
  language: string;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  open_issues_count: number;
  is_template: boolean;
  topics: string[];
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  has_discussions: boolean;
  archived: boolean;
  disabled: boolean;
  visibility: string;
  pushed_at: string;
  created_at: string;
  updated_at: string;
  permissions: Permissions;
  security_and_analysis: SecurityAndAnalysis;
}

export interface Owner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Permissions {
  admin: boolean;
  push: boolean;
  pull: boolean;
}

export interface SecurityAndAnalysis {
  advanced_security: AdvancedSecurity;
  secret_scanning: AdvancedSecurity;
  secret_scanning_push_protection: AdvancedSecurity;
}

export interface AdvancedSecurity {
  status: string;
}

export interface Commit {
  url: string;
  sha: string;
  node_id: string;
  html_url: string;
  comments_url: string;
  commit: CommitClass;
  author: CommitAuthor;
  committer: CommitAuthor;
  parents: Tree[];
}

export interface CommitAuthor {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface CommitClass {
  url: string;
  author: CommitAuthorClass;
  committer: CommitAuthorClass;
  message: string;
  tree: Tree;
  comment_count: number;
  verification: Verification;
}

export interface CommitAuthorClass {
  name: string;
  email: string;
  date: string;
}

export interface Tree {
  url: string;
  sha: string;
}

export interface Verification {
  verified: boolean;
  reason: string;
  signature: string;
  payload: string;
}

export interface CommitMap {
  repo_id: string;
  commits: Commit[];
}

export interface ContribMap {
  year: number;
  month: string | null | undefined;
  contributions: Contribution[];
}

export interface Contribution {
  summary: string;
  metadata: ContribMetadata[];
}

export interface ContribMetadata {
  parsed: string;
  raw: string;
}
export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  private_gists: number;
  total_private_repos: number;
  owned_private_repos: number;
  disk_usage: number;
  collaborators: number;
  two_factor_authentication: boolean;
  plan: Plan;
}

export interface Plan {
  name: string;
  space: number;
  private_repos: number;
  collaborators: number;
}

export type EventResponse = {
  id: string;
  type: string | null;
  actor: {
    id: number;
    login: string;
    display_login?: string | undefined;
    gravatar_id: string | null;
    url: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  org?:
    | {
        id: number;
        login: string;
        display_login?: string | undefined;
        gravatar_id: string | null;
        url: string;
        avatar_url: string;
      }
    | undefined;
  payload: any;
  public: boolean;
  created_at: string | null;
};
