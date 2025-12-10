import page from "../models/page";
import company from "../models/company";
import { Request, Response } from "express";

// SAVE PAGE
export const savePage = async (req: Request, res: Response) => {
    try {
        const companyInstance = await company.findOne({ slug: req.user.slug });
        if (!companyInstance) {
            return res.status(404).json({ error: "Invalid company slug" });
        }

        const { brand, sections, status } = req.body;

        if (status === "published") {
            const payload = {
                status: "published",

                brand: {
                    primary_color: {
                        draft: brand.primary_color.draft,
                        published: brand.primary_color.draft,
                    },
                    secondary_color: {
                        draft: brand.secondary_color.draft,
                        published: brand.secondary_color.draft,
                    },
                    logo_url: {
                        draft: brand.logo_url.draft,
                        published: brand.logo_url.draft,
                    },
                    banner_url: {
                        draft: brand.banner_url.draft,
                        published: brand.banner_url.draft,
                    },
                    culture_video_url: {
                        draft: brand.culture_video_url.draft,
                        published: brand.culture_video_url.draft,
                    },
                },

                sections: {
                    draft: sections.draft,
                    published: sections.draft,
                },

                company_id: companyInstance._id,
            };

            const saved = await page.findOneAndUpdate(
                { company_id: companyInstance._id },
                payload,
                { upsert: true, new: true }
            );

            return res.status(200).json(saved);
        }

        const draftPayload = {
            status: "draft",
            brand,
            sections,
            company_id: companyInstance._id,
        };

        const savedDraft = await page.findOneAndUpdate(
            { company_id: companyInstance._id },
            draftPayload,
            { upsert: true, new: true }
        );

        return res.status(200).json(savedDraft);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

// GET PAGE
export const getPage = async (req: Request, res: Response) => {
    try {
        const companyInstance = await company.findOne({ slug: req.params.slug });
        if (!companyInstance) {
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
