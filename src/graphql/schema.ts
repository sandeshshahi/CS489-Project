import { GraphQLError } from "graphql/error";
import { AppDataSource } from "../config/database";
import { Patient } from "../models/Patient";
import { Like } from "typeorm";
import { Address } from "../models/Address";

// Define the GraphQL Schema (The shape of the API)
export const typeDefs = `#graphql
  type Address {
    id: ID!
    street: String!
    city: String!
    zipCode: String!
    patient: Patient
  }

  type Patient {
    id: ID!
    firstName: String!
    lastName: String!
    primaryAddress: Address # Maps to the 'address' relation
  }

  input AddressInput {
    street: String!
    city: String!
    zipCode: String!
  }

  input PatientInput {
    firstName: String!
    lastName: String!
    primaryAddress: AddressInput
  }

  input PatientUpdateInput {
    firstName: String
    lastName: String
    primaryAddress: AddressInput
  }

  type Query {
    # List all patients sorted by lastName
    getAllPatients: [Patient]
    
    # Get patient by ID
    getPatientById(id: ID!): Patient
    
    # Search patients
    searchPatients(searchString: String!): [Patient]
    
    # List all addresses sorted by city
    getAllAddresses: [Address]
  }

  type Mutation {
    # Register a new patient
    registerPatient(patient: PatientInput!): Patient
    
    # Update a patient
    updatePatient(id: ID!, patient: PatientUpdateInput!): Patient
    
    # Delete a patient
    deletePatient(id: ID!): String
  }
`;

// Define the Resolvers (The logic to fetch the data)
export const resolvers = {
  // Mapping the GraphQL 'primaryAddress' to the database 'address' field
  Patient: {
    primaryAddress: (parent: Patient) => parent.address,
  },

  Query: {
    getAllPatients: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError(
          "Access Denied: You must be logged in to view patients.",
          {
            extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
          },
        );
      }
      const patientRepo = AppDataSource.getRepository(Patient);
      return await patientRepo.find({
        relations: ["address"],
        order: { lastName: "ASC" },
      });
    },

    getPatientById: async (_: any, { id }: { id: string }) => {
      const patientRepo = AppDataSource.getRepository(Patient);
      const patient = await patientRepo.findOne({
        where: { id: parseInt(id) },
        relations: ["address"],
      });

      if (!patient) {
        throw new GraphQLError(`Patient with ID ${id} not found.`, {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
      }
      return patient;
    },

    searchPatients: async (
      _: any,
      { searchString }: { searchString: string },
    ) => {
      const patientRepo = AppDataSource.getRepository(Patient);
      return await patientRepo.find({
        where: [
          { firstName: Like(`%${searchString}%`) },
          { lastName: Like(`%${searchString}%`) },
        ],
        relations: ["address"],
      });
    },

    getAllAddresses: async () => {
      const addressRepo = AppDataSource.getRepository(Address);
      return await addressRepo.find({
        relations: ["patient"],
        order: { city: "ASC" },
      });
    },
  },

  Mutation: {
    registerPatient: async (_: any, { patient }: { patient: any }) => {
      const patientRepo = AppDataSource.getRepository(Patient);

      const newAddress = new Address();
      newAddress.street = patient.primaryAddress.street;
      newAddress.city = patient.primaryAddress.city;
      newAddress.zipCode = patient.primaryAddress.zipCode;

      const newPatient = new Patient();
      newPatient.firstName = patient.firstName;
      newPatient.lastName = patient.lastName;
      newPatient.address = newAddress;

      return await patientRepo.save(newPatient);
    },

    updatePatient: async (
      _: any,
      { id, patient }: { id: string; patient: any },
    ) => {
      const patientRepo = AppDataSource.getRepository(Patient);

      const existingPatient = await patientRepo.findOne({
        where: { id: parseInt(id) },
        relations: ["address"],
      });

      if (!existingPatient) {
        throw new GraphQLError(
          `Cannot update. Patient with ID ${id} not found.`,
          {
            extensions: { code: "NOT_FOUND", http: { status: 404 } },
          },
        );
      }

      if (patient.firstName) existingPatient.firstName = patient.firstName;
      if (patient.lastName) existingPatient.lastName = patient.lastName;

      if (patient.primaryAddress) {
        existingPatient.address.street = patient.primaryAddress.street;
        existingPatient.address.city = patient.primaryAddress.city;
        existingPatient.address.zipCode = patient.primaryAddress.zipCode;
      }

      return await patientRepo.save(existingPatient);
    },

    deletePatient: async (
      _parent: any,
      { id }: { id: string },
      context: any,
    ) => {
      // check authentication
      if (!context.user) {
        throw new GraphQLError("Access Denied: Please log in.", {
          extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
        });
      }
      //    Check Role Authorization (Must be ADMIN)
      if (context.user.role !== "ADMIN") {
        throw new GraphQLError(
          "Forbidden: Only Administrators can delete patients.",
          {
            extensions: { code: "FORBIDDEN", http: { status: 403 } },
          },
        );
      }

      const patientRepo = AppDataSource.getRepository(Patient);
      const existingPatient = await patientRepo.findOneBy({ id: parseInt(id) });

      if (!existingPatient) {
        throw new GraphQLError(
          `Cannot delete. Patient with ID ${id} not found.`,
          {
            extensions: { code: "NOT_FOUND", http: { status: 404 } },
          },
        );
      }

      await patientRepo.remove(existingPatient);
      return `Patient with ID ${id} deleted successfully.`;
    },
  },
};
