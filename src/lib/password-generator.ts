export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export type PasswordOptions = {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
};

const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const ambiguousChars = new Set(["0", "O", "l", "1", "I"]);

function filterAmbiguousCharacters(value: string, excludeAmbiguous: boolean) {
  if (!excludeAmbiguous) {
    return value;
  }

  return value
    .split("")
    .filter((character) => !ambiguousChars.has(character))
    .join("");
}

export function getRandomInt(max: number) {
  if (!Number.isInteger(max) || max < 1 || max > 0x100000000) throw new RangeError("Invalid random range.");
  const buffer = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  do { crypto.getRandomValues(buffer); } while (buffer[0] >= limit);
  return buffer[0] % max;
}

export function getCharacterPools(options: PasswordOptions) {
  const pools = [
    options.includeUppercase
      ? filterAmbiguousCharacters(uppercaseChars, options.excludeAmbiguous)
      : "",
    options.includeLowercase
      ? filterAmbiguousCharacters(lowercaseChars, options.excludeAmbiguous)
      : "",
    options.includeNumbers ? filterAmbiguousCharacters(numberChars, options.excludeAmbiguous) : "",
    options.includeSymbols ? filterAmbiguousCharacters(symbolChars, options.excludeAmbiguous) : "",
  ].filter(Boolean);

  return pools;
}

export function getSelectedTypeCount(options: PasswordOptions) {
  return [
    options.includeUppercase,
    options.includeLowercase,
    options.includeNumbers,
    options.includeSymbols,
  ].filter(Boolean).length;
}

export function generatePassword(options: PasswordOptions) {
  const pools = getCharacterPools(options);

  if (!pools.length) {
    return "";
  }

  const normalizedLength = Math.max(options.length, pools.length);
  const combinedPool = pools.join("");
  const passwordCharacters: string[] = [];

  for (const pool of pools) {
    passwordCharacters.push(pool[getRandomInt(pool.length)]);
  }

  while (passwordCharacters.length < normalizedLength) {
    passwordCharacters.push(combinedPool[getRandomInt(combinedPool.length)]);
  }

  for (let index = passwordCharacters.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomInt(index + 1);
    [passwordCharacters[index], passwordCharacters[swapIndex]] = [
      passwordCharacters[swapIndex],
      passwordCharacters[index],
    ];
  }

  return passwordCharacters.join("");
}

export function generateMultiplePasswords(options: PasswordOptions, amount: number) {
  return Array.from({ length: amount }, () => generatePassword(options));
}

export function getPasswordStrength(
  password: string,
  options: PasswordOptions,
): {
  label: string;
  strength: PasswordStrength;
  progress: number;
} {
  const typeCount = getSelectedTypeCount(options);
  const length = password.length;

  if (length < 8 || typeCount <= 1) {
    return {
      label: "Weak",
      strength: "weak",
      progress: 25,
    };
  }

  if (length >= 16 && typeCount === 4) {
    return {
      label: "Strong",
      strength: "strong",
      progress: 100,
    };
  }

  if (length >= 12 && length <= 15 && typeCount >= 3) {
    return {
      label: "Good",
      strength: "good",
      progress: 75,
    };
  }

  return {
    label: "Fair",
    strength: "fair",
    progress: 50,
  };
}
