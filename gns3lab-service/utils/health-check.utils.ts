import https from "https";

export async function checkContainerHealth(
  host: string = "localhost",
  port: number = 3080,
  timeoutMs = 5000,
  retries = 5,
  intervalMs = 10_000,
): Promise<boolean> {
  const url = `https://${host}:${port}`;

  // Initial delay
  await new Promise((r) => setTimeout(r, intervalMs));

  for (let i = 0; i < retries; i++) {
    try {
      const ok = await probeHttps(url, timeoutMs);
      if (ok) {
        console.log(`✅ Health check passed on attempt ${i + 1}`);
        return true;
      }
    } catch (err) {
      console.warn(
        `⚠️ Health check failed (attempt ${i + 1}):`,
        (err as Error).message,
      );
    }

    if (i < retries - 1) {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }

  console.error("❌ Failed health checks after all retries");
  return false;
}

function probeHttps(url: string, timeout: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        rejectUnauthorized: false, // because SSL=true → likely self-signed cert
      },
      (res) => {
        resolve(res.statusCode !== undefined && res.statusCode < 500);
      },
    );

    req.on("error", () => resolve(false));
    req.setTimeout(timeout, () => {
      req.destroy();
      resolve(false);
    });
  });
}
