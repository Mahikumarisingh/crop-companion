import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, Wrench, Scissors } from "lucide-react";

type Category = "frontend" | "backend" | "tools";

interface Technology {
  name: string;
  percentage: number;
}

const technologies: Record<Category, Technology[]> = {
  frontend: [
    { name: "React", percentage: 95 },
    { name: "TypeScript", percentage: 90 },
    { name: "Tailwind CSS", percentage: 95 },
    { name: "Vite", percentage: 90 },
  ],
  backend: [
    { name: "Node.js", percentage: 90 },
    { name: "Express", percentage: 85 },
    { name: "Python", percentage: 75 },
    { name: "PostgreSQL", percentage: 85 },
    { name: "Supabase", percentage: 80 },
    { name: "MongoDB", percentage: 85 },
  ],
  tools: [
    { name: "Git", percentage: 90 },
    { name: "AWS", percentage: 65 },
    { name: "Figma", percentage: 80 },
    { name: "REST APIs", percentage: 95 },
  ],
};

const categoryIcons = {
  frontend: Settings2,
  backend: Wrench,
  tools: Scissors,
};

const categoryLabels = {
  frontend: "Frontend",
  backend: "Backend",
  tools: "Tools & Others",
};

const TechnologiesSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("frontend");

  return (
    <section className="py-20 px-4 bg-tech-dark relative overflow-hidden">
      {/* Animated network background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="techGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--tech-accent))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Network nodes */}
          {[...Array(12)].map((_, i) => (
            <g key={i}>
              <circle
                cx={`${10 + (i % 4) * 30}%`}
                cy={`${15 + Math.floor(i / 4) * 35}%`}
                r="4"
                fill="hsl(var(--tech-accent))"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
              {i < 8 && (
                <line
                  x1={`${10 + (i % 4) * 30}%`}
                  y1={`${15 + Math.floor(i / 4) * 35}%`}
                  x2={`${10 + ((i + 1) % 4) * 30}%`}
                  y2={`${15 + Math.floor((i + 1) / 4) * 35}%`}
                  stroke="hsl(var(--tech-accent))"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-tech-foreground mb-4">
            Powered By <span className="text-tech-accent">Modern Tech</span>
          </h2>
          <p className="text-tech-muted max-w-xl mx-auto">
            Built with cutting-edge technologies to deliver intelligent crop recommendations
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 md:gap-4 mb-12">
          {(Object.keys(technologies) as Category[]).map((category) => {
            const Icon = categoryIcons[category];
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  flex items-center gap-2 px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${isActive 
                    ? "bg-tech-accent text-tech-dark shadow-tech-glow" 
                    : "bg-tech-card text-tech-muted hover:bg-tech-card-hover border border-tech-border"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{categoryLabels[category]}</span>
              </button>
            );
          })}
        </div>

        {/* Technology List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {technologies[activeCategory].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-tech-foreground font-medium text-lg">{tech.name}</span>
                  <span className="text-tech-muted">{tech.percentage}%</span>
                </div>
                <div className="h-2 bg-tech-card rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tech.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-tech-accent to-tech-accent-light rounded-full relative"
                  >
                    {/* Glow effect on the end */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-tech-accent rounded-full shadow-tech-node" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TechnologiesSection;
