import { getMyAccount } from "./helpers";
import { ContribAction, ContribMap, Contribution } from "./types";
import { JSDOM } from "jsdom";
import { eachMonthOfInterval, endOfMonth, format } from "date-fns";

const parseText = (x: string | null | undefined): string | null | undefined => {
  return x
    ?.replace(/^\s*$(?:\r\n?|\n)/gm, "")
    .replace(/\s\s+/g, " ")
    .replaceAll("\n", "")
    .trim();
};

const generateAction = (string: string | null | undefined): ContribAction => {
  const summary = string?.toLocaleLowerCase();
  if (summary?.includes("created")) {
    if (summary.includes("commits") || summary.includes("commit")) {
      return "created-commits";
    } else if (
      summary.includes("repository") ||
      summary.includes("repositories")
    ) {
      return "created-repos";
    }
  } else if (summary?.includes("opened")) {
    if (summary.includes("issue") || summary.includes("issues")) {
      return "opened-issues";
    } else if (
      summary.includes("pull request") ||
      summary.includes("pull requests")
    ) {
      return "opened-prs";
    }
  } else if (summary?.includes("private")) {
    return "private";
  } else {
    return "unknown";
  }
  return "unknown";
};

const generateState = (
  summary: string | undefined | null
): string | undefined => {
  if (summary?.includes("merged")) {
    return "merged";
  } else if (summary?.includes("open")) {
    return "open";
  } else if (summary?.includes("closed")) {
    return "closed";
  }
  return undefined;
};

const extractRelevantQuantities = (
  summary: string | undefined | null
): number | undefined => {
  const split = summary?.split(" ");
  return (
    Number(split?.find((elem) => isNaN(Number(elem)) === false)) ?? undefined
  );
};

const scrapeContribDataForDateRange = async (
  login: string,
  urlDateParam: string
): Promise<ContribMap> => {
  const url = `https://github.com/${login}?tab=overview&${urlDateParam}`;
  const dom = (
    await JSDOM.fromURL(url, {
      referrer: "https://github.com",
      pretendToBeVisual: true,
      resources: "usable",
      runScripts: "outside-only",
    })
  ).window.document;

  const elem = dom.body.querySelector(
    "div.contribution-activity-listing > div.width-full"
  );
  const time = elem
    ?.querySelector("h3.h6 > span.color-bg-default, h4.color-fg-default")
    ?.textContent?.trim();
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
        "summary.btn-link.Link--muted.no-underline, div.d-flex > h4, span.f4"
      );
      const metadata = Array.from(
        contrib.querySelectorAll(
          "ul.list-style-none > li.ml-0 > div.col-8, ul.list-style-none > li > span.width-fit, ul.list-style-none > li.d-flex > span.col-8 > span.width-fit, div.Box, div.Box > div.text-center > div.mt-n3 > h4, details > div > details > summary"
        )
      );
      const summaryText = parseText(summary?.textContent);
      return {
        summary: summaryText,
        metadata: metadata.map((x) => {
          const content = parseText(x?.textContent);
          const info = content?.split("/");
          const action = generateAction(parseText(summary?.textContent));
          if (
            action === "opened-prs" ||
            action === "opened-issues" ||
            action === "created-repos" ||
            summaryText?.includes("comments")
          ) {
            const isFirst = summaryText?.includes("first");
            const urls = isFirst
              ? x.nextElementSibling?.getAttribute("href")
                ? [
                    {
                      text: parseText(x.nextElementSibling?.textContent),
                      dest:
                        "https://github.com" +
                        x.nextElementSibling?.getAttribute("href"),
                    },
                  ]
                : null
              : Array.from(
                  x.nextElementSibling?.querySelectorAll("a") ?? []
                ).map((child) =>
                  child.getAttribute("href")
                    ? {
                        text: parseText(child.textContent),
                        dest: "https://github.com" + child.getAttribute("href"),
                      }
                    : null
                );
            return {
              repo: isFirst
                ? summaryText?.split(" ").find((x) => x.split("/").length === 2)
                : content?.split(" ")[0],
              owner: isFirst
                ? summaryText
                    ?.split(" ")
                    .find((x) => x.split("/").length === 2)
                    ?.split("/")[0]
                : info?.[0],
              action: action,
              state: generateState(content),
              quantity: extractRelevantQuantities(content),
              urls: urls?.filter((x) => x !== null),
              raw: content,
            };
          } else {
            const urls = Array.from(x.children).map((child) =>
              child.getAttribute("href")
                ? {
                    text: parseText(child.textContent),
                    dest: "https://github.com" + child.getAttribute("href"),
                  }
                : null
            );
            return {
              repo: content?.split(" ")[0],
              owner: info?.[0],
              action: action,
              state: generateState(content),
              quantity: extractRelevantQuantities(content),
              urls: urls.filter((x) => x !== null),
              raw: content,
            };
          }
        }),
      } as Contribution;
    }),
  };
  return map;
};

const generateUrlParams = (startDate: Date): string[] => {
  const months = eachMonthOfInterval({
    start: startDate,
    end: new Date(),
  })?.map((monthStart) => {
    const from = format(monthStart, "yyyy-MM-dd");
    const to = format(endOfMonth(monthStart), "yyyy-MM-dd");
    return `from=${from}&to=${to}`;
  });
  return months;
};

export const scrapeProfileDataForAuthenticatedUser = async (): Promise<
  ContribMap[]
> => {
  const user = await getMyAccount();
  const login = user.login;
  const createdDate = new Date(user.created_at);
  const months = generateUrlParams(createdDate);

  const maps: ContribMap[] = [];

  for (let i = 0; i < months.length; i++) {
    const urlParams = months[i];
    const map = await scrapeContribDataForDateRange(login, urlParams);
    maps.push(map);
  }

  return maps;
};
