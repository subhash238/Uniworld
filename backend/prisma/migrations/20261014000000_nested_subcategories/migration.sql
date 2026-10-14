-- Add self-referencing parent for nested sub-categories (e.g. PoE -> 8ch / 10ch)
ALTER TABLE "SubCategory" ADD COLUMN "parentId" TEXT;

ALTER TABLE "SubCategory"
  ADD CONSTRAINT "SubCategory_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "SubCategory"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "SubCategory_parentId_idx" ON "SubCategory"("parentId");
