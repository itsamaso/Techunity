import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { SigninValidation } from "@/lib/validation";
import { useSignInAccount } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";


const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // Query
  const { mutateAsync: signInAccount, isLoading } = useSignInAccount();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });



  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    try {
      const session = await signInAccount(user);

      if (!session) {
        toast({ 
          title: "Login failed. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        toast({ 
          title: "Login successful!",
          description: "Welcome back to Techunity!"
        });
        navigate("/");
      } else {
        toast({ 
          title: "Login failed. Please try again.",
          variant: "destructive"
        });
        return;
      }
    } catch (error: any) {
      console.log("Signin error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      let description = "Please check your email and password.";
      
      if (error?.message) {
        if (error.message.includes("session is active")) {
          errorMessage = "Session conflict detected";
          description = "Please refresh the page and try again, or clear your browser cache.";
        } else if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          errorMessage = "Invalid credentials";
          description = "Please check your email and password.";
        } else if (error.message.includes("not found")) {
          errorMessage = "Account not found";
          description = "Please check your email or create a new account.";
        }
      }
      
      toast({ 
        title: errorMessage,
        description: description,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-6xl font-black mb-3 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight leading-tight">
          Techunity
        </h1>
        <p className="text-base font-semibold text-light-3 tracking-wider uppercase opacity-80">
          Connect, Collaborate & Grow
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-light-1">
        Log in to your account
      </h2>
      <p className="text-light-3 mb-8">
        Welcome back! Please enter your details.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-1 font-medium">Email</FormLabel>
                <FormControl>
                  <Input 
                    type="text" 
                    className="h-12 rounded-xl border-2 border-light-4/30 bg-white/80 backdrop-blur-sm focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-1 font-medium">Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    className="h-12 rounded-xl border-2 border-light-4/30 bg-white/80 backdrop-blur-sm focus:border-primary-500/60 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="h-12 rounded-xl bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 hover:from-primary-400 hover:via-secondary-400 hover:to-accent-400 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            {isLoading || isUserLoading ? (
              <div className="flex items-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>

          <p className="text-light-3 text-sm mt-4">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 font-semibold ml-1 hover:text-primary-400 transition-colors duration-300">
              Sign up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SigninForm;
