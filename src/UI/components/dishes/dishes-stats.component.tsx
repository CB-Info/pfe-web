import React from 'react';
import { Dish } from '../../../data/models/dish.model';
import { PanelContent } from '../contents/panel.content';
import { TrendingUp, TrendingDown, ChefHat, CheckCircle, XCircle, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface DishesStatsProps {
  dishes: Dish[];
  filteredCount: number;
}

export const DishesStats: React.FC<DishesStatsProps> = ({ dishes, filteredCount }) => {
  const totalDishes = dishes.length;
  const availableDishes = dishes.filter(dish => dish.isAvailable).length;
  const unavailableDishes = totalDishes - availableDishes;
  const uniqueCategories = new Set(dishes.map(dish => dish.category)).size;
  const averagePrice = totalDishes > 0 ? dishes.reduce((sum, dish) => sum + dish.price, 0) / totalDishes : 0;

  const stats = [
    {
      label: 'Total des plats',
      value: totalDishes,
      icon: ChefHat,
      color: 'blue',
      trend: '+12%',
      trendUp: true
    },
    {
      label: 'Plats disponibles',
      value: availableDishes,
      icon: CheckCircle,
      color: 'green',
      percentage: totalDishes > 0 ? Math.round((availableDishes / totalDishes) * 100) : 0
    },
    {
      label: 'Plats indisponibles',
      value: unavailableDishes,
      icon: XCircle,
      color: 'red',
      percentage: totalDishes > 0 ? Math.round((unavailableDishes / totalDishes) * 100) : 0
    },
    {
      label: 'Catégories',
      value: uniqueCategories,
      icon: Tag,
      color: 'purple',
      subtext: 'types différents'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        icon: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        icon: 'text-green-600'
      },
      red: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        icon: 'text-red-600'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        icon: 'text-purple-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color);
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PanelContent>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 ${colors.bg} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  {stat.trend && (
                    <div className={`flex items-center gap-1 text-xs ${
                      stat.trendUp ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trendUp ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span className="font-medium">{stat.trend}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${colors.text}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                  
                  {stat.percentage !== undefined && (
                    <div className="text-xs text-gray-500">
                      {stat.percentage}% du total
                    </div>
                  )}
                  
                  {stat.subtext && (
                    <div className="text-xs text-gray-500">
                      {stat.subtext}
                    </div>
                  )}
                </div>

                {/* Progress bar for percentages */}
                {stat.percentage !== undefined && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          stat.color === 'green' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </PanelContent>
          </motion.div>
        );
      })}
    </div>
  );
};