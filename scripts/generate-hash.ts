import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function main() {
  const cliPassword = process.argv[2];

  if (cliPassword?.trim()) {
    const hash = await bcrypt.hash(cliPassword, 12);
    console.log(hash);
    return;
  }

  const rl = createInterface({ input, output });

  try {
    const password = await rl.question("Enter password to hash: ");

    if (!password.trim()) {
      console.error("Password is required.");
      process.exitCode = 1;
      return;
    }

    const hash = await bcrypt.hash(password, 12);
    console.log(hash);
  } finally {
    rl.close();
  }
}

main().catch((error: unknown) => {
  console.error("Failed to generate hash.");

  if (error instanceof Error) {
    console.error(error.message);
  }

  process.exitCode = 1;
});
