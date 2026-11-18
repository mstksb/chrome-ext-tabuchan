export async function canUsePageInput(browser, tab, permissionChecks = null) {
  try {
    const url = new URL(tab.url ?? "");
    const hostname = url.hostname.replace(/\.$/, "");
    if (!["http:", "https:"].includes(url.protocol)
      || ["chrome.google.com", "chromewebstore.google.com"].some((domain) => (
        hostname === domain || hostname.endsWith(`.${domain}`)
      ))) {
      return false;
    }
    const origin = `${url.protocol}//${url.hostname}/*`;
    // Keep results only for one candidate list or one move; permissions may change.
    if (!permissionChecks) return Boolean(await browser.permissions.contains({ origins: [origin] }));
    if (!permissionChecks.has(origin)) {
      permissionChecks.set(origin, browser.permissions.contains({ origins: [origin] }));
    }
    return Boolean(await permissionChecks.get(origin));
  } catch {
    return false;
  }
}

export function createPageInputAccessCheck(browser) {
  const permissionChecks = new Map();
  return (tab) => canUsePageInput(browser, tab, permissionChecks);
}
