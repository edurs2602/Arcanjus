-- AlterTable
ALTER TABLE "Shirt" ADD COLUMN     "collectionId" TEXT;

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "bannerUrl" TEXT NOT NULL,
    "bannerAlt" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Collection_active_order_idx" ON "Collection"("active", "order");

-- CreateIndex
CREATE INDEX "Shirt_collectionId_idx" ON "Shirt"("collectionId");

-- AddForeignKey
ALTER TABLE "Shirt" ADD CONSTRAINT "Shirt_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
