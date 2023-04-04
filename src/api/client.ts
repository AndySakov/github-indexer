import * as dotenv from "dotenv";
import { Octokit } from "octokit";
dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

export const client = octokit;
