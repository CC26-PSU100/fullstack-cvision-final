-- CreateTable
CREATE TABLE "cv_analysis" (
    "id" TEXT NOT NULL,
    "cv_id" TEXT NOT NULL,
    "analysis_result" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cv_analysis_cv_id_key" ON "cv_analysis"("cv_id");

-- AddForeignKey
ALTER TABLE "cv_analysis" ADD CONSTRAINT "cv_analysis_cv_id_fkey" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
