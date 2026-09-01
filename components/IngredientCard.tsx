import React from "react";
import { ParsedIngredient } from "@/lib/parseIngredients";

interface IngredientCardProps {
  ingredient: ParsedIngredient;
}

export default function IngredientCard({ ingredient }: IngredientCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base">
            {ingredient.name}
          </h3>
          {ingredient.strength && (
            <span className="shrink-0 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
              {ingredient.strength}
            </span>
          )}
        </div>
      </div>

      {ingredient.classification && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
            {ingredient.classification}
          </span>
        </div>
      )}
    </div>
  );
}
