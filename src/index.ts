import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { AppDataSource } from "./config/database";
import { typeDefs, resolvers } from "./graphql/schema";

async function bootstrap() {
  try {
    // 1. Initialize Database
    await AppDataSource.initialize();
    console.log("Database connected!");

    // 2. Initialize Express & Apollo Server
    const app = express();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();

    // 3. Mount GraphQL endpoint at /graphql
    app.use("/graphql", cors(), express.json(), expressMiddleware(server));

    // 4. Start listening on port 8080
    app.listen(8080, () => {
      console.log(`🚀 Server ready at http://localhost:8080/graphql`);
    });
  } catch (error) {
    console.error("Error starting application:", error);
  }
}

bootstrap();
