-- CreateTable
CREATE TABLE "Shirt" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "sizes" TEXT[],
    "color" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shirt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShirtImage" (
    "id" TEXT NOT NULL,
    "shirtId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ShirtImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "hoursJson" JSONB NOT NULL,
    "aboutTitle" TEXT NOT NULL,
    "aboutContent" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageViewEvent" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "referrer" TEXT,
    "deviceType" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageViewEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductClickEvent" (
    "id" TEXT NOT NULL,
    "shirtId" TEXT,
    "actionType" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductClickEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Shirt_active_category_idx" ON "Shirt"("active", "category");

-- CreateIndex
CREATE INDEX "Shirt_active_color_idx" ON "Shirt"("active", "color");

-- CreateIndex
CREATE INDEX "ShirtImage_shirtId_sortOrder_idx" ON "ShirtImage"("shirtId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "PageViewEvent_timestamp_idx" ON "PageViewEvent"("timestamp");

-- CreateIndex
CREATE INDEX "ProductClickEvent_timestamp_idx" ON "ProductClickEvent"("timestamp");

-- CreateIndex
CREATE INDEX "ProductClickEvent_shirtId_idx" ON "ProductClickEvent"("shirtId");

-- AddForeignKey
ALTER TABLE "ShirtImage" ADD CONSTRAINT "ShirtImage_shirtId_fkey" FOREIGN KEY ("shirtId") REFERENCES "Shirt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductClickEvent" ADD CONSTRAINT "ProductClickEvent_shirtId_fkey" FOREIGN KEY ("shirtId") REFERENCES "Shirt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
