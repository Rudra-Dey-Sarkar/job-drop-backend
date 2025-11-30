import page from "../models/page";
import company from "../models/company";
import { Request, Response } from "express";

// SAVE PAGE
export const savePage = async (req: Request, res: Response) => {
    try {
        const companyInstance = await company.findOne({ slug: req.params.slug });
        if (!companyInstance){
            return res.status(404).json({ error: "Invalid company slug" });
        }

        const pageInstance = await page.findOneAndUpdate(
            { company_id: companyInstance._id },
            { ...req.body, company_id: companyInstance._id },
            { upsert: true, new: true }
        );

        return res.status(200).json(pageInstance);
    } catch {
        return res.status(500).json({ error: "Server error" });
    }
};

// GET PAGE
export const getPage = async (req: Request, res: Response) => {
    try {
        const companyInstance = await company.findOne({ slug: req.params.slug });
        if (!companyInstance){
            return res.status(404).json({ error: "Invalid company slug" });
        }

        const pageInstance = await page
            .findOne({ company_id: companyInstance._id })
            .populate({ path: "company_id", select: "-password" });

        return res.status(200).json(pageInstance);
    } catch {
        return res.status(500).json({ error: "Server error" });
    }
};
