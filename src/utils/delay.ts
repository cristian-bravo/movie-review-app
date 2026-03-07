export async function delay(ms = 120) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

