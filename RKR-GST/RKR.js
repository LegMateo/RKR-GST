function rabinKarpHash(str, s) {
  const d = 26;
  const n = str.length;
  let h = 1;
  let tHash = 0;
  let hashValues = [];

  for (let i = 0; i < s - 1; i++) {
    h = h * d;
  }

  for (let i = 0; i < s; i++) {
    tHash = d * tHash + (str.charCodeAt(i) - "A".charCodeAt(0) + 1);
  }

  hashValues.push(tHash);

  for (let i = 0; i <= n - s; i++) {
    if (i != 0) {
      tHash =
        d * (tHash - (str.charCodeAt(i - 1) - "A".charCodeAt(0) + 1) * h) +
        (str.charCodeAt(i + s - 1) - "A".charCodeAt(0) + 1);
      hashValues.push(tHash);
    }
  }

  return hashValues.join();
}

function occluded(match, pattern_mark, text_mark) {
  let occludedTokens = 0;

  for (let i = 0; i < match.s; i++) {
    const isPatternOccluded = pattern_mark[match.p + i];
    const isTextOccluded = text_mark[match.t + i];

    if (isPatternOccluded || isTextOccluded) {
      occludedTokens++;
    }
  }

  return {
    occludedTokens: occludedTokens,
    isOccluded: occludedTokens > 0,
  };
}

function mark_tokens(match, pattern_mark, text_mark) {
  for (let i = match.p; i < match.p + match.s; i++) {
    pattern_mark[i] = true;
  }

  for (let i = match.t; i < match.t + match.s; i++) {
    text_mark[i] = true;
  }
}

export { rabinKarpHash, occluded, mark_tokens };
