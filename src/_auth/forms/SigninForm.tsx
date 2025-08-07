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
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '900',
          background: 'linear-gradient(135deg, #8B9DC3 0%, #E6B17A 50%, #8B9DC3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.75rem',
          textShadow: '0 4px 8px rgba(139, 157, 195, 0.3)',
          letterSpacing: '-0.02em',
          lineHeight: '1.1'
        }}>
          Techunity
        </h1>
        <p style={{ 
          fontSize: '1rem', 
          color: '#64748B',
          fontWeight: '600',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          opacity: '0.8'
        }}>
          Connect, Collaborate & Grow
        </p>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Log in to your account
      </h2>
      <p style={{ color: '#64748B', marginBottom: '2rem' }}>
        Welcome back! Please enter your details.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.25rem',
            width: '100%'
          }}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: '#1E293B', fontWeight: '500' }}>Email</FormLabel>
                <FormControl>
                  <Input type="text" style={{ 
                    height: '3rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #CBD5E1',
                    padding: '0.75rem',
                    width: '100%'
                  }} {...field} />
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
                <FormLabel style={{ color: '#1E293B', fontWeight: '500' }}>Password</FormLabel>
                <FormControl>
                  <Input type="password" style={{ 
                    height: '3rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #CBD5E1',
                    padding: '0.75rem',
                    width: '100%'
                  }} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" style={{ 
            height: '3rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(to right, #8B9DC3, #E6B17A)',
            color: 'white',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            {isLoading || isUserLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>

          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '1rem' }}>
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              style={{ color: '#8B9DC3', fontWeight: '600', marginLeft: '0.25rem' }}>
              Sign up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SigninForm;
