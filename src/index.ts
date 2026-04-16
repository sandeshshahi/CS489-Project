import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { AppDataSource } from "./config/database";
import { typeDefs, resolvers } from "./graphql/schema";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/authRoutes";
import jwt from "jsonwebtoken";

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
    app.use("/auth", authRoutes);
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
    app.use(
      "/graphql",
      cors(),
      express.json(),
      expressMiddleware(server, {
        // The context function runs before every single GraphQL request
        context: async ({ req }) => {
          const authHeader = req.headers.authorization;
          if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
              const JWT_SECRET =
                process.env.JWT_SECRET ||
                "super_secret_dental_key_for_development";
              const decoded = jwt.verify(token, JWT_SECRET);
              // Return the decoded user. This makes 'contextValue.user' available in all resolvers!
              return { user: decoded };
            } catch (err) {
              // Token is expired or invalid
              return { user: null };
            }
          }
          // No token provided
          return { user: null };
        },
      }),
    );

    // Start listening on port 8080
    app.listen(8080, () => {
      console.log(`🚀 Server ready at http://localhost:8080/graphql`);
    });
  } catch (error) {
    console.error("Error starting application:", error);
  }
}

bootstrap();
