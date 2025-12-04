import mongoose from "mongoose";
import fetch from "node-fetch";
import job, { sectorEnum } from "../models/job";
import company from "../models/company";
import dotenv from "dotenv";

dotenv.config();

interface JobCard {
  title: string;
  work_policy: string;
  location: string;
  department: string;
  employment_type: string;
  experience_level: string;
  job_type: string;
  salary_range: string;
  job_slug: string;
  posted_days_ago: string;
}

const SHEET_URL = `https://docs.google.com/spreadsheets/d/${process.env.SHEET_ID}/gviz/tq?tqx=out:json&gid=2078673351`;

const extractCurrencyInformation = (text: string) => {
  const multiplier = (val: string) => {
    val = val.toLowerCase();
    if (val.endsWith("k")) return parseFloat(val) * 1_000;
    if (val.endsWith("l")) return parseFloat(val) * 1_00_000;
    if (val.endsWith("cr")) return parseFloat(val) * 1_00_00_000;
    return parseFloat(val);
  };

  // Extract currency
  const currencyMatch = text.match(/\b[A-Z]{3}\b/);
  const currency = currencyMatch ? currencyMatch[0] : null;

  // Extract duration
  const durationMatch = text.match(/month|year/i);
  const duration = durationMatch ? durationMatch[0].toLowerCase() : null;

  // Extract numeric-like values including K, L, Cr
  const nums = text.match(/(\d+(?:\.\d+)?(?:k|l|cr)?)/gi);
  let min = 0, max = 0;

  if (nums && nums.length > 0) {
    min = multiplier(nums[0]) || 0;
    max = nums[1] ? multiplier(nums[1]) || min : min;
  }

  return { min, max, currency, duration };
};

async function seedJobs() {

  const connectDB = () =>
    mongoose.connect(process.env.DB_URL as string).then(() => {
      console.log("Database connected");
    }).catch((err) => {
      console.error("Database connection error:-", err);
    });

  await connectDB();

  const raw = await fetch(SHEET_URL).then(r => r.text());

  const json = JSON.parse(raw.replace("/*O_o*/", "").replace("google.visualization.Query.setResponse(", "").slice(0, -2));

  // Convert sheet rows to objects
  const rows = json.table.rows.map((r: any) =>
    r.c.map((c: any) => (c ? c.v : null))
  );

  // If first row = headers
  const headers = rows[0];
  const data: JobCard[] = rows.slice(1).map((row: any[]) => {
    const obj: any = {};
    headers.forEach((h: string, i: number) => (obj[h] = row[i]));
    return obj;
  });


  const companyInstance = await company.find();

  const jobDataToBeInserted = data.map((j) => {

    const { min, max, currency, duration } = extractCurrencyInformation(j.salary_range);

    const locationArray = j.location ? j.location.split(",").map(loc => loc.trim()) : [];

    return {
      company_id: companyInstance?.[0]?._id,
      title: j.title || "",
      description: "",
      locations: {
        location: locationArray.length > 0 ? locationArray : null,
        type: j.work_policy.toLowerCase().split(" ").join("-") || "remote"
      },
      type: j.employment_type.toLowerCase().split(" ").join("-") || "",
      sector: sectorEnum.includes(j.department.toLowerCase().split(" ").join("-")) ? j.department.toLowerCase().split(" ").join("-") : "other",
      experience_level: j.experience_level.toLowerCase().split("-")[0] || "",
      salary_range: {
        min: min,
        max: max,
        currency: currency,
        duration: duration
      },
    }
  })

  await job.insertMany(jobDataToBeInserted);
  
  console.log("Job seeding completed.");

  process.exit(0);
}



seedJobs();