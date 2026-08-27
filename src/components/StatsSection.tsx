const stats = [
  { value: "98.5%", label: "Classification Accuracy" },
  { value: "50+", label: "Weed Species" },
  { value: "<2s", label: "Processing Time" },
  { value: "10K+", label: "Images Processed" },
];

const StatsSection = () => (
  <section className="py-16 bg-forest">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-heading text-3xl md:text-4xl font-bold text-sunshine">{s.value}</p>
            <p className="text-sm text-primary-foreground/70 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
