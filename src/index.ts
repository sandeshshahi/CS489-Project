import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { AppDataSource } from "./config/database";
import { typeDefs, resolvers } from "./graphql/schema";
import apiRoutes from "./routes/api";
async function bootstrap() {
  try {
    //Initialize Database
    await AppDataSource.initialize();
    console.log("Database connected!");

    //Initialize Express & Apollo Server
    const app = express();

    // Ensure Express can parse JSON request bodies!
    app.use(cors());
    app.use(express.json());

    // ---------------------------------------------
    // REST API MOUNT POINT (Requirement)
    // ---------------------------------------------
    app.use("/adsweb/api/v1", apiRoutes);
    console.log("REST API ready at http://localhost:8080/adsweb/api/v1");

    // ---------------------------------------------
    // GRAPHQL API MOUNT POINT
    // ---------------------------------------------
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();

    //  Mount GraphQL endpoint at /graphql
    app.use("/graphql", cors(), express.json(), expressMiddleware(server));

    // Start listening on port 8080
    app.listen(8080, () => {
      console.log(`🚀 Server ready at http://localhost:8080/graphql`);
    });
  } catch (error) {
    console.error("Error starting application:", error);
  }
}

bootstrap();
