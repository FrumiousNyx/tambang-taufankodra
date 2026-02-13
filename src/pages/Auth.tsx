import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const AuthPage: React.FC = () => {
  const { t } = useLanguage();
  const { login, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await login(formData.email, formData.password);
      
      if (error) {
        toast.error(t('auth.loginFailed'));
      } else {
        toast.success(t('auth.loginSuccess'));
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (error) {
      toast.error(t('auth.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSO = async (provider: string) => {
    try {
      if (signInWithOAuth) {
        await signInWithOAuth(provider);
      } else {
        toast.error('OAuth not available');
      }
    } catch (e) {
      console.error('SSO Error:', e);
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="heading-hero text-primary-foreground mb-4">
              {t('auth.title')}
            </h1>
            <p className="text-primary-foreground/80">
              {t('auth.subtitle')}
            </p>
          </div>

          <Card className="border-slate-200 bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-black tracking-tight">
                {t('auth.signIn')}
              </CardTitle>
              <CardDescription>
                {t('auth.signInSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t('auth.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@semennusantara.co.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {t('auth.password')}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="bg-background pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full btn-accent" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    t('auth.processing')
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      {t('auth.signInButton')}
                    </>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {t('auth.security')}
                </p>
              </div>
            </CardContent>
          </Card>
            <div className="mt-4 space-y-2 text-center">
              <p className="text-sm text-muted-foreground">Or sign in with:</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleSSO('google')}
                  disabled={!signInWithOAuth}
                >
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleSSO('azure')}
                  disabled={!signInWithOAuth}
                >
                  Azure
                </Button>
              </div>
              {!signInWithOAuth && (
                <p className="text-xs text-orange-600 mt-2">
                  OAuth providers need to be configured in Supabase
                </p>
              )}
            </div>
          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              ← {t('auth.backToHome')}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AuthPage;