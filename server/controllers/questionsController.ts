import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const API_BASE_URL = 'https://alfa-leetcode-api.onrender.com';

// Get database stats
export async function getStats(req: Request, res: Response) {
  try {
    const totalQuestions = await prisma.question.count();
    const easyCount = await prisma.question.count({ where: { difficulty: 'Easy' } });
    const mediumCount = await prisma.question.count({ where: { difficulty: 'Medium' } });
    const hardCount = await prisma.question.count({ where: { difficulty: 'Hard' } });

    res.json({
      success: true,
      data: {
        total: totalQuestions,
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
        isEmpty: totalQuestions === 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Helper function to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Sync questions from LeetCode API to database
export async function syncQuestions(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 3000;
    const skip = parseInt(req.query.skip as string) || 0;

    console.log(`Fetching ${limit} questions from LeetCode API...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(
      `${API_BASE_URL}/problems?limit=${limit}&skip=${skip}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch problems: ${response.statusText}`);
    }

    const data = await response.json();
    const problems = data.problemsetQuestionList;

    console.log(`Received ${problems.length} questions. Starting database sync...`);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    // Process questions in batches to avoid overwhelming the database
    const batchSize = 100;
    for (let i = 0; i < problems.length; i += batchSize) {
      const batch = problems.slice(i, i + batchSize);

      for (const problem of batch) {
        try {
          const slug = createSlug(problem.title);

          // Check if question already exists
          const existing = await prisma.question.findUnique({
            where: { questionId: problem.questionFrontendId }
          });

          const questionData = {
            questionId: problem.questionFrontendId,
            slug: slug,
            title: problem.title,
            difficulty: problem.difficulty,
            acRate: problem.acRate,
            isPaidOnly: problem.paidOnly || false,
            topicTags: JSON.stringify(problem.topicTags),
            likes: 0,
            dislikes: 0,
          };

          if (existing) {
            // Update existing question
            await prisma.question.update({
              where: { questionId: problem.questionFrontendId },
              data: questionData
            });
            updated++;
          } else {
            // Create new question
            await prisma.question.create({
              data: questionData
            });
            created++;
          }
        } catch (error) {
          console.error(`Error processing question ${problem.title}:`, error);
          skipped++;
        }
      }

      console.log(`Processed batch ${i / batchSize + 1}/${Math.ceil(problems.length / batchSize)}`);
    }

    console.log(`Sync complete! Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`);

    res.json({
      success: true,
      message: 'Questions synced successfully',
      stats: {
        created,
        updated,
        skipped,
        total: problems.length
      }
    });
  } catch (error) {
    console.error('Error syncing questions:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Get all questions with filtering
export async function getQuestions(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const difficulty = req.query.difficulty as string;
    const topic = req.query.topic as string;
    const search = req.query.search as string;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { slug: { contains: search.toLowerCase() } }
      ];
    }

    // Get questions
    let questions = await prisma.question.findMany({
      where,
      skip,
      take: limit,
      orderBy: { questionId: 'asc' }
    });

    // Filter by topic if provided (since topicTags is stored as JSON)
    if (topic) {
      const normalizedTopic = topic.toLowerCase();
      questions = questions.filter(q => {
        try {
          const tags = JSON.parse(q.topicTags);
          return tags.some((tag: any) =>
            tag.slug === normalizedTopic ||
            tag.name.toLowerCase() === normalizedTopic ||
            tag.slug.toLowerCase().includes(normalizedTopic) ||
            normalizedTopic.includes(tag.slug.toLowerCase())
          );
        } catch {
          return false;
        }
      });
    }

    // Get total count
    const total = await prisma.question.count({ where });

    res.json({
      success: true,
      data: questions.map(q => ({
        ...q,
        topicTags: JSON.parse(q.topicTags)
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Get a single question by slug
export async function getQuestionBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const question = await prisma.question.findUnique({
      where: { slug }
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    // Fetch full details from LeetCode API if needed
    let fullDetails = null;
    try {
      const response = await fetch(`${API_BASE_URL}/select?titleSlug=${slug}`);
      if (response.ok) {
        fullDetails = await response.json();

        // Update database with full details
        await prisma.question.update({
          where: { slug },
          data: {
            description: fullDetails.question,
            exampleTestcases: fullDetails.exampleTestcases,
            hints: JSON.stringify(fullDetails.hints || []),
            likes: fullDetails.likes || 0,
            dislikes: fullDetails.dislikes || 0,
            similarQuestions: fullDetails.similarQuestions || null
          }
        });
      }
    } catch (error) {
      console.error('Error fetching full question details:', error);
    }

    res.json({
      success: true,
      data: {
        ...question,
        topicTags: JSON.parse(question.topicTags),
        hints: question.hints ? JSON.parse(question.hints) : [],
        ...(fullDetails && {
          question: fullDetails.question,
          exampleTestcases: fullDetails.exampleTestcases
        })
      }
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Get all unique topic tags with question counts
export async function getTopics(req: Request, res: Response) {
  try {
    const questions = await prisma.question.findMany({
      select: { topicTags: true }
    });

    const topicsMap = new Map<string, any>();
    const topicCounts = new Map<string, number>();

    questions.forEach(q => {
      try {
        const tags = JSON.parse(q.topicTags);
        tags.forEach((tag: any) => {
          if (!topicsMap.has(tag.slug)) {
            topicsMap.set(tag.slug, tag);
            topicCounts.set(tag.slug, 0);
          }
          // Increment count for this topic
          topicCounts.set(tag.slug, (topicCounts.get(tag.slug) || 0) + 1);
        });
      } catch (error) {
        // Skip invalid JSON
      }
    });

    const topics = Array.from(topicsMap.values())
      .map(tag => ({
        ...tag,
        count: topicCounts.get(tag.slug) || 0
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
