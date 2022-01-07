const userAgent =
  navigator.userAgent.toLocaleUpperCase();

const isChrome =
  userAgent.includes("CHROME");

const isMobile =
  navigator.userAgent.match(
    /(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i
  );

export function removeCssRestrictors() {
  if (isChrome) {
    removeCssRule(".if-print-to-pdf");
  }

  if (!isMobile) {
    removeCssRule(".if-desktop");
  }
}

function removeCssRule(name: string) {
  const sheets = document.styleSheets;
  for (
    let sheetIndex = 0;
    sheetIndex < sheets.length;
    sheetIndex++
  ) {
    const sheet = sheets[sheetIndex];
    try {
      if (!sheet?.cssRules) continue;
    } catch (ex) {
      continue;
    }
    for (
      let ruleIndex = 0;
      ruleIndex < sheet.cssRules.length;
      ruleIndex++
    ) {
      const rule = sheet.cssRules[
        ruleIndex
      ] as CSSStyleRule;
      if (rule.selectorText === name) {
        sheet.deleteRule(ruleIndex);
        return;
      }
    }
  }
}
