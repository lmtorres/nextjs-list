/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Player_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
