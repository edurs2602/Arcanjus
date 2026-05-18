-- AlterTable
ALTER TABLE "Shirt" ADD COLUMN     "aiColor" TEXT,
ADD COLUMN     "aiDescription" TEXT,
ADD COLUMN     "aiType" TEXT,
ADD COLUMN     "pipelineError" TEXT,
ADD COLUMN     "pipelineStatus" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "ShirtImage" ADD COLUMN     "isAiGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modelName" TEXT;
