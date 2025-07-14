"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { useScrollAnimation, animations } from "@/hooks/useScrollAnimation";

export default function Projects() {
  // Animation hooks
  const headerAnimation = useScrollAnimation({ delay: 100 });
  const projectsAnimation = useScrollAnimation({ delay: 200 });
  const buttonAnimation = useScrollAnimation({ delay: 300 });
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-featured e-commerce platform built with Next.js, featuring user authentication, payment integration, and admin dashboard.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "MongoDB"],
      liveUrl: "#",
      githubUrl: "#",
      image: "🛒"
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, team collaboration features, and progress tracking.",
      technologies: ["React", "Node.js", "Socket.io", "PostgreSQL", "Express"],
      liveUrl: "#",
      githubUrl: "#",
      image: "📋"
    },
    {
      title: "Weather Dashboard",
      description: "A responsive weather dashboard that displays current weather conditions and forecasts for multiple cities worldwide.",
      technologies: ["Vue.js", "Weather API", "Chart.js", "CSS3", "JavaScript"],
      liveUrl: "#",
      githubUrl: "#",
      image: "🌤️"
    },
    {
      title: "Portfolio Website",
      description: "A modern, responsive portfolio website showcasing projects and skills with smooth animations and dark mode support.",
      technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
      liveUrl: "#",
      githubUrl: "#",
      image: "💼"
    },
    {
      title: "Blog Platform",
      description: "A feature-rich blog platform with content management system, SEO optimization, and social sharing capabilities.",
      technologies: ["Django", "Python", "PostgreSQL", "Bootstrap", "Redis"],
      liveUrl: "#",
      githubUrl: "#",
      image: "📝"
    },
    {
      title: "Real Estate App",
      description: "A comprehensive real estate application with property listings, advanced search filters, and interactive maps.",
      technologies: ["React Native", "Firebase", "Google Maps API", "Redux"],
      liveUrl: "#",
      githubUrl: "#",
      image: "🏠"
    }
  ];

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div 
            ref={headerAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`text-center mb-16 ${animations.fadeInDown.transition} ${
              headerAnimation.isVisible ? animations.fadeInDown.animate : animations.fadeInDown.initial
            }`}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and passion for web development
            </p>
          </div>

          {/* Projects Grid */}
          <div 
            ref={projectsAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${animations.fadeInUp.transition} ${
              projectsAnimation.isVisible ? animations.fadeInUp.animate : animations.fadeInUp.initial
            }`}
          >
            {projects.map((project, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden cursor-pointer">
                {/* Project Image/Icon */}
                <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
                  {project.image}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="default" size="sm" className="flex-1 cursor-pointer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 cursor-pointer">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View More Button */}
          <div 
            ref={buttonAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`text-center mt-12 ${animations.fadeIn.transition} ${
              buttonAnimation.isVisible ? animations.fadeIn.animate : animations.fadeIn.initial
            }`}
          >
            <Button variant="outline" size="lg" className="px-8 cursor-pointer">
              View All Projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
