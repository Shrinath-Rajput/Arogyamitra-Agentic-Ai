// TEMPLATE FOR REMAINING PAGES - Copy structure and adapt for each page

/**
 * MEALPLAN PAGE TEMPLATE
 * Copy this structure and replace with MealPlan.tsx
 * Key changes:
 * - GradientBg variant="emerald" for meal plan theme
 * - Use PremiumCard for sections
 * - Use AnimatedButton for actions
 * - Color scheme: emerald/teal
 */

import { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, Apple, History, Trash2, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PremiumCard from '../components/PremiumCard';
import AnimatedButton from '../components/AnimatedButton';
import GradientBg from '../components/GradientBg';

// Keep existing state and logic

return (
  <GradientBg variant="emerald" className="min-h-screen p-4 md:p-8">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PremiumCard gradient="emerald" className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 rounded-2xl">
                <Apple className="text-emerald-400 w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Nutrition Guide</h1>
                <p className="text-gray-400 text-sm mt-1">AI-powered personalized meal plans</p>
              </div>
            </div>
            <AnimatedButton
              onClick={() => setShowHistory(!showHistory)}
              variant="outline"
              className="gap-2"
            >
              <History size={18} />
              {history.length} Plans
            </AnimatedButton>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Generate Section */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PremiumCard gradient="emerald" className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Generate New Plan</h2>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your meal plan requirements..."
              rows={6}
              className="w-full mb-6 px-4 py-3 rounded-xl border-2 border-emerald-500/30 bg-white/10 text-white placeholder-gray-400 hover:border-emerald-400/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/50 transition-all duration-300 resize-none"
            />

            <AnimatedButton
              onClick={generatePlan}
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Generate Meal Plan <ChevronRight size={18} />
            </AnimatedButton>

            {/* Display Plan */}
            {plan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-8 border-t border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-4">Your Meal Plan</h3>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 whitespace-pre-wrap text-gray-200 leading-relaxed max-h-96 overflow-y-auto">
                  {plan}
                </div>
              </motion.div>
            )}
          </PremiumCard>
        </motion.div>

        {/* Right: History Section */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PremiumCard className="p-6 h-full">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <History className="text-emerald-400 w-5 h-5" />
                History
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No plans yet</p>
                ) : (
                  history.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => loadPlan(item)}
                      whileHover={{ x: 5 }}
                      className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-400/50 transition-all group"
                    >
                      <p className="text-white font-medium text-sm group-hover:text-emerald-300 transition-colors">{item.title}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                      {item.is_active && (
                        <div className="mt-2 px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded w-fit">
                          Active
                        </div>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </PremiumCard>
          </motion.div>
        )}
      </div>
    </div>
  </GradientBg>
);

/**
 * WORKOUTPLAN PAGE TEMPLATE
 * Similar to MealPlan but with:
 * - GradientBg variant="primary" for workout theme
 * - Color scheme: cyan/blue
 * - Use Activity icon instead of Apple
 */

/**
 * PROGRESS PAGE TEMPLATE
 * - GradientBg variant="tertiary"
 * - Use StatCard components for metrics
 * - Color scheme: teal/cyan
 * - Animated progress bars
 * - Use Chart component for visualization
 */

/**
 * PROFILEPAGE TEMPLATE
 * - GradientBg variant="primary"
 * - Use PremiumCard for form sections
 * - Multiple color badges for different fields
 * - Use AnimatedButton for save action
 * - Smooth form transitions
 */

// QUICK MIGRATION CHECKLIST:
// 1. Replace outer div with GradientBg component
// 2. Wrap main content divs in PremiumCard
// 3. Replace buttons with AnimatedButton
// 4. Add motion animations to sections
// 5. Update color schemes to match page theme
// 6. Import new components at top
// 7. Add framer-motion imports
// 8. Keep all API logic unchanged
// 9. Test functionality thoroughly
// 10. Verify responsive design on mobile
