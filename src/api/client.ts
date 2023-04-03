import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export const client = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_PAT}`,
    Accept: "application/vnd.github+json",
  },
});
