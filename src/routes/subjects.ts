import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express, { Request, Response } from "express";
import { departments, subjects } from "../db/schema";
import { db } from "../db";

const router = express.Router();

function escapeLikePattern(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;

    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    const currentPage = Math.max(1, Number.isNaN(parsedPage) ? 1 : parsedPage);
    const limitPerPage = Math.max(1, Number.isNaN(parsedLimit) ? 1 : parsedLimit);

    const offset = (currentPage - 1) * limitPerPage;
    const filterConditions = [];

    // If search query is provided, filter by subject name or code
    if (search) {
      const escapedSearch = escapeLikePattern(String(search));

      filterConditions.push(
        or(
          ilike(subjects.name, `%${escapedSearch}%`),
          ilike(subjects.code, `%${escapedSearch}%`),
        ),
      );
    }

    // If department filter is provided, filter by department name
    if (department) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    }

    // Combine all filter conditions using AND
    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const subjectsList = await db
      .select({
        ...getTableColumns(subjects),
        department: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: subjectsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Failed to get subjects" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    res.status(501).json({ message: "Not implemented" });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Failed to create subject" });
  }
});

export default router;
