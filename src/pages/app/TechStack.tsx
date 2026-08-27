import { Glass, PageHeader } from "@/components/Glass";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu, Cloud, Brain, Camera, Zap, Globe2, Database, Code2 } from "lucide-react";

const stack = [
  { name: "Python", desc: "Backend ML pipelines, training & inference", icon: Code2, color: "text-yellow-500" },
  { name: "OpenCV", desc: "Image preprocessing & augmentation", icon: Camera, color: "text-blue-500" },
  { name: "YOLOv8", desc: "Real-time object detection (bounding boxes)", icon: Brain, color: "text-primary" },
  { name: "TensorFlow", desc: "MobileNetV2 transfer-learning classifier", icon: Brain, color: "text-orange-500" },
  { name: "ESP32", desc: "IoT smart sprayer microcontroller", icon: Cpu, color: "text-secondary" },
  { name: "Firebase", desc: "Auth & realtime cloud database", icon: Cloud, color: "text-amber-500" },
  { name: "React", desc: "Modern responsive frontend", icon: Code2, color: "text-cyan-500" },
  { name: "Node.js", desc: "API gateway & MQTT bridge", icon: Globe2, color: "text-green-500" },
  { name: "PostgreSQL", desc: "Detection history & analytics store", icon: Database, color: "text-blue-600" },
  { name: "MQTT", desc: "Low-latency IoT messaging", icon: Zap, color: "text-fuchsia-500" },
];

const TechStack = () => (
  <>
    <PageHeader title="Technical Stack" subtitle="The technologies powering WeedVision AI" />
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stack.map((s) => (
        <Glass key={s.name} className="p-5 hover:scale-[1.02] transition-transform">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <h3 className="font-heading font-semibold">{s.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
            </div>
          </div>
        </Glass>
      ))}
    </div>

    <Card className="mt-6 bg-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle>System Architecture</CardTitle>
        <CardDescription>End-to-end data flow from field to dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <pre className="text-xs md:text-sm overflow-x-auto p-4 rounded-lg bg-muted/40 border font-mono leading-relaxed">{`
 [ Drone / Phone Camera ]                     [ ESP32 Smart Sprayer ]
          |                                            |
          |  RTSP / HTTPS upload                       |  MQTT (TLS)
          v                                            v
   +----------------+         +-----------------+         +-------------+
   | OpenCV preproc | ----->  | YOLOv8 + CNN    | ----->  | Node.js API |
   +----------------+         |   inference     |         +-------------+
                              +-----------------+               |
                                       |                        v
                                       v                +----------------+
                              +-----------------+       | PostgreSQL DB  |
                              | Recommendation  |       +----------------+
                              |   engine        |               |
                              +-----------------+               v
                                       |                +----------------+
                                       +--------------> | React Dashboard|
                                                        +----------------+
`}</pre>
      </CardContent>
    </Card>
  </>
);

export default TechStack;
