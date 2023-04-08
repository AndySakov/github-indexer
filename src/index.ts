// import {
//   getMyCommits,
//   getMyOrgAssociation,
//   getOrgCommits,
// } from "./api/helpers";

import { scrapeProfileDataForAuthenticatedUser } from "./api/crawler";
// import { getMyEvents } from "./api/helpers";
import fs from "fs";

// getMyCommits().then((res) => {
//   console.log("|GET USER COMMITS DEMO|");
//   console.log("Total: " + res.length);
//   console.log(
//     "Avg Number of Commits: " +
//       res.reduce((avg, value, _, { length }) => {
//         return avg + value.commits.length / length;
//       }, 0)
//   );
// });

// getOrgCommits("RecruitersRip").then((res) => {
//   console.log("|GET ORG COMMITS DEMO|");
//   console.log("Total: " + res.length);
//   console.log(
//     "Avg Number of Commits: " +
//       res.reduce((avg, value, _, { length }) => {
//         return avg + value.commits.length / length;
//       }, 0)
//   );
// });

// getMyOrgAssociation("RecruitersRip").then((res) => console.log(res));

scrapeProfileDataForAuthenticatedUser().then((contribs) => {
  const json = JSON.stringify(contribs);
  fs.writeFile("profile-data-dump.json", json, "utf8", () => {});
  console.log(
    "Crawled user github profile page and saved data to profile-data-dump.json"
  );
});

// getMyEvents().then((res) =>
//   console.log(res.filter((evt) => evt.repo.name.includes("github"))[0])
// );
