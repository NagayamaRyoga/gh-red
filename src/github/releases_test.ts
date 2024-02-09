import {
  assertEquals,
  assertRejects,
  assertSpyCalls,
  stub,
} from "../deps/std/testing.ts";
import {
  fetchLatestReleaseTag,
  fetchReleasedArtifactURLs,
  GITHUB_BASE_URL,
} from "./releases.ts";

function spyFetch(
  expectedMethod: string,
  expectedURL: string,
  response: Response,
) {
  return stub(
    globalThis,
    "fetch",
    (input, init) => {
      assertEquals(input, expectedURL);
      assertEquals(init?.method ?? "GET", expectedMethod);
      return Promise.resolve(response);
    },
  );
}

Deno.test(async function testFetchLatestReleaseTag(t) {
  await t.step("should fetch latest release tag", async () => {
    const fetchStub = spyFetch(
      "GET",
      `${GITHUB_BASE_URL}/NagayamaRyoga/jargon/releases/latest`,
      Response.redirect(
        `${GITHUB_BASE_URL}/NagayamaRyoga/jargon/releases/tag/v0.1.2`,
      ),
    );

    try {
      const tag = await fetchLatestReleaseTag("NagayamaRyoga", "jargon");
      assertEquals(tag, "v0.1.2");

      assertSpyCalls(fetchStub, 1);
    } finally {
      fetchStub.restore();
    }
  });

  await t.step("throws if error", async () => {
    const fetchStub = spyFetch(
      "GET",
      `${GITHUB_BASE_URL}/NagayamaRyoga/jargon/releases/latest`,
      Response.error(),
    );

    try {
      await assertRejects(() =>
        fetchLatestReleaseTag("NagayamaRyoga", "jargon")
      );

      assertSpyCalls(fetchStub, 1);
    } finally {
      fetchStub.restore();
    }
  });
});

Deno.test(async function testFetchReleasedArtifactURLs(t) {
  await t.step("should fetch released artifact URLs", async () => {
    const html = await Deno.readFile(
      new URL(
        "./testdata/releases_expanded_assets_v0.1.2.html",
        import.meta.url,
      ),
    );

    const fetchStub = spyFetch(
      "GET",
      `${GITHUB_BASE_URL}/NagayamaRyoga/jargon/releases/expanded_assets/v0.1.2`,
      new Response(html),
    );

    try {
      const urls = await fetchReleasedArtifactURLs(
        "NagayamaRyoga",
        "jargon",
        "v0.1.2",
      );

      assertEquals(urls, [
        `${GITHUB_BASE_URL}/NagayamaRyoga/jargon/releases/download/v0.1.2/jargon_0.1.2_checksums.txt`,
        `${GITHUB_BASE_URL}/NagayamaRyoga/jargon/releases/download/v0.1.2/jargon_Darwin_amd64.tar.gz`,
        `${GITHUB_BASE_URL}/NagayamaRyoga/jargon/releases/download/v0.1.2/jargon_Darwin_arm64.tar.gz`,
        `${GITHUB_BASE_URL}/NagayamaRyoga/jargon/releases/download/v0.1.2/jargon_Linux_amd64.tar.gz`,
        `${GITHUB_BASE_URL}/NagayamaRyoga/jargon/releases/download/v0.1.2/jargon_Linux_arm64.tar.gz`,
        `${GITHUB_BASE_URL}/NagayamaRyoga/jargon/releases/download/v0.1.2/jargon_Linux_i386.tar.gz`,
      ]);
    } finally {
      fetchStub.restore();
    }
  });
});
