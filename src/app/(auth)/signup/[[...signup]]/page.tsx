'use client'

import { useSignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const { signUp, isLoaded } = useSignUp();
  const [error, setError] = useState("");

  const handleGoogleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      setError(err.errors[0].message);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-[400px]"
        >
          <Link
            href="/"
            className="mb-8 flex items-center text-secondary-foreground hover:text-primary transition-colors text-base"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to home
          </Link>

          <div className="space-y-12 bg-background/50 p-10 rounded-2xl border-2 border-border/80 backdrop-blur-sm shadow-xl">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full py-2 px-4 text-base font-medium text-presentive">
                <Sparkles size={18} className="text-presentive" />
                <span>Get started</span>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-[28px] font-bold tracking-tight">
                  Create stunning presentations with AI
                </h1>
                <p className="text-base text-secondary-foreground/80">
                  Join thousands of professionals using Presentive
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                onClick={handleGoogleSignUp}
                className="w-full h-11 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>

            <div className="text-center">
              <Link
                href="/signin"
                className="text-base text-secondary-foreground hover:text-primary transition-colors"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}