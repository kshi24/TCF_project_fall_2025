import React, { useMemo } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from './ui/utils';

function IconBase({ className, children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-5 w-5', className)}
      {...props}
    >
      {children}
    </svg>
  );
}

function Trophy(props) {
  return (
    <IconBase {...props}>
      <path d="M8 21h8" />
      <path d="M9 5V3h6v2" />
      <path d="M17 5v6c0 3.31-2.69 6-5 6s-5-2.69-5-6V5" />
      <path d="M4 5h3v2c0 1.66-1.34 3-3 3S1 8.66 1 7V5h3z" />
      <path d="M20 5h3v2c0 1.66-1.34 3-3 3s-3-1.34-3-3V5h3z" />
    </IconBase>
  );
}

function DollarSign(props) {
  return (
    <IconBase {...props}>
      <path d="M12 2v20" />
      <path d="M17 7c0-2.21-2.24-4-5-4s-5 1.79-5 4 2.24 4 5 4 5 1.79 5 4-2.24 4-5 4-5-1.79-5-4" />
    </IconBase>
  );
}

function CreditCardIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h2" />
      <path d="M10 15h4" />
    </IconBase>
  );
}

function TrendingUp(props) {
  return (
    <IconBase {...props}>
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="15 7 21 7 21 13" />
    </IconBase>
  );
}

