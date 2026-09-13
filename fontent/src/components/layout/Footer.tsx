import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Github, Linkedin, Mail, Terminal, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer id="main-footer" className="bg-[#050505] border-t border-[#1C1C1C] pt-20 pb-12">
      <Container>
        {/* Pre-Footer Grand CTA Block */}
        <div
          id="footer-grand-cta"
          className="relative bg-[#0A0A0A] border border-[#242424] rounded-sm p-8 sm:p-12 lg:p-16 mb-20 overflow-hidden"
        >
          {/* Subtle warm champagne accent glow background */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C9A769]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <Badge variant="gold" dot className="mb-6">
              NEW PRODUCT INQUIRIES
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase leading-[1.1]">
              HAVE A PRODUCT IN MIND? <br />
              <span className="text-[#C9A769]">LET'S BUILD IT.</span>
            </h2>
            <p className="mt-5 text-base sm:text-lg text-[#969691] leading-relaxed max-w-2xl">
              I partner with ambitious founders, technology leaders, and product organizations to engineer scalable web platforms, distributed systems, and refined digital products.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/contact')}
                icon={<ArrowUpRight className="w-4 h-4" />}
              >
                START A PROJECT
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/work')}
              >
                EXPLORE CASE STUDIES
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-[#1A1A1A]">
          {/* Col 1: Bio */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#111111] border border-[#262626] rounded-sm flex items-center justify-center text-[#C9A769]">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <span className="font-['Space_Grotesk',sans-serif] font-bold text-[#F5F5F2] tracking-tight">
                TAZBIDUL SIAM
              </span>
            </div>
            <p className="text-sm text-[#969691] leading-relaxed max-w-sm">
              Principal Full-Stack Software Engineer & Digital Product Architect. Focused on high-performance web systems, resilient backend APIs, and editorial-grade user experiences.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/siamtazbidul4-droid/Principal-Portfolio"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-sm bg-[#111111] border border-[#222222] hover:border-[#C9A769] hover:text-[#FFFFFF] text-[#969691] flex items-center justify-center transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-sm bg-[#111111] border border-[#222222] hover:border-[#C9A769] hover:text-[#FFFFFF] text-[#969691] flex items-center justify-center transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:siamtazbidul4@gmail.com"
                className="w-9 h-9 rounded-sm bg-[#111111] border border-[#222222] hover:border-[#C9A769] hover:text-[#FFFFFF] text-[#969691] flex items-center justify-center transition-colors"
                aria-label="Send Direct Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#E2E2DE] mb-4">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#969691]">
              <li>
                <Link to="/work" className="hover:text-[#F5F5F2] transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#F5F5F2] transition-colors">
                  What I Build
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F5F5F2] transition-colors">
                  Engineering Ethos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F5F5F2] transition-colors">
                  Project Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Specifications */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#E2E2DE] mb-4">
              Architecture
            </h4>
            <div className="flex flex-col gap-2 text-xs text-[#969691] font-mono leading-relaxed">
              <span>Frontend: React 19 · TypeScript</span>
              <span>Backend: Node.js · Express REST</span>
              <span>Database: MongoDB & Local Cluster</span>
              <span>Email: Resend HTTPS Gateway</span>
              <span className="pt-2 text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Production-Ready Build
              </span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666662]">
          <p>© {new Date().getFullYear()} Tazbidul Siam. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#969691] transition-colors">
              Designed & Engineered with Intention
            </span>
            <Link
              to="/admin/login"
              className="flex items-center gap-1 hover:text-[#C9A769] transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Access</span>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
