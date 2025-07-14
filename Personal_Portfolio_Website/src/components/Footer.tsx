"use client";

import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { useScrollAnimation, animations } from "@/hooks/useScrollAnimation";

export default function Footer() {
  const footerAnimation = useScrollAnimation({ delay: 100 });

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div 
            ref={footerAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`py-12 ${animations.fadeInUp.transition} ${
              footerAnimation.isVisible ? animations.fadeInUp.animate : animations.fadeInUp.initial
            }`}
          >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Section */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-foreground mb-4">John Doe</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Passionate full-stack developer creating beautiful, functional, and 
                user-friendly web applications. Always learning and exploring new 
                technologies to deliver the best solutions.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground cursor-pointer">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground cursor-pointer">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary hover:text-primary-foreground cursor-pointer">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#skills" className="text-muted-foreground hover:text-primary transition-colors">
                    Skills
                  </a>
                </li>
                <li>
                  <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-muted-foreground">
                  john.doe@example.com
                </li>
                <li className="text-muted-foreground">
                  +1 (555) 123-4567
                </li>
                <li className="text-muted-foreground">
                  San Francisco, CA
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t py-6">
          <div className="flex flex-col sm:flex-row justify-center items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 John Doe. Made with{" "}
              <Heart className="inline h-4 w-4 text-red-500" />{" "}
              using Next.js & Tailwind CSS
            </p>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}
