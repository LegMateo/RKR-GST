function rabinKarpHash(str, s) {
  const d = 31; // Prime base, adjust as needed
  const q = 101; // Prime modulus, helps in reducing collisions
  const n = str.length;
  let h = 1;
  let tHash = 0;
  let hashValues = [];

  // Precompute h = d^(s-1) % q
  for (let i = 0; i < s - 1; i++) {
    h = (h * d) % q;
  }

  // Compute the hash value for the first window
  for (let i = 0; i < s; i++) {
    tHash = (d * tHash + (str.charCodeAt(i) - "A".charCodeAt(0) + 1)) % q;
  }

  hashValues.push(tHash);

  // Compute hash values for the subsequent windows
  for (let i = 1; i <= n - s; i++) {
    tHash =
      (d * (tHash - (str.charCodeAt(i - 1) - "A".charCodeAt(0) + 1) * h) +
        (str.charCodeAt(i + s - 1) - "A".charCodeAt(0) + 1)) %
      q;

    // Handle negative hash values
    if (tHash < 0) {
      tHash = tHash + q;
    }

    hashValues.push(tHash);
  }

  return hashValues.join();
}

function occluded(match, pattern_mark, text_mark) {
  let occludedTokens = 0;

  console.log(
    `Checking occlusion for match: p=${match.p}, t=${match.t}, s=${match.s}`
  );

  for (let i = 0; i < match.s; i++) {
    const isPatternOccluded = pattern_mark[match.p + i];
    const isTextOccluded = text_mark[match.t + i];

    console.log(
      `Index ${i}: pattern_mark[${
        match.p + i
      }] = ${isPatternOccluded}, text_mark[${match.t + i}] = ${isTextOccluded}`
    );

    if (isPatternOccluded || isTextOccluded) {
      occludedTokens++;
      console.log(
        `Token at index ${i} is occluded. Total occluded so far: ${occludedTokens}`
      );
    }
  }

  const isOccluded = occludedTokens > 0;
  console.log(
    `Total occluded tokens: ${occludedTokens}. Is occluded: ${isOccluded}`
  );

  return {
    occludedTokens: occludedTokens,
    isOccluded: isOccluded,
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
