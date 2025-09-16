import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";

import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { SignupValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // Queries
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isLoading: isSigningInUser } = useSignInAccount();

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        toast({ 
          title: "Sign up failed. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ 
          title: "Something went wrong. Please login your new account",
          variant: "destructive"
        });
        navigate("/sign-in");
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        toast({ 
          title: "Account created successfully!",
          description: "Welcome to Techunity!"
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
      console.log("Signup error:", error);
      
      let errorMessage = "Sign up failed. Please try again.";
      let description = "Please check your details and try again.";
      
      if (error?.message) {
        if (error.message.includes("already exists")) {
          errorMessage = "Account already exists";
          description = "This email is already registered. Try signing in instead, or use a different email address.";
        } else if (error.message.includes("password")) {
          errorMessage = "Password issue";
          description = "Please use a stronger password (at least 8 characters).";
        } else if (error.message.includes("email")) {
          errorMessage = "Email issue";
          description = "Please use a valid email address.";
        } else if (error.message.includes("409")) {
          errorMessage = "Account conflict detected";
          description = "This email might have an orphaned account. Try signing in instead, or use a different email.";
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
        Create a new account
      </h2>
      <p className="text-light-3 mb-12">
        To use Techunity, Please enter your details
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-1 font-medium">Name</FormLabel>
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-1 font-medium">Username</FormLabel>
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
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className="flex items-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-light-3 text-sm mt-4">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 font-semibold ml-1 hover:text-primary-400 transition-colors duration-300">
              Log in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
