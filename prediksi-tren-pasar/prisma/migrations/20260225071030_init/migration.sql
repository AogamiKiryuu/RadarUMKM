-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "subKategori" TEXT,
    "hargaProduk" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "jumlahTerjual" INTEGER NOT NULL DEFAULT 0,
    "namaToko" TEXT,
    "url" TEXT,
    "label" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "subKategori" TEXT,
    "hargaProduk" INTEGER NOT NULL,
    "targetRating" DOUBLE PRECISION NOT NULL,
    "predictionScore" DOUBLE PRECISION NOT NULL,
    "predictionLabel" INTEGER NOT NULL,
    "insight" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_recommendations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "subKategori" TEXT,
    "hargaProduk" INTEGER NOT NULL,
    "targetRating" DOUBLE PRECISION NOT NULL,
    "similarProducts" TEXT,
    "avgHargaKompetitor" DOUBLE PRECISION,
    "avgRatingKompetitor" DOUBLE PRECISION,
    "recommendations" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_recommendations" ADD CONSTRAINT "business_recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
