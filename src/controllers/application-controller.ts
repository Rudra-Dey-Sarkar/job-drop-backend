import { Request, Response } from "express";
import company from "../models/company";
import application from "../models/application";
import job from "../models/job";

// CREATE APPLICATION
export const addApplication = async (req: Request, res: Response) => {
  try {
    const jobInstance = await job.findOne({ _id: req.params.id }).populate("company_id");
    if (!jobInstance) {
      return res.status(404).json({ error: "Invalid Job ID" });
    }

    if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.phone || !req.body.resume_url || !req.body.location || !req.body.gender) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const appInstance = await application.create({
      ...req.body,
      company_id: jobInstance.company_id?._id,
      job_id: jobInstance._id,
    });

    return res.status(200).json(appInstance);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

// UPDATE APPLICATION
export const editApplication = async (req: Request, res: Response) => {
  try {

    if (!req.body.status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const appInstance = await application.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
      },
      { new: true }
    );
    return res.status(200).json(appInstance);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

// APPLICATION LIST (only pagination)
export const retrieveApplicationList = async (req: Request, res: Response) => {
  try {
    const companyInstance = await company.findOne({ slug: req.params.slug });
    if (!companyInstance) {
      return res.status(404).json({ error: "Invalid company slug" });
    }

    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const filter = { company_id: companyInstance._id };

    const applications = await application
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("job_id").populate("company_id");

    const total = await application.countDocuments(filter);

    return res.status(200).json({
      applications,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

// SINGLE APPLICATION
export const retrieveApplication = async (req: Request, res: Response) => {
  try {

    if (!req.params.id) {
      return res.status(400).json({ error: "Application ID is required" });
    }

    const appInstance = await application
      .findOne({ _id: req.params.id })
      .populate("job_id").populate("company_id");

    return res.status(200).json(appInstance);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};
