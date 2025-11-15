import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: "postgresql://postgres.zzygygsgafycqxhyfvmr:MrCh3aTs234260r@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  },
});
