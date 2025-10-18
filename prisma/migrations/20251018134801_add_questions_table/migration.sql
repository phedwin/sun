-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "acRate" REAL,
    "isPaidOnly" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "exampleTestcases" TEXT,
    "hints" TEXT,
    "topicTags" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "similarQuestions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionSlug" TEXT NOT NULL,
    "questionTitle" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "language" TEXT,
    "code" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "firstAttemptAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAttemptAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solvedAt" DATETIME,
    CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Progress_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("questionId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Progress" ("attempts", "code", "difficulty", "firstAttemptAt", "id", "language", "lastAttemptAt", "questionId", "questionSlug", "questionTitle", "solvedAt", "status", "userId") SELECT "attempts", "code", "difficulty", "firstAttemptAt", "id", "language", "lastAttemptAt", "questionId", "questionSlug", "questionTitle", "solvedAt", "status", "userId" FROM "Progress";
DROP TABLE "Progress";
ALTER TABLE "new_Progress" RENAME TO "Progress";
CREATE INDEX "Progress_userId_idx" ON "Progress"("userId");
CREATE INDEX "Progress_status_idx" ON "Progress"("status");
CREATE INDEX "Progress_difficulty_idx" ON "Progress"("difficulty");
CREATE UNIQUE INDEX "Progress_userId_questionId_key" ON "Progress"("userId", "questionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Question_questionId_key" ON "Question"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_slug_key" ON "Question"("slug");

-- CreateIndex
CREATE INDEX "Question_difficulty_idx" ON "Question"("difficulty");

-- CreateIndex
CREATE INDEX "Question_slug_idx" ON "Question"("slug");

-- CreateIndex
CREATE INDEX "Question_isPaidOnly_idx" ON "Question"("isPaidOnly");
