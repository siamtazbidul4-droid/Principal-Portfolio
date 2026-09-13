import React, { useEffect, useState } from 'react';
import { Quote, Building2, User } from 'lucide-react';
import { ITestimonial } from '../../types';
import { TestimonialService } from '../../services/testimonial.service';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await TestimonialService.getPublicTestimonials();
        if (res.success && res.data) {
          setTestimonials(res.data);
        }
      } catch {
        // fail gracefully
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (!isLoading && testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-[#070707] border-t border-[#1C1C1C]">
      <Container>
        <SectionHeading
          eyebrow="CLIENT VOICES"
          title="COLLABORATION OUTCOMES"
          description="Direct feedback from engineering leaders, product executives, and venture founders."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t._id || t.id || idx}
              className="p-8 bg-[#0C0C0C] border border-[#222222] hover:border-[#383838] transition-colors rounded-sm flex flex-col justify-between"
            >
              <div>
                <Quote className="w-8 h-8 text-[#C9A769]/40 mb-6" />
                <p className="text-sm sm:text-base text-[#D4D4D0] leading-relaxed italic font-['Newsreader',serif] text-[17px]">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#1A1A1A] flex items-center gap-3.5">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#2E2E2E]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#969691]">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif]">
                    {t.name}
                  </h4>
                  <p className="text-xs text-[#80807B]">
                    {t.role} · <span className="text-[#A3A39E]">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
