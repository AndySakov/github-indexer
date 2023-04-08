import puppeteer from "puppeteer";
import { getMyAccount } from "./helpers";
import { ContribMap, Contribution } from "./types";
import { JSDOM } from "jsdom";
const parseText = (x: string | null | undefined): string | null | undefined => {
  return x
    ?.replace(/^\s*$(?:\r\n?|\n)/gm, "")
    .replace(/\s\s+/g, " ")
    .replaceAll("\n", "")
    .trim();
};

export const scrapeProfileDataForAuthenticatedUser = async (): Promise<
  ContribMap[]
> => {
  const user = await getMyAccount();
  const url = `https://github.com/${user.login}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto(url);

  const contribMaps: ContribMap[] = [];

  let hasReachedBeginning = false;
  let count = 1;
  while (!hasReachedBeginning) {
    const showMoreActivityClass = ".contribution-activity-show-more";
    await page.waitForSelector(showMoreActivityClass);
    await page
      .waitForSelector("text/Joined GitHub", {
        timeout: 1000,
      })
      .then((handle) => {
        hasReachedBeginning = true;
        handle?.dispose();
      })
      .catch(async () => {
        await page.click(showMoreActivityClass);
        console.log(
          `[DEBUG] Number of Show More Activity button clicks: ${count}`
        );
        count += 1;
      });
  }

  const html = await page.content();
  const dom = new JSDOM(html).window.document;

  const activities = dom.querySelectorAll(
    ".contribution-activity-listing > div.width-full"
  );

  const activityList = Array.from(activities);

  console.log(`Found ${activityList.length} months worth of contribution data`);
  activityList.forEach((elem) => {
    const time = elem.querySelector(
      "h3.h6 > span.color-bg-default, h4.color-fg-default"
    )?.textContent;
    const monthYear = time?.split(" ");
    const month = monthYear?.[0];
    const year = Number(monthYear?.[1] ?? 0);
    const contribs = Array.from(
      elem?.querySelectorAll(".TimelineItem-body") ?? []
    );
    const map = {
      year: year,
      month: month,
      contributions: contribs.map((contrib) => {
        const summary = contrib.querySelector(
          "summary.btn-link.Link--muted.no-underline, div.d-flex"
        );
        const metadata = Array.from(
          contrib.querySelectorAll(
            "ul.list-style-none > li.ml-0 > div.col-8, ul.list-style-none > li > span, div.Box"
          )
        );
        return {
          summary: parseText(summary?.textContent),
          metadata: metadata.map((x) => ({
            parsed: parseText(x?.textContent),
            raw: x.innerHTML,
          })),
        } as Contribution;
      }),
    };
    contribMaps.push(map);
  });

  await page.screenshot({
    path: `screenshots/duckdegen-gh-profile-page-${new Date().toISOString()}.png`,
    fullPage: true,
  });
  await browser.close();
  return contribMaps;
};
