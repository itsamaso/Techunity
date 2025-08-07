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
        Create a new account
      </h2>
      <p style={{ color: '#64748B', marginBottom: '3rem' }}>
        To use Techunity, Please enter your details
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignup)}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.25rem',
            width: '100%'
          }}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: '#1E293B', fontWeight: '500' }}>Name</FormLabel>
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel style={{ color: '#1E293B', fontWeight: '500' }}>Username</FormLabel>
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
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '1rem' }}>
            Already have an account?
            <Link
              to="/sign-in"
              style={{ color: '#8B9DC3', fontWeight: '600', marginLeft: '0.25rem' }}>
              Log in
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
