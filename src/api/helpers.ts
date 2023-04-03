import { client } from "./client";
import { Repository } from "./types";

export const getOrgRepos = async (
  org: string,
  page: number
): Promise<Repository[]> => {
  return client
    .get(`/orgs/${org}/repos`, {
      headers: {
        page: page,
      },
    })
    .then((res) => res.data as Repository[]);
};

export const getMyRepos = async (page: number): Promise<Repository[]> => {
  return client
    .get("/user/repos", {
      headers: {
        type: "public",
        per_page: 100,
        page: page,
      },
    })
    .then((res) => res.data as Repository[]);
};
