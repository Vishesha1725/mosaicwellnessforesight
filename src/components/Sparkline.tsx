import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: { date: string; value: number }[];
  color?: string;
  height?: number;
}

const Sparkline = ({ data, color = "hsl(var(--primary))", height = 32 }: SparklineProps) => {
  if (!data || data.length === 0) return null;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Sparkline;
