/*
  Warnings:

  - A unique constraint covering the columns `[nameAr]` on the table `JobTitle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameAr]` on the table `Nationality` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameAr]` on the table `Rank` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameAr]` on the table `Sponsor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nameAr]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobTitle_nameAr_key" ON "JobTitle"("nameAr");

-- CreateIndex
CREATE UNIQUE INDEX "Nationality_nameAr_key" ON "Nationality"("nameAr");

-- CreateIndex
CREATE UNIQUE INDEX "Rank_nameAr_key" ON "Rank"("nameAr");

-- CreateIndex
CREATE UNIQUE INDEX "Sponsor_nameAr_key" ON "Sponsor"("nameAr");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_nameAr_key" ON "Unit"("nameAr");