function CardInsights({ transactions, creditCards }) {
  const optimization = useMemo(() => {
    if (!transactions.length || !creditCards.length) {
      return null;
    }

    const categorySpending = transactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Other';
      const currentTotal = acc[category] || 0;
      return { ...acc, [category]: currentTotal + Math.abs(transaction.amount || 0) };
    }, {});

    const totalSpending = Object.values(categorySpending).reduce(
      (sum, value) => sum + value,
      0
    );

    const analyses = creditCards
      .map((card) => {
        const categories = card.categories || {};
        let cashbackEarned = 0;

        const categoryBreakdown = Object.entries(categorySpending)
          .map(([category, amount]) => {
            const rate = categories[category] ?? categories.Other ?? 0;
            const cashback = (amount * rate) / 100;
            cashbackEarned += cashback;

            return {
              category,
              spending: amount,
              rate,
              cashback,
            };
          })
          .sort((a, b) => b.cashback - a.cashback);

        const bonusValue = Number(card.bonusValue) || 0;
        const annualFee = Number(card.annualFee) || 0;
        const totalValueBack = cashbackEarned + bonusValue - annualFee;
        const netValue = totalValueBack;
        const effectiveRate = totalSpending
          ? (totalValueBack / totalSpending) * 100
          : 0;

        return {
          card,
          cashbackEarned,
          totalValueBack,
          netValue,
          effectiveRate,
          categoryBreakdown,
        };
      })
      .sort((a, b) => b.netValue - a.netValue);

    return {
      cardAnalysis: analyses,
      totalSpending,
      categorySpending,
    };
  }, [transactions, creditCards]);

  if (!optimization) {
    return (
      <Card className="glass apple-shadow border-0 rounded-3xl">
        <CardContent className="py-14 text-center space-y-3">
          <h3 className="text-xl font-semibold text-slate-800">
            Ready to Optimize Your Rewards
          </h3>
          <p className="text-slate-600 max-w-lg mx-auto">
            Load the sample dataset from the <strong>Upload Data</strong> tab or upload your own
            CSV files to see personalized card recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  const bestCard = optimization.cardAnalysis[0];

  return (
    <div className="space-y-6">
      <Card className="glass apple-shadow-lg border-0 rounded-3xl overflow-hidden relative bg-gradient-to-br from-emerald-50/90 via-white/90 to-emerald-100/80">
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <div className="p-2 bg-green-500/10 rounded-xl">
                  <Trophy className="text-green-600" />
                </div>
                Best Card for Your Spending
              </CardTitle>
              <CardDescription className="text-slate-600">
                Maximizes your rewards based on spending patterns
              </CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 apple-shadow">
              Recommended
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-4">
            <div>
              <h3 className="text-slate-900 mb-2">{bestCard.card.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-slate-500">Total Value Back</p>
                  <p className="text-green-600">
                    ${bestCard.totalValueBack.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Annual Fee</p>
                  <p className="text-slate-900">${bestCard.card.annualFee}</p>
                </div>
                <div>
                  <p className="text-slate-500">Net Value</p>
                  <p className="text-green-600">${bestCard.netValue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-slate-500">Effective Rate</p>
                  <p className="text-green-600">
                    {bestCard.effectiveRate.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-slate-600 mb-2">Top Earning Categories</p>
              <div className="space-y-2">
                {bestCard.categoryBreakdown.slice(0, 3).map((item, index) => (
                  <div
                    key={`${item.category}-${index}`}
                    className="flex items-center justify-between text-slate-700"
                  >
                    <span>
                      {item.category} ({item.rate}% back)
                    </span>
                    <span className="text-green-600">
                      ${item.cashback.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass apple-shadow border-0 rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-slate-900">All Cards Comparison</CardTitle>
          <CardDescription className="text-slate-600">
            Ranked by total value back based on your spending
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {optimization.cardAnalysis.map((analysis, index) => (
              <div
                key={analysis.card.id}
                className="glass apple-shadow rounded-3xl p-6 hover-lift border-0"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-900">{analysis.card.name}</span>
                      {index === 0 && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                          Best
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-500">
                      Annual Fee: ${analysis.card.annualFee} | Signup Bonus: $
                      {analysis.card.bonusValue}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600">
                      ${analysis.netValue.toFixed(2)}
                    </p>
                    <p className="text-slate-500">net value</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-center">
                  <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200/60">
                    <div className="p-2 bg-blue-500/10 rounded-lg inline-block mb-1">
                      <DollarSign className="text-blue-600" />
                    </div>
                    <p className="text-slate-500">Cashback</p>
                    <p className="text-slate-900">
                      ${analysis.cashbackEarned.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200/60">
                    <div className="p-2 bg-purple-500/10 rounded-lg inline-block mb-1">
                      <TrendingUp className="text-purple-600" />
                    </div>
                    <p className="text-slate-500">Bonus Value</p>
                    <p className="text-slate-900">${analysis.card.bonusValue}</p>
                  </div>
                  <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/60">
                    <div className="p-2 bg-green-500/10 rounded-lg inline-block mb-1">
                      <CreditCardIcon className="text-green-600" />
                    </div>
                    <p className="text-slate-500">Effective Rate</p>
                    <p className="text-slate-900">
                      {analysis.effectiveRate.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-600 mb-2">Category Performance</p>
                  <div className="space-y-2">
                    {analysis.categoryBreakdown.slice(0, 5).map((item, idx) => {
                      const totalCashback = analysis.cashbackEarned || 1;
                      const progressValue = totalCashback
                        ? (item.cashback / totalCashback) * 100
                        : 0;

                      return (
                        <div key={`${analysis.card.id}-${item.category}-${idx}`}>
                          <div className="flex justify-between text-slate-700 mb-1">
                            <span>
                              {item.category} - {item.rate}% cashback
                            </span>
                            <span>${item.cashback.toFixed(2)}</span>
                          </div>
                          <Progress value={progressValue} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass apple-shadow border-0 rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-slate-900">Your Spending Overview</CardTitle>
          <CardDescription className="text-slate-600">
            Total spending by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(optimization.categorySpending)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-700">{category}</span>
                    <span className="text-slate-900">
                      ${amount.toFixed(2)} (
                      {optimization.totalSpending
                        ? ((amount / optimization.totalSpending) * 100).toFixed(1)
                        : '0.0'}
                      %)
                    </span>
                  </div>
                  <Progress
                    value={
                      optimization.totalSpending
                        ? (amount / optimization.totalSpending) * 100
                        : 0
                    }
                  />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CardOptimizer({
  transactions = [],
  creditCards = [],
}) {
  return (
    <div className="space-y-6">
      <CardInsights transactions={transactions} creditCards={creditCards} />
    </div>
  );
}
