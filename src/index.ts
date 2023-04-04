import { getMyCommits } from "./api/helpers";

getMyCommits().then((res) => {
  console.log("Total: " + res.length);
  console.log(
    "Avg Number of Commits: " +
      res.reduce((avg, value, _, { length }) => {
        return avg + value.commits.length / length;
      }, 0)
  );
});
