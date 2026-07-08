import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ProductListings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-4xl font-bold text-white">ProductListings</h1>
        <Card className="border-purple-600 bg-slate-800 p-6">
          <p className="text-gray-300">
            ProductListings feature coming soon...
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ProductListings;
