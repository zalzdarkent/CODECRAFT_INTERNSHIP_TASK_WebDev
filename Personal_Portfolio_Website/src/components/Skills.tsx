"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { useScrollAnimation, animations } from "@/hooks/useScrollAnimation";

export default function Skills() {
  // Animation hooks
  const headerAnimation = useScrollAnimation({ delay: 100 });
  const skillsAnimation = useScrollAnimation({ delay: 200 });
  
  // Hover state for tooltip
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Skill proficiency data (0-100%)
  const skillProficiency: { [key: string]: number } = {
    // Frontend
    "React": 95,
    "Next.js": 90,
    "TypeScript": 88,
    "JavaScript": 92,
    "HTML5": 98,
    "CSS3": 95,
    "Tailwind CSS": 93,
    "Bootstrap": 85,
    "SASS": 80,
    "Vue.js": 75,
    
    // Backend
    "Node.js": 88,
    "Express": 85,
    "Python": 82,
    "Django": 78,
    "PHP": 70,
    "Laravel": 68,
    "MySQL": 85,
    "PostgreSQL": 80,
    "MongoDB": 83,
    "REST APIs": 90,
    
    // Tools & Others
    "Git": 92,
    "GitHub": 90,
    "Docker": 75,
    "AWS": 72,
    "Vercel": 88,
    "Figma": 85,
    "VS Code": 95,
    "Linux": 78,
    "Agile": 83,
    "Testing": 80
  };

  // Custom hook untuk percentage counter animation
  const usePercentageCounter = (targetPercentage: number, isActive: boolean) => {
    useEffect(() => {
      if (!isActive) {
        setAnimatedPercentage(0);
        setAnimatedProgress(0);
        return;
      }

      let startTime: number;
      const duration = 1200; // 1.2 seconds

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function untuk smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeOutCubic * targetPercentage);
        
        setAnimatedPercentage(currentValue);
        setAnimatedProgress(easeOutCubic * targetPercentage);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [targetPercentage, isActive]);
  };

  // Get current skill percentage and animate it
  const currentSkillPercentage = hoveredSkill ? (skillProficiency[hoveredSkill] || 75) : 0;
  usePercentageCounter(currentSkillPercentage, !!hoveredSkill);

  const skills = {
    "Frontend": [
      "React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", 
      "Tailwind CSS", "Bootstrap", "SASS", "Vue.js"
    ],
    "Backend": [
      "Node.js", "Express", "Python", "Django", "PHP", "Laravel", 
      "MySQL", "PostgreSQL", "MongoDB", "REST APIs"
    ],
    "Tools & Others": [
      "Git", "GitHub", "Docker", "AWS", "Vercel", "Figma", 
      "VS Code", "Linux", "Agile", "Testing"
    ]
  };

  return (
    <section id="skills" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div 
            ref={headerAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`text-center mb-16 ${animations.fadeInUp.transition} ${
              headerAnimation.isVisible ? animations.fadeInUp.animate : animations.fadeInUp.initial
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Skills & Technologies
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>

          {/* Skills Grid */}
          <div 
            ref={skillsAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`grid md:grid-cols-3 gap-8 ${animations.scaleIn.transition} ${
              skillsAnimation.isVisible ? animations.scaleIn.animate : animations.scaleIn.initial
            }`}
          >
            {Object.entries(skills).map(([category, skillList]) => (
              <Card key={category} className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer">
                <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {skillList.map((skill) => (
                    <div 
                      key={skill}
                      className="relative group"
                      onMouseEnter={() => setHoveredSkill(skill)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <Badge 
                        variant="secondary" 
                        className="text-sm py-1 px-3 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                      >
                        {skill}
                      </Badge>
                      
                      {/* Tooltip with Progress Bar */}
                      {hoveredSkill === skill && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 animate-in fade-in-0 zoom-in-95 duration-200">
                          <div className="bg-background border border-border rounded-lg p-3 shadow-lg min-w-[160px]">
                            <div className="text-center mb-2">
                              <div className="text-sm font-medium text-foreground">{skill}</div>
                              <div className="text-lg font-bold text-primary">{animatedPercentage}%</div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-100 ease-out"
                                style={{ 
                                  width: `${animatedProgress}%`
                                }}
                              ></div>
                            </div>
                            
                            {/* Tooltip Arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
                              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-px"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
