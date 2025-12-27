"use client";

import useCart from "@/hooks/useCart";
import { TProductResponse } from "@/types/product";
import { rupiahFormat } from "@/utils/rupiahFormat";
import { Card, CardBody, Spinner } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { FaMapPin, FaStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ product }: { product: TProductResponse }) => {
  const { name, price, imageUrl, seller } = product;
  const { mutateAddToCart, isPendingAddToCart } = useCart();
  // const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price;

  return (
    <Card
      shadow="none"
      className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-success/50 transition-all duration-300 rounded-3xl overflow-hidden"
      as={Link}
      href={`/product/${product.id}`}
    >
      <div className="relative overflow-hidden aspect-square lg:aspect-video">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardBody className="p-4 lg:p-5">
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-foreground text-sm lg:text-base line-clamp-1 group-hover:text-success transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <FaStar className="w-3 h-3 text-yellow-400" />
                <span className="text-[10px] lg:text-xs font-bold text-foreground">4.9</span>
              </div>
              <span className="text-[10px] lg:text-xs text-muted-foreground">|</span>
              <div className="flex items-center gap-1 text-muted-foreground">
                <FaMapPin className="w-3 h-3" />
                <span className="text-[10px] lg:text-xs truncate max-w-[80px]">
                  {seller?.storeLocation}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-lg lg:text-xl font-black text-success">
                {rupiahFormat(price)}
              </span>
              <span className="text-[10px] lg:text-xs text-muted-foreground font-medium">
                /{product?.Unit?.symbol || "kg"}
              </span>
            </div>
            <p className="text-[10px] lg:text-xs text-muted-foreground mt-1 font-medium">
              Toko: {seller?.storeName}
            </p>
          </div>

          <button
            className="w-full h-10 lg:h-11 rounded-2xl bg-success text-white font-bold text-xs lg:text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 active:scale-95 transition-all duration-200 disabled:opacity-50"
            disabled={isPendingAddToCart}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              mutateAddToCart({
                payload: {
                  productId: product.id,
                  quantity: 1,
                  price: product.price,
                },
              });
            }}
          >
            {isPendingAddToCart ? (
              <Spinner size="sm" color="white" />
            ) : (
              <div className="flex items-center justify-center gap-2 w-full">
                <FiShoppingCart className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Tambah ke Keranjang</span>
              </div>
            )}
          </button>
        </div>
      </CardBody>
    </Card>
  );
};
export default ProductCard;
