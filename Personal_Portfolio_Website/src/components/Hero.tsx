"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Github, Linkedin, Mail } from "lucide-react";
import { useScrollAnimation, animations } from "@/hooks/useScrollAnimation";
import Image from "next/image";

const PHRASES = [
  "Hi, I'm Alif Fadillah Ummar",
  "Full Stack Web Developer", 
  "Problem Solver"
];

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation({ threshold: 0.2 });

  // Animation hooks
  const textAnimation = useScrollAnimation({ delay: 200 });
  const imageAnimation = useScrollAnimation({ delay: 400 });

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = PHRASES[loopNum % PHRASES.length];
      
      if (isDeleting) {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        setTypingSpeed(50);
      } else {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        setTypingSpeed(100);
      }

      if (!isDeleting && displayText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  return (
    <section 
      ref={heroRef}
      id="home" 
      className={`min-h-screen flex items-center justify-center pt-16 pb-8 sm:pb-12 lg:pb-16 bg-gradient-to-br from-background to-muted/20 ${animations.fadeInUp.transition} ${
        heroVisible ? animations.fadeInUp.animate : animations.fadeInUp.initial
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text Content */}
          <div 
            ref={textAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`flex-1 text-center lg:text-left max-w-2xl ${animations.fadeInLeft.transition} ${
              textAnimation.isVisible ? animations.fadeInLeft.animate : animations.fadeInLeft.initial
            }`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight min-h-[1.2em]">
              <span className="inline-block">
                {displayText === "Hi, I'm John Doe" ? (
                  <>
                    Hi, I&apos;m{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      John Doe
                    </span>
                  </>
                ) : displayText.startsWith("Hi") ? (
                  <span>
                    {displayText.replace("Hi, I'm", "Hi, I'm")}
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {displayText}
                  </span>
                )}
                <span className="animate-pulse text-primary ml-1">|</span>
              </span>
            </h1>
            {/* <h2 className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-6 font-medium">
              Full Stack Web Developer
            </h2> */}
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Passionate about creating beautiful, functional, and user-friendly 
              websites and applications. I specialize in modern web technologies 
              and love bringing ideas to life through code.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button size="lg" className="text-base px-8 cursor-pointer">
                <Mail className="mr-2 h-4 w-4" />
                Get In Touch
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start">
              <Button variant="ghost" size="icon" className="h-12 w-12 cursor-pointer">
                <Github className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="h-12 w-12 cursor-pointer">
                <Linkedin className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="h-12 w-12 cursor-pointer">
                <Mail className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div 
            ref={imageAnimation.ref as React.RefObject<HTMLDivElement>}
            className={`flex-shrink-0 ${animations.fadeInRight.transition} ${
              imageAnimation.isVisible ? animations.fadeInRight.animate : animations.fadeInRight.initial
            }`}
          >
            <div className="relative">
              <div className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[400px] lg:h-[400px] rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-4 border-primary/20 overflow-hidden">
                <div className="w-72 h-72 sm:w-88 sm:h-88 lg:w-[360px] lg:h-[360px] rounded-full overflow-hidden relative">
                  <Image
                    src="/images/1744690434658.jpeg"
                    alt="John Doe - Professional Photo"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 640px) 288px, (max-width: 1024px) 352px, 360px"
                  />
                  {/* Overlay untuk memberikan efek professional */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 mix-blend-overlay"></div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground text-2xl">👋</span>
              </div>
              {/* Status indicator */}
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Available for work
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
