"use client";

import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";

import { TrendingUp } from "lucide-react";

interface Props {
  title: string;
  value: string;
  change: string;
}

export default function StatCard({
  title,
  value,
  change,
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: .25 }}
    >
      <Card className="rounded-2xl p-6 cursor-pointer hover:shadow-xl transition">

        <div className="flex justify-between">

          <div>

            <p className="text-muted-foreground">
              {title}
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              {value}
            </h2>

            <p className="mt-5 text-green-600 font-medium">
              {change}
            </p>

          </div>

          <div
            className="
            h-12
            w-12
            rounded-xl
            bg-blue-50
            flex
            items-center
            justify-center
            "
          >
            <TrendingUp
              className="text-blue-600"
            />
          </div>

        </div>

      </Card>
    </motion.div>
  );
}