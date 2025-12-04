import { Request, Response } from "express";
import company from "../models/company";

// COMPANY LIST (only pagination
export const retrieveCompanyList = async (req: Request, res: Response) => {
  try {

    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const companies = await company
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await company.countDocuments();

    const safeCompanies = companies.map(c => {
      const { password, ...safeCompany } = c.toObject();
      return safeCompany;
    });

    return res.status(200).json({
      companies: safeCompanies,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

// SINGLE COMPANY
export const retrieveCompany = async (req: Request, res: Response) => {
  try {

    const companyInstance = await company.findOne({ slug: req.params.slug ?? req.user.slug });
    if (!companyInstance) {
      return res.status(404).json({ error: "Invalid company slug or company does not exist" });
    }

    const { password: _, ...safeCompany } = companyInstance.toObject();

    return res.status(200).json(safeCompany);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};
