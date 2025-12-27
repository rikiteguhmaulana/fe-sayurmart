"use client";

import useCategory from "@/hooks/useCateogry";
import { TCategory } from "@/types/category";
import { Card, CardBody, Skeleton } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

const CategorySection = () => {
  const { dataCategories, isLoadingCategories } = useCategory();

  return (
    <section id="categories" className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Kategori Sayuran
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoadingCategories ? (
            <>
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="w-full h-[180px] rounded-lg" />
              ))}
            </>
          ) : null}
          {dataCategories?.categories?.map((category: TCategory) => (
            <Card
              shadow="none"
              as={Link}
              href={`/explore?category=${category.id}`}
              key={category.id}
              className="group cursor-pointer bg-white/40 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-black/40 hover:-translate-y-1 transition-all duration-300"
            >
              <CardBody className="p-6 text-center">
                <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-emerald-900/40 dark:to-green-900/20 rounded-2xl p-2 shadow-inner">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
                <h3 className="font-bold text-base text-foreground mb-1 group-hover:text-success transition-colors">
                  {category.name}
                </h3>
                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">
                  {category.products?.length || 0} Produk
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CategorySection;
