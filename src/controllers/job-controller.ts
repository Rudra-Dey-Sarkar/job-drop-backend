import company from "../models/company";
import job from "../models/job";
import { Request, Response } from "express";

// ADD JOB
export const addJob = async (req: Request, res: Response) => {
  try {
    const companyInstance = await company.findOne({ slug: req.user.slug });
    if (!companyInstance) {
      return res.status(404).json({ error: "Invalid company slug or company does not exist" });
    }

    if (!req.body.title) {
      return res.status(400).json({ error: "Job title is required" });
    }

    const jobInstance = await job.create({
      ...req.body,
      company_id: companyInstance._id,
    });

    return res.status(200).json(jobInstance);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

// EDIT JOB
export const editJob = async (req: Request, res: Response) => {
  try {
    console.log(req.body, req.params)
    const companyInstance = await company.findOne({ slug: req.user.slug });
    if (!companyInstance) {
      return res.status(404).json({ error: "Invalid company slug or company does not exist" });
    }

    if (!req.params.id) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    const jobInstance = await job.findOneAndUpdate(
      { _id: req.params.id },
      {
        ...req.body,
      },
      { new: true }
    );

    return res.status(200).json(jobInstance);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

// JOB LIST
export const retrieveJobList = async (req: Request, res: Response) => {
  try {
    const companyInstance = await company.findOne({ slug: req.params.slug });
    if (!companyInstance) {
      return res.status(404).json({ error: "Invalid company slug" });
    }

    const toArray = (v: any, fallback: any[]) =>
      v ? String(v).split(",") : fallback;

    const status = toArray(req.query.status, ["published", "draft"]);
    const locationNames = toArray(req.query.location, []);
    const locationTypes = toArray(req.query.location_type, []);
    const types = toArray(req.query.type, []);
    const sectors = toArray(req.query.sector, []);
    const expLevels = toArray(req.query.experience_level, []);

    const salaryMin = req.query.salary_min ? Number(req.query.salary_min) : null;
    const salaryMax = req.query.salary_max ? Number(req.query.salary_max) : null;

    const search = req.query.q ? String(req.query.q) : null;
    const sortQuery = req.query.sort === "oldest" ? 1 : -1;

    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { company_id: companyInstance._id };

    if (status.length) filter.status = { $in: status };
    if (types.length) filter.type = { $in: types };
    if (sectors.length) filter.sector = { $in: sectors };
    if (expLevels.length) filter.experience_level = { $in: expLevels };

    // filter for locations.location (array of strings)
    if (locationNames.length)
      filter["locations.location"] = { $in: locationNames };

    // filter for locations.type
    if (locationTypes.length)
      filter["locations.type"] = { $in: locationTypes };

    // Salary range filter
    if (salaryMin !== null || salaryMax !== null) {
      filter["salary_range.min"] = {};
      filter["salary_range.max"] = {};
      if (salaryMin !== null) filter["salary_range.min"].$gte = salaryMin;
      if (salaryMax !== null) filter["salary_range.max"].$lte = salaryMax;
    }

    // Text search (updated)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "locations.location": { $regex: search, $options: "i" } }, // updated
        { sector: { $regex: search, $options: "i" } },
      ];
    }

    const jobsInstance = await job
      .find(filter)
      .sort({ createdAt: sortQuery })
      .skip(skip)
      .limit(limit)
      .populate({ path: "company_id", select: "-password" });

    const total = await job.countDocuments(filter);

    return res.status(200).json({
      jobs: jobsInstance,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

// SINGLE JOB
export const retrieveJob = async (req: Request, res: Response) => {
  try {

    const jobInstance = await job
      .findOne({ _id: req.params.id })
      .populate({ path: "company_id", select: "-password" });

    if (!jobInstance) {
      return res.status(404).json({ error: "Invalid job ID" });
    }

    return res.status(200).json(jobInstance);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

// DELETE JOB
export const deleteJob = async (req: Request, res: Response) => {
  try {

    if (!req.params.id) {
      return res.status(400).json({ error: "Job ID is required" });
    }

    const companyInstance = await company.findOne({ slug: req.user.slug });
    if (!companyInstance) {
      return res.status(404).json({ error: "Invalid company slug or company does not exist" });
    }

    const jobInstance = await job.findOneAndDelete({ _id: req.params.id });

    return res.status(200).json(jobInstance);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

