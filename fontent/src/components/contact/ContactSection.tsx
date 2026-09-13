import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, ArrowUpRight, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Container } from '../ui/Container';
import { ContactService } from '../../services/contact.service';
import { useToast } from '../../context/ToastContext';
import { SuccessCanvasEffect } from './SuccessCanvasEffect';

const projectTypes = [
  'SaaS',
  'Web Application',
  'E-commerce',
  'Business Website',
  'Dashboard',
  'API / Backend',
  'Existing Product Improvement',
  'Other',
];

const budgetRanges = [
  '$5k — $10k',
  '$10k — $25k',
  '$25k — $50k',
  '$50k+',
  'Undetermined / Exploring',
];

export function ContactSection() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Web Application',
    budgetRange: '$10k — $25k',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Incremented ONLY after a server-confirmed success to fire the celebration burst.
  const [successNonce, setSuccessNonce] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Client validation
    if (formData.name.trim().length < 2) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (formData.message.trim().length < 10) {
      setErrorMessage('Please include a brief message (minimum 10 characters) explaining your product goals.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await ContactService.submitContact(formData);
      if (response.success) {
        setIsSuccess(true);
        setSuccessNonce((n) => n + 1);
        showToast(response.message || 'Inquiry submitted successfully!', 'success');
      } else {
        setErrorMessage(response.message || 'Failed to submit inquiry. Please try again.');
        showToast(response.message || 'Failed to submit inquiry', 'error');
      }
    } catch (err) {
      setErrorMessage('A network error occurred. Please reach out directly at siamtazbidul4@gmail.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#050505] border-t border-[#1C1C1C]">
      <SuccessCanvasEffect trigger={successNonce} />
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Contact Info & Availability */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <Badge variant="gold" dot className="mb-4">
                INITIATE ENGAGEMENT
              </Badge>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase leading-[1.12] mb-6">
                HAVE A PRODUCT IN MIND? <br />
                <span className="text-[#C9A769]">LET'S TALK.</span>
              </h2>

              <p className="text-base text-[#969691] leading-relaxed mb-8">
                Let’s turn your vision into a digital product people actually want to use. I review every proposal personally within 24 hours.
              </p>

              {/* Direct Info List */}
              <div className="space-y-4 pt-4 border-t border-[#1C1C1C]">
                <div className="flex items-center gap-3.5 text-sm text-[#CCCCCC]">
                  <div className="w-8 h-8 rounded-sm bg-[#121212] border border-[#222222] flex items-center justify-center text-[#C9A769] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-[#666662] uppercase">Direct Email</div>
                    <a href="mailto:siamtazbidul4@gmail.com" className="hover:text-[#FFFFFF] transition-colors font-medium">
                      siamtazbidul4@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-sm text-[#CCCCCC]">
                  <div className="w-8 h-8 rounded-sm bg-[#121212] border border-[#222222] flex items-center justify-center text-[#C9A769] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-[#666662] uppercase">Typical Response Window</div>
                    <span className="font-medium text-[#F5F5F2]">Under 24 Hours</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-sm text-[#CCCCCC]">
                  <div className="w-8 h-8 rounded-sm bg-[#121212] border border-[#222222] flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-[#666662] uppercase">Current Engagement Status</div>
                    <span className="text-emerald-400 font-medium">Accepting Q3 / Q4 Contracts</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block pt-8 border-t border-[#181818] text-xs font-mono text-[#666662]">
              Inquiries dispatched securely via HTTPS REST Gateway to private inbox.
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-[#0C0C0C] border border-[#242424] rounded-sm">
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-emerald-950/40 border border-emerald-800/60 rounded-full flex items-center justify-center text-emerald-400 mb-6 animate-in zoom-in-50 duration-300">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#F5F5F2] font-['Space_Grotesk',sans-serif] uppercase mb-3">
                    Message Received.
                  </h3>
                  <p className="text-base text-[#969691] max-w-md leading-relaxed mb-8">
                    Thanks for reaching out. Your project inquiry has been securely stored and dispatched. I'll review your requirements and get back to you as soon as possible.
                  </p>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: '',
                        email: '',
                        company: '',
                        projectType: 'Web Application',
                        budgetRange: '$10k — $25k',
                        message: '',
                      });
                    }}
                  >
                    SEND ANOTHER INQUIRY
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-sm flex items-start gap-3 text-sm text-rose-200">
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-[#A0A09B] mb-2">
                        Your Name <span className="text-[#C9A769]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="e.g. Elena Rostova"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#121212] border border-[#222222] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] placeholder-[#555550] text-sm rounded-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-[#A0A09B] mb-2">
                        Email Address <span className="text-[#C9A769]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="e.g. elena@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[#121212] border border-[#222222] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] placeholder-[#555550] text-sm rounded-sm transition-colors"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="contact-company" className="block text-xs font-mono uppercase tracking-wider text-[#A0A09B] mb-2">
                      Company / Organization <span className="text-[#666662]">(Optional)</span>
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      placeholder="e.g. Apex Horizon Capital"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-3 bg-[#121212] border border-[#222222] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] placeholder-[#555550] text-sm rounded-sm transition-colors"
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A09B] mb-2">
                      Project Category <span className="text-[#C9A769]">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {projectTypes.map((type) => {
                        const isSelected = formData.projectType === type;
                        return (
                          <button
                            type="button"
                            key={type}
                            onClick={() => setFormData({ ...formData, projectType: type })}
                            className={`px-3 py-2 text-xs font-mono text-center rounded-sm border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#C9A769] text-[#070707] font-semibold border-[#C9A769]'
                                : 'bg-[#121212] text-[#9E9E99] border-[#222222] hover:border-[#383838]'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label htmlFor="contact-budget" className="block text-xs font-mono uppercase tracking-wider text-[#A0A09B] mb-2">
                      Estimated Budget <span className="text-[#666662]">(Optional)</span>
                    </label>
                    <select
                      id="contact-budget"
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-4 py-3 bg-[#121212] border border-[#222222] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] text-sm rounded-sm transition-colors"
                    >
                      {budgetRanges.map((range) => (
                        <option key={range} value={range} className="bg-[#121212] text-[#F5F5F2]">
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-[#A0A09B] mb-2">
                      Project Overview & Scope <span className="text-[#C9A769]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      placeholder="Tell me about the problem you're solving, the desired timeline, and any key technical constraints..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-[#121212] border border-[#222222] focus:border-[#C9A769] focus:outline-none text-[#F5F5F2] placeholder-[#555550] text-sm rounded-sm transition-colors resize-y leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    id="contact-form-submit"
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full justify-center"
                    icon={<Send className="w-4 h-4" />}
                  >
                    SUBMIT PROJECT INQUIRY
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
