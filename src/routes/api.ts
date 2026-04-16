import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Patient } from "../models/Patient";
import { Address } from "../models/Address";
import { Like } from "typeorm";
import { authenticateJWT, authorizeRoles } from "../middleware/auth.middleware";

const router = Router();

// GET all Patients (Sorted by lastName ASC)
router.get(
  "/patients",
  authenticateJWT,
  authorizeRoles("ADMIN", "OFFICE_MANAGER"),
  async (req: Request, res: Response) => {
    try {
      const patientRepo = AppDataSource.getRepository(Patient);
      const patients = await patientRepo.find({
        relations: ["address"],
        order: { lastName: "ASC" },
      });
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  },
);

// GET Patient by ID
router.get(
  "/patients/:id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const patientRepo = AppDataSource.getRepository(Patient);
      const patient = await patientRepo.findOne({
        where: { id: parseInt(req.params.id as string) },
        relations: ["address"],
      });

      if (!patient) {
        return res
          .status(404)
          .json({ message: `Patient with ID ${req.params.id} not found.` });
      }
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  },
);

// POST Register new Patient
router.post("/patients", async (req: Request, res: Response) => {
  try {
    const patientRepo = AppDataSource.getRepository(Patient);
    const { firstName, lastName, primaryAddress } = req.body;

    const newAddress = new Address();
    newAddress.street = primaryAddress.street;
    newAddress.city = primaryAddress.city;
    newAddress.zipCode = primaryAddress.zipCode;

    const newPatient = new Patient();
    newPatient.firstName = firstName;
    newPatient.lastName = lastName;
    newPatient.address = newAddress;

    const savedPatient = await patientRepo.save(newPatient);
    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// PUT Update Patient
router.put(
  "/patient/:id",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const patientRepo = AppDataSource.getRepository(Patient);
      const existingPatient = await patientRepo.findOne({
        where: { id: parseInt(req.params.id as string) },
        relations: ["address"],
      });

      if (!existingPatient) {
        return res.status(404).json({
          message: `Cannot update. Patient with ID ${req.params.id} not found.`,
        });
      }

      const { firstName, lastName, primaryAddress } = req.body;

      if (firstName) existingPatient.firstName = firstName;
      if (lastName) existingPatient.lastName = lastName;

      if (primaryAddress) {
        if (primaryAddress.street)
          existingPatient.address.street = primaryAddress.street;
        if (primaryAddress.city)
          existingPatient.address.city = primaryAddress.city;
        if (primaryAddress.zipCode)
          existingPatient.address.zipCode = primaryAddress.zipCode;
      }

      const updatedPatient = await patientRepo.save(existingPatient);
      res.status(200).json(updatedPatient);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  },
);

// DELETE Patient
router.delete(
  "/patient/:id",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const patientRepo = AppDataSource.getRepository(Patient);
      const existingPatient = await patientRepo.findOneBy({
        id: parseInt(req.params.id as string),
      });

      if (!existingPatient) {
        return res.status(404).json({
          message: `Cannot delete. Patient with ID ${req.params.id} not found.`,
        });
      }

      await patientRepo.remove(existingPatient);
      res.status(200).json({
        message: `Patient with ID ${req.params.id} deleted successfully.`,
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  },
);

// GET Search Patients
router.get(
  "/patient/search/:searchString",
  async (req: Request, res: Response) => {
    try {
      const patientRepo = AppDataSource.getRepository(Patient);
      const { searchString } = req.params;

      const patients = await patientRepo.find({
        where: [
          { firstName: Like(`%${searchString}%`) },
          { lastName: Like(`%${searchString}%`) },
        ],
        relations: ["address"],
      });

      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  },
);

// GET all Addresses (Sorted by city ASC)
router.get("/addresses", async (req: Request, res: Response) => {
  try {
    const addressRepo = AppDataSource.getRepository(Address);
    const addresses = await addressRepo.find({
      relations: ["patient"],
      order: { city: "ASC" },
    });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

export default router;
