-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "namaProduk" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "subKategori" TEXT,
    "marketplace" TEXT,
    "lokasi" TEXT,
    "namaToko" TEXT,
    "hargaProduk" INTEGER NOT NULL,
    "jumlahTerjual" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "popularityScore" DOUBLE PRECISION,
    "hargaTier" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
