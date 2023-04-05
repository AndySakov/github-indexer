import { client } from "./client";
import { Commit, CommitMap, Repository, User } from "./types";

export const getMyAccount = async (): Promise<User> => {
  return (await client.rest.users.getAuthenticated()).data as User;
};

export const getOrgRepos = async (org: string): Promise<Repository[]> => {
  const data = await client.paginate<Repository>("GET /orgs/{org}/repos", {
    org: org,
    per_page: 100,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
      type: "public",
    },
  });
  return data;
};

export const getMyRepos = async (): Promise<Repository[]> => {
  return client.paginate<Repository>("GET /user/repos", {
    per_page: 100,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};

export const getMyCommits = async (): Promise<CommitMap[]> => {
  const repos = await getMyRepos();
  const me = await getMyAccount();
  console.log(`[DEBUG] Found ${repos.length} repos for user ${me.login}`);
  const commitMaps: CommitMap[] = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const commits = await client.paginate<Commit>(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: repo.owner.login,
        repo: repo.name,
        per_page: 100,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    console.log(
      `[DEBUG] Found ${commits.length} commits for repo ${repo.owner.login}/${repo.name}`
    );
    commitMaps.push({
      repo_id: repo.name,
      commits: commits,
    } as CommitMap);
  }
  return commitMaps;
};

export const getOrgCommits = async (org: string): Promise<CommitMap[]> => {
  const repos = await getOrgRepos(org);
  console.log(`[DEBUG] Found ${repos.length} repos for org ${org}`);
  const commitMaps: CommitMap[] = [];
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    const commits = await client.paginate<Commit>(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: repo.owner.login,
        repo: repo.name,
        per_page: 100,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    console.log(
      `[DEBUG] Found ${commits.length} commits for repo ${repo.owner.login}/${repo.name}`
    );
    commitMaps.push({
      repo_id: repo.name,
      commits: commits,
    } as CommitMap);
  }
  return commitMaps;
};

export const getMyOrgAssociation = async (org: string): Promise<string> => {
  const res = await client.rest.orgs
    .getMembershipForAuthenticatedUser({
      org: org,
    })
    .catch(() => ({
      data: {
        state: "N/A",
      },
    }));
  return res.data.state;
};
