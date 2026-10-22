import { connectDB } from "../src/lib/db";
import { cleanupMedia, orphanMediaCandidates } from "../src/server/media";
import mongoose from "mongoose";
async function main() {
  try {
    await connectDB();
    const names = await orphanMediaCandidates();
    const apply = process.argv.includes("--apply");
    for (const name of names) {
      console.log(`${apply ? "REMOVE" : "DRY RUN"} ${name}`);
      if (apply) await cleanupMedia([`/media/${name}`]);
    }
    console.log(
      `${names.length} candidate(s); ${apply ? "cleanup requested" : "dry run only"}`,
    );
  } finally {
    await mongoose.disconnect();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
