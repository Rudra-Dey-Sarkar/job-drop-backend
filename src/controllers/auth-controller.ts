import company from "../models/company";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import slugify from "slugify";

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const slug = slugify(name, { lower: true });

    // User already exists
    const existing = await company.findOne({ $or: [{ email }, { slug }] });
    if (existing) return res.status(409).json({ error: "Company already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const companyInstance = await company.create({
      ...req.body,
      slug:slug,
      password: hashed,
    });

    const token = jwt.sign(
      { id: companyInstance._id, slug: companyInstance.slug },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const { password: _, ...safeCompany } = companyInstance.toObject();
    return res.status(200).json({ company: safeCompany, token });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Missing fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const companyInstance = await company.findOne({ email });
    if (!companyInstance) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, companyInstance.password as string);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: companyInstance._id, slug: companyInstance.slug },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const { password: _, ...safeCompany } = companyInstance.toObject();
    return res.status(200).json({ company: safeCompany, token });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
