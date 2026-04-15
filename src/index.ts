import { AppDataSource } from "./config/database";
import { AppRunner } from "./cli/AppRunner";

async function bootstrap() {
  try {
    // 1. Initialize Database Connection
    await AppDataSource.initialize();
    console.log("Database Connection established successfully.");

    // 2. Start the CLI Application
    const app = new AppRunner();
    await app.run();
  } catch (error) {
    console.error("Error starting application:", error);
  } finally {
    // 3. Clean up and exit
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    console.log("\n--- Application Closed ---");
  }
}

bootstrap();
