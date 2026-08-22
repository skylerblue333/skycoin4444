import fs from "node:fs";
import { execFileSync } from "node:child_process";

const owner = process.env.GITHUB_OWNER ?? "skylerblue333";
const raw = execFileSync("gh", [
  "repo", "list", owner, "--limit", "250",
  "--json", "name,nameWithOwner,isPrivate,isArchived,isFork,defaultBranchRef,pushedAt,updatedAt,description,url",
], { encoding: "utf8" });
const repos = JSON.parse(raw.replace(/\u001b\[[0-9;]*[A-Za-z]/g, ""));
const signalWords = ["enterprise-grade", "production-ready", "production-grade", "core component", "implementation", "architecture", "templates", "examples"];
const signalRepos = repos.filter((repo) => signalWords.some((word) => (repo.description ?? "").toLowerCase().includes(word)));
const report = {
  generatedAt: new Date().toISOString(),
  owner,
  total: repos.length,
  active: repos.filter((repo) => !repo.isArchived).length,
  archived: repos.filter((repo) => repo.isArchived).length,
  public: repos.filter((repo) => !repo.isPrivate).length,
  private: repos.filter((repo) => repo.isPrivate).length,
  forks: repos.filter((repo) => repo.isFork).length,
  pushedSinceAugust1: repos.filter((repo) => repo.pushedAt && Date.parse(repo.pushedAt) >= Date.parse("2026-08-01T00:00:00Z")).length,
  descriptionSignalCount: signalRepos.length,
  repositories: repos.map(({ name, nameWithOwner, url, description, pushedAt, isPrivate, isArchived, isFork }) => ({
    name, nameWithOwner, url, description: description ?? "", pushedAt, isPrivate, isArchived, isFork,
    verificationStatus: "unverified",
  })),
};
fs.writeFileSync("docs/repository-inventory.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({
  generatedAt: report.generatedAt,
  owner: report.owner,
  total: report.total,
  public: report.public,
  private: report.private,
  archived: report.archived,
  forks: report.forks,
  pushedSinceAugust1: report.pushedSinceAugust1,
  descriptionSignalCount: report.descriptionSignalCount,
  warning: "Repository descriptions and activity are not proof of working functionality; verificationStatus remains unverified until build/test/evidence checks pass.",
}, null, 2));
