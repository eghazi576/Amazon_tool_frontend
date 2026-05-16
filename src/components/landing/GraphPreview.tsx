const LineChart = () => {
  const path = "M10,70 L40,55 L70,60 L100,40 L130,45 L160,25 L190,30 L220,15";
  return (
    <svg viewBox="0 0 230 90" className="h-full w-full">
      <defs>
        <linearGradient id="lc" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(263 85% 65%)" />
          <stop offset="100%" stopColor="hsl(190 95% 55%)" />
        </linearGradient>
      </defs>
      {[20, 40, 60, 80].map((y) => (
        <line key={y} x1="10" y1={y} x2="220" y2={y} stroke="hsl(240 10% 16%)" strokeDasharray="2 4" />
      ))}
      <path d={path} fill="none" stroke="url(#lc)" strokeWidth="2.5" strokeLinecap="round" />
      {[
        [10, 70], [40, 55], [70, 60], [100, 40], [130, 45], [160, 25], [190, 30], [220, 15],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="hsl(263 85% 65%)" />
      ))}
    </svg>
  );
};

const BarChart = () => {
  const bars = [55, 75, 40, 85, 60, 70, 45];
  return (
    <svg viewBox="0 0 230 90" className="h-full w-full">
      <defs>
        <linearGradient id="bc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(263 85% 65%)" />
          <stop offset="100%" stopColor="hsl(217 91% 60%)" />
        </linearGradient>
      </defs>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={15 + i * 30}
          y={85 - h}
          width="18"
          height={h}
          rx="3"
          fill="url(#bc)"
          opacity={0.4 + (i / bars.length) * 0.6}
        />
      ))}
    </svg>
  );
};

const PieChart = () => {
  // Donut: 4 segments
  const segments = [
    { val: 40, color: "hsl(263 85% 65%)" },
    { val: 25, color: "hsl(190 95% 55%)" },
    { val: 20, color: "hsl(217 91% 60%)" },
    { val: 15, color: "hsl(280 90% 70%)" },
  ];
  const r = 32;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <g transform="rotate(-90 50 50)">
        {segments.map((s, i) => {
          const dash = (s.val / 100) * c;
          const offset = -acc;
          acc += dash;
          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </g>
      <text x="50" y="48" textAnchor="middle" className="fill-foreground font-display text-[10px] font-bold">40%</text>
      <text x="50" y="60" textAnchor="middle" className="fill-muted-foreground text-[5px]">Top Brand</text>
    </svg>
  );
};

const charts = [
  { title: "Price Trend", subtitle: "30-day analysis", Chart: LineChart, tag: "Line" },
  { title: "Reviews Comparison", subtitle: "Top 7 products", Chart: BarChart, tag: "Bar" },
  { title: "Market Share", subtitle: "Brand distribution", Chart: PieChart, tag: "Pie" },
];

const GraphPreview = () => {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-[120px]" />

      <div className="container mx-auto px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-accent">Visualization</span>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            Visualize Data <span className="gradient-text">Like a Pro</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Turn raw data into meaningful insights with powerful visualizations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {charts.map(({ title, subtitle, Chart, tag }) => (
            <div
              key={title}
              className="glass group relative overflow-hidden rounded-2xl p-6 transition-spring hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
                <span className="rounded-full bg-primary/20 px-2.5 py-1 text-[10px] font-semibold text-primary">{tag}</span>
              </div>
              <div className="h-40 w-full">
                <Chart />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GraphPreview;
