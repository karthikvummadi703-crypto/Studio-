**
 * @fileOverview AccessibleChart — Recharts wrapper with full ARIA support.
 *
 * Usage:
 *   <AccessibleChart
 *     title="Carbon Footprint Over Time"
 *     description="Line chart showing monthly CO2 from Jan–Jun, down 23%."
 *   >
 *     <LineChart data={data}>...</LineChart>
 *   </AccessibleChart>
 */
'use client';

import { memo } from 'react';
import { ResponsiveContainer } from 'recharts';

interface AccessibleChartProps {
  title: string;
  description: string;
  height?: number;
  children: React.ReactNode;
}

export const AccessibleChart = memo(function AccessibleChart({
  title,
  description,
  height = 300,
  children,
}: AccessibleChartProps) {
  const descId = `chart-desc-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <figure
      role="img"
      aria-label={title}
      aria-describedby={descId}
      tabIndex={0}
      className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
    >
      <span id={descId} className="sr-only">{description}</span>
      <ResponsiveContainer width="100%" height={height}>
        {children as React.ReactElement}
      </ResponsiveContainer>
      <figcaption className="text-xs text-muted-foreground text-center mt-2">
        {title}
      </figcaption>
    </figure>
  );
});
