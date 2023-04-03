import { getMyRepos } from "./api/helpers";

getMyRepos(1).then((res) => console.log(res));
