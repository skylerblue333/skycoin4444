import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Mail, Lock, User, Loader2, Eye, EyeOff, AlertCircle, CheckCircle2, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SignUp() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'method' | 'credentials' | 'profile' | 'verify'>('method');
  const [signUpMethod, setSignUpMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    agreePrivacy: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 5) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const handleNextStep = () => {
    if (step === 'method') {
      setStep('credentials');
    } else if (step === 'credentials') {
      if (!formData.email || !formData.password) {
        toast.error("Please fill all fields");
        return;
      }
      if (formData.password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (!formData.acceptTerms) {
        toast.error("Please accept terms and conditions");
        return;
      }
      setStep('profile');
    } else if (step === 'profile') {
      if (!formData.firstName || !formData.lastName) {
        toast.error("Please enter your name");
        return;
      }
      setStep('verify');
    }
  };

  const handlePrevStep = () => {
    if (step === 'credentials') setStep('method');
    else if (step === 'profile') setStep('credentials');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = btoa(`${formData.email}:${formData.password}`);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_email", formData.email);
      localStorage.setItem("user_name", `${formData.firstName} ${formData.lastName}`);

      toast.success("Account created! Welcome to SKYCOIN4444 🚀");
      setLocation("/");
    } catch (error) {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = (provider: string) => {
    toast.info(`Sign up with ${provider} coming soon!`);
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-purple-500/20 bg-slate-900/80 backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            SKYCOIN4444
          </div>
          <CardTitle className="text-xl text-white">Create Account</CardTitle>
          <p className="text-sm text-slate-400">Join the ecosystem and start earning</p>
        </CardHeader>

        <CardContent>
          {/* Step Indicator */}
          <div className="flex gap-2 mb-6">
            {(['method', 'credentials', 'profile', 'verify'] as const).map((s, idx) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : ['method', 'credentials', 'profile', 'verify'].indexOf(step) > idx
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-700 text-gray-400'
                  }`}
                >
                  {['method', 'credentials', 'profile', 'verify'].indexOf(step) > idx ? '✓' : idx + 1}
                </div>
                {idx < 3 && <div className="flex-1 h-1 mx-2 bg-slate-700" />}
              </div>
            ))}
          </div>

          {/* Method Selection */}
          {step === 'method' && (
            <div className="space-y-4">
              <p className="text-slate-300 text-center mb-4">How would you like to sign up?</p>
              <Button
                onClick={() => { setSignUpMethod('email'); handleNextStep(); }}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white h-12 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Continue with Email
              </Button>
              <Button
                onClick={() => { setSignUpMethod('phone'); handleNextStep(); }}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white h-12 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Continue with Phone
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-900 text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['Google', 'Facebook', 'Apple'].map(provider => (
                  <Button
                    key={provider}
                    onClick={() => handleSocialSignUp(provider)}
                    variant="outline"
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    {provider}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Credentials Step */}
          {step === 'credentials' && (
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all`}
                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{passwordStrength.label}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer">
                  I agree to the <a href="#" className="text-blue-400 hover:underline">Terms</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                </label>
              </div>
            </form>
          )}

          {/* Profile Step */}
          {step === 'profile' && (
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Phone (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    disabled={loading}
                  />
                </div>
              </div>
            </form>
          )}

          {/* Verify Step */}
          {step === 'verify' && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white">Almost there!</h3>
              <p className="text-gray-400">
                We've sent a verification email to <span className="font-semibold text-white">{formData.email}</span>
              </p>
              <p className="text-sm text-gray-500">
                Click the link in the email to verify your account
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            {step !== 'method' && (
              <Button
                onClick={handlePrevStep}
                variant="outline"
                className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
              >
                Back
              </Button>
            )}
            {step !== 'verify' && (
              <Button
                onClick={step === 'profile' ? handleSubmit : handleNextStep}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {step === 'profile' ? 'Creating...' : 'Next'}
                  </>
                ) : step === 'profile' ? 'Create Account' : 'Next'}
              </Button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700 space-y-2">
            <p className="text-xs font-semibold text-slate-300">✨ Get Started With:</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="p-2 bg-slate-800 rounded">
                <div className="font-bold text-purple-400">1,000</div>
                <div className="text-slate-500">SKY4</div>
              </div>
              <div className="p-2 bg-slate-800 rounded">
                <div className="font-bold text-yellow-400">500</div>
                <div className="text-slate-500">DOGE</div>
              </div>
              <div className="p-2 bg-slate-800 rounded">
                <div className="font-bold text-red-400">100</div>
                <div className="text-slate-500">TRUMP</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUp;
