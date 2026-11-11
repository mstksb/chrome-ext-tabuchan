export async function canUsePageInput(browser, tab) {
  try {
    const url = new URL(tab.url ?? "");
    if (!["http:", "https:"].includes(url.protocol)
      || url.hostname === "chromewebstore.google.com"
      || (url.hostname === "chrome.google.com" && /^\/webstore(?:\/|$)/.test(url.pathname))) {
      return false;
    }
    return Boolean(await browser.permissions.contains({ origins: [`${url.protocol}//${url.hostname}/*`] }));
  } catch {
    return false;
  }
}
