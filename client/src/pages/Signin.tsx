import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Mail, Lock, Loader2 } from "lucide-react";

export function Signin() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.password) {
        toast.error("Please fill all fields");
        setLoading(false);
        return;
      }

      // Mock signin - in production, call API
      const token = btoa(`${formData.email}:${formData.password}`);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_email", formData.email);
      localStorage.setItem("user_name", formData.email.split("@")[0]);

      toast.success("Welcome back! 🎉");
      setLocation("/");
    } catch (error) {
      toast.error("Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-purple-500/20 bg-slate-900/80 backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            SKYCOIN4444
          </div>
          <CardTitle className="text-xl text-white">Sign In</CardTitle>
          <p className="text-sm text-slate-400">Welcome back to the ecosystem</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
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

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setLocation("/signup")}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                Create one
              </button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-slate-700 space-y-2">
              <p className="text-xs font-semibold text-slate-300">🧪 Demo Credentials:</p>
              <div className="bg-slate-800 p-3 rounded text-xs text-slate-300 space-y-1">
                <div><span className="text-slate-500">Email:</span> demo@skycoin.com</div>
                <div><span className="text-slate-500">Password:</span> demo1234</div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signin;
