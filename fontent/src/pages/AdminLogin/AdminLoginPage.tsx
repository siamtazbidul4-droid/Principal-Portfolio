import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        showToast('Authenticated successfully as Administrator', 'success');
        navigate('/admin');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] flex flex-col justify-center items-center px-6 py-12 relative">
      {/* Back to public site button */}
      <div className="absolute top-8 left-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#969691] hover:text-[#C9A769] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Portfolio</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#121212] border border-[#262626] rounded-sm flex items-center justify-center text-[#C9A769] mx-auto mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk',sans-serif] text-[#F5F5F2] uppercase tracking-tight">
            Consultancy Management Portal
          </h1>
          <p className="text-xs font-mono text-[#777772] mt-2 uppercase tracking-wider">
            Protected Administrator Access Only
          </p>
        </div>

        <div className="p-8 bg-[#0D0D0D] border border-[#242424] rounded-sm shadow-2xl">
          {error && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-sm flex items-start gap-3 text-xs text-rose-200 mb-6">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A09B] mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666662] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#121212] border border-[#222222] focus:border-[#C9A769] focus:outline-none text-sm text-[#F5F5F2] rounded-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A09B] mb-2">
                Master Security Key / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666662] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#121212] border border-[#222222] focus:border-[#C9A769] focus:outline-none text-sm text-[#F5F5F2] rounded-sm transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full justify-center mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              AUTHENTICATE SESSION
            </Button>
          </form>

          {/* Access notice */}
          <div className="mt-8 pt-6 border-t border-[#1C1C1C]">
            <div className="p-3.5 bg-[#121212] border border-[#202020] rounded-sm">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#C9A769] font-medium mb-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Restricted Access</span>
              </div>
              <div className="text-[11px] font-mono text-[#999994] space-y-0.5">
                <div>Contact the system owner for access.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
