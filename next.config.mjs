import crypto from "crypto";

const password = process.env.JOURNAL_PASSWORD || "admin";
const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_JOURNAL_PASSWORD_HASH: passwordHash,
  }
};

export default nextConfig;
