import { Activity } from '@bregenz-bewegt/client/types';
import React from 'react';
import { AxisOptions, Chart } from 'react-charts';

export interface LineChartProps {
  data: Activity[];
}

export const Line: React.FC<LineChartProps> = ({ data }: LineChartProps) => {
  const primaryAxis = React.useMemo<
    AxisOptions<typeof data[number]['data'][number]>
  >(
    () => ({
      getValue: (datum) => datum.primary as unknown as Date,
    }),
    []
  );

  const secondaryAxes = React.useMemo<AxisOptions<number>[]>(
    () => [
      {
        getValue: (data) => data,
      },
    ],
    []
  );

  return (
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
        tooltip: false,
      }}
    />
  );
};
