import { ActivityChartData } from '@bregenz-bewegt/client/types';
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

export interface ChartProps {
  chartData: ActivityChartData;
  chartFilterMonth: number;
}

type CalculateTicksProps = {
  min: number;
  max: number;
  count: number;
  round: number;
  includeMin: boolean;
};

export const Chart: React.FC<ChartProps> = ({
  chartData,
  chartFilterMonth,
}) => {
  const calculateTicks = ({
    min,
    max,
    count,
    round,
    includeMin,
  }: CalculateTicksProps): number[] => {
    const interval =
      Math.round(((max - min + 1) / count + Number.EPSILON) / round) * round;
    return [...Array(count)].map((_x, i) => {
      const y = includeMin ? i : i + 1;
      if (y === 0) return min;
      return i === count - 1 ? max : min + y * interval - 1;
    });
  };

  return (
    <ResponsiveContainer width={'100%'} height={200}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 20, left: -25, bottom: 0 }}
      >
        <defs>
          <linearGradient id="color-coins" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--ion-color-secondary)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--ion-color-secondary)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          unit={'.'}
          type="number"
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          interval="preserveStartEnd"
          ticks={calculateTicks({
            min: 1,
            max: new Date(
              new Date().getFullYear(),
              chartFilterMonth + 1,
              0
            ).getDate(),
            count: 7,
            round: 5,
            includeMin: true,
          })}
        />
        <YAxis
          dataKey="coins"
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          interval="preserveStartEnd"
          ticks={calculateTicks({
            min: 1,
            max: chartData?.reduce((r, d) => (d.coins > r ? d.coins : r), 0),
            count: 4,
            round: 10,
            includeMin: false,
          })}
        />
        <Area
          type="monotoneX"
          dataKey="coins"
          fill="url(#color-coins)"
          stroke="var(--ion-color-primary)"
          fillOpacity={1}
        />
        <ReferenceLine
          label={{
            value: '∅',
            position: 'right',
          }}
          y={Math.floor(
            chartData?.reduce((r, d) => r + d.coins, 0) / chartData?.length
          )}
          stroke="black"
          opacity={0.5}
          fillOpacity={1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
