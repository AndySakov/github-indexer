import {
  getMyCommits,
  getMyOrgAssociation,
  getOrgCommits,
} from "./api/helpers";

getMyCommits().then((res) => {
  console.log("|GET USER COMMITS DEMO|");
  console.log("Total: " + res.length);
  console.log(
    "Avg Number of Commits: " +
      res.reduce((avg, value, _, { length }) => {
        return avg + value.commits.length / length;
      }, 0)
  );
});

getOrgCommits("zio").then((res) => {
  console.log("|GET ORG COMMITS DEMO|");
  console.log("Total: " + res.length);
  console.log(
    "Avg Number of Commits: " +
      res.reduce((avg, value, _, { length }) => {
        return avg + value.commits.length / length;
      }, 0)
  );
});

getMyOrgAssociation("RecruitersRip").then((res) => console.log(res));
