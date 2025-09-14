import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
  onDelete?: () => void;
  isDeleting?: boolean;
};

const PostForm = ({ post, action, onDelete, isDeleting }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: post ? [] : [],
      location: post ? post.location : "",
      tags: post ? (post.tags ? post.tags.join(",") : "") : "",
      imageUrl: post ? post.imageUrl : "",
      imageId: post ? post.imageId : "",
    },
  });

  // Query
  const { mutateAsync: createPost, isLoading: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isLoading: isLoadingUpdate } =
    useUpdatePost();

  // Check if requirements are met
  const caption = form.watch("caption");
  const file = form.watch("file");
  const location = form.watch("location");
  const imageUrl = form.watch("imageUrl");
  const hasRequirements = (caption && caption.trim().length > 0) || 
                         (file && file.length > 0) || 
                         (location && location.trim().length > 0) ||
                         (imageUrl && imageUrl.trim().length > 0);

  // State to track if user has attempted to submit
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Handler for removing photo
  const handleRemovePhoto = () => {
    console.log("Removing photo from post");
    console.log("Current form values before removal:", form.getValues());
    
    // Clear the file field when photo is removed
    form.setValue("file", []);
    // Also clear the imageUrl and imageId for update posts
    if (post && action === "Update") {
      form.setValue("imageUrl", "");
      form.setValue("imageId", "");
      console.log("Cleared imageUrl and imageId for update post");
    }
    
    console.log("Form values after removal:", form.getValues());
  };

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    console.log("Form submitted with values:", value);
    console.log("Action:", action);
    console.log("Post:", post);
    console.log("Has requirements:", hasRequirements);
    
    // Mark that user has attempted to submit
    setHasAttemptedSubmit(true);
    
    // Check if form is valid
    const isValid = await form.trigger();
    console.log("Form is valid:", isValid);
    
    if (!isValid) {
      console.log("Form validation failed");
      return;
    }
    
    // ACTION = UPDATE
    if (post && action === "Update") {
      try {
        console.log("Updating post with data:", {
          ...value,
          postId: post.$id,
          imageId: value.imageId || post.imageId,
          imageUrl: value.imageUrl || post.imageUrl,
        });
        
        const updatedPost = await updatePost({
          ...value,
          postId: post.$id,
          imageId: value.imageId || post.imageId,
          imageUrl: value.imageUrl || post.imageUrl,
        });

        console.log("Update result:", updatedPost);

        if (!updatedPost) {
          toast({
            title: `${action} post failed. Please try again.`,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Post updated successfully!",
          description: "Your changes have been saved.",
        });
        
        navigate(`/posts/${post.$id}`);
      } catch (error) {
        console.error("Update error:", error);
        toast({
          title: `${action} post failed. Please try again.`,
          variant: "destructive",
        });
      }
      return;
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    }
    navigate("/");
  };


  return (
    <div className="w-full max-w-7xl mx-auto h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full flex flex-col">
          

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
            
            {/* Left Column - Caption with Photo Upload */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-dark-1/80 to-dark-2/60 backdrop-blur-sm rounded-xl p-6 border border-light-4/10 shadow-xl h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <img 
                      src="/assets/icons/bookmark.svg" 
                      alt="Caption" 
                      width={12} 
                      height={12}
                      className="text-primary-500"
                    />
                  </div>
                  <FormLabel className="text-xl font-semibold text-light-1">
                    What's on your mind?
                  </FormLabel>
                </div>
                
                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            className="shad-textarea custom-scrollbar min-h-[200px] resize-none bg-dark-2/50 border-light-4/20 focus:border-primary-500/50 text-lg p-6"
                            placeholder="Share your thoughts, ideas, or experiences..."
                            {...field}
                          />
                          <div className="absolute bottom-3 right-3 text-sm text-light-4 bg-dark-1/80 px-3 py-1.5 rounded">
                            {field.value?.length || 0}/2200
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />

                {/* Photo Upload */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 bg-secondary-500/20 rounded-lg flex items-center justify-center">
                      <img 
                        src="/assets/icons/wallpaper.svg" 
                        alt="Photos" 
                        width={12} 
                        height={12}
                        className="text-secondary-500"
                      />
                    </div>
                    <FormLabel className="text-lg font-semibold text-light-1">
                      Add Photos
                    </FormLabel>
                  </div>
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUploader
                            fieldChange={field.onChange}
                            mediaUrl={form.watch("imageUrl") || post?.imageUrl || ""}
                            onRemovePhoto={handleRemovePhoto}
                          />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Details & Create Button */}
            <div className="space-y-6 flex flex-col">
              {/* Location and Tags */}
              <div className="bg-gradient-to-br from-dark-1/80 to-dark-2/60 backdrop-blur-sm rounded-xl p-6 border border-light-4/10 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      className="text-green-500"
                    >
                      <path 
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-light-1">Details</h2>
                </div>

                <div className="space-y-4">
                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-light-2 mb-2 block">
                          <div className="flex items-center gap-1">
                            <svg 
                              width="12" 
                              height="12" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              className="text-green-500"
                            >
                              <path 
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                                fill="currentColor"
                              />
                            </svg>
                            Location
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="text" 
                            className="shad-input bg-dark-2/50 border-light-4/20 focus:border-green-500/50 h-14 text-lg px-4" 
                            placeholder="Where are you?"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-light-2 mb-2 block">
                          <div className="flex items-center gap-1">
                            <img 
                              src="/assets/icons/code.svg" 
                              alt="Tags" 
                              width="12" 
                              height="12"
                              className="text-purple-500"
                            />
                            Tags
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Art, Expression, Learn"
                            type="text"
                            className="shad-input bg-dark-2/50 border-light-4/20 focus:border-purple-500/50 h-14 text-lg px-4"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-light-4 mt-1">
                          Separate with commas
                        </p>
                        <FormMessage className="shad-form_message" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Requirements Info - Only show when user tries to submit empty post */}
              {hasAttemptedSubmit && !hasRequirements && (
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-amber-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg 
                        width="8" 
                        height="8" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        className="text-amber-500"
                      >
                        <path 
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" 
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-light-1 mb-1 text-xs">Requirements</h3>
                      <p className="text-light-3 text-xs leading-relaxed">
                        Add at least one: caption, photo, or location to create a post.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Create/Update Post Button - Fixed position at bottom */}
              <div className="flex flex-col items-center mt-auto pt-16 space-y-4">
                <div className="relative group">
                  {/* Outer glow ring */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 rounded-lg blur-xl opacity-60 group-hover:opacity-90 group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
                  
                  {/* Middle glow layer */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-lg blur-lg opacity-75 group-hover:opacity-100 group-hover:blur-xl transition-all duration-300 animate-pulse"></div>
                  
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Main button container */}
                  <div className="relative bg-gradient-to-br from-dark-1 to-dark-2 border-2 border-primary-500/30 group-hover:border-primary-400/60 rounded-lg p-1 shadow-2xl group-hover:shadow-3xl transition-all duration-300 z-50">
                    <Button
                      type="submit"
                      className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 hover:from-blue-400 hover:via-purple-500 hover:to-pink-400 text-white font-bold rounded-md text-xl shadow-inner hover:shadow-2xl transform hover:scale-110 hover:rotate-1 transition-all duration-300 w-[120px] h-[120px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-white/20 hover:border-white/60 group-hover:shadow-inner group-hover:shadow-white/20"
                      disabled={isLoadingCreate || isLoadingUpdate}
                      onClick={(e) => {
                        console.log("Button clicked!");
                        console.log("Event:", e);
                        console.log("Button disabled:", isLoadingCreate || isLoadingUpdate);
                        console.log("Form values:", form.getValues());
                        console.log("Form errors:", form.formState.errors);
                        setHasAttemptedSubmit(true);
                      }}>
                      <div className="flex flex-col items-center justify-center gap-2 h-full">
                        {(isLoadingCreate || isLoadingUpdate) ? (
                          <div className="relative">
                            <Loader />
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                            <svg 
                              width="24" 
                              height="24" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              className="text-white relative z-10"
                            >
                              <path 
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" 
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        )}
                        <span className="font-bold text-2xl tracking-wide">
                          {action}
                        </span>
                      </div>
                    </Button>
                  </div>
                  
                  {/* Floating particles effect */}
                  <div className="absolute -top-3 -left-3 w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 shadow-lg"></div>
                  <div className="absolute -top-2 -right-4 w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full animate-bounce opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 shadow-lg" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute -bottom-3 -left-2 w-3 h-3 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full animate-bounce opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 shadow-lg" style={{animationDelay: '1s'}}></div>
                  <div className="absolute -bottom-2 -right-3 w-4 h-4 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full animate-bounce opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 shadow-lg" style={{animationDelay: '1.5s'}}></div>
                  
                  {/* Additional corner sparkles */}
                  <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-ping opacity-80 group-hover:opacity-100" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-ping opacity-80 group-hover:opacity-100" style={{animationDelay: '0.7s'}}></div>
                  <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-ping opacity-80 group-hover:opacity-100" style={{animationDelay: '1.2s'}}></div>
                  <div className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full animate-ping opacity-80 group-hover:opacity-100" style={{animationDelay: '1.7s'}}></div>
                  
                  {/* Rotating ring effect */}
                  <div className="absolute -inset-3 border-2 border-blue-400/30 rounded-lg animate-spin opacity-0 group-hover:opacity-60 transition-opacity duration-500" style={{animationDuration: '3s'}}></div>
                  <div className="absolute -inset-4 border border-purple-400/20 rounded-lg animate-spin opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{animationDuration: '4s', animationDirection: 'reverse'}}></div>
                </div>

                {/* Delete Button - Only show for Update action */}
                {action === "Update" && onDelete && (
                  <div className="relative group">
                    {/* Outer glow ring */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-red-400 to-red-600 rounded-lg blur-xl opacity-60 group-hover:opacity-90 group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
                    
                    {/* Middle glow layer */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-700 rounded-lg blur-lg opacity-75 group-hover:opacity-100 group-hover:blur-xl transition-all duration-300 animate-pulse"></div>
                    
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Main button container */}
                    <div className="relative bg-gradient-to-br from-dark-1 to-dark-2 border-2 border-red-500/30 group-hover:border-red-400/60 rounded-lg p-1 shadow-2xl group-hover:shadow-3xl transition-all duration-300 z-50">
                      <button
                        type="button"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="relative bg-gradient-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold rounded-md shadow-inner hover:shadow-2xl transform hover:scale-110 hover:rotate-1 transition-all duration-300 w-[80px] h-[80px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-white/20 hover:border-white/60 group-hover:shadow-inner group-hover:shadow-white/20"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 h-full">
                          {isDeleting ? (
                            <div className="relative">
                              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                              <img
                                src="/assets/icons/delete.svg"
                                alt="delete"
                                width={24}
                                height={24}
                                className="relative z-10 group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                    
                    {/* Floating particles effect */}
                    <div className="absolute -top-2 -left-2 w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full animate-bounce opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 shadow-lg"></div>
                    <div className="absolute -top-1 -right-3 w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-bounce opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 shadow-lg" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute -bottom-2 -left-1 w-2 h-2 bg-gradient-to-r from-red-400 to-red-500 rounded-full animate-bounce opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 shadow-lg" style={{animationDelay: '1s'}}></div>
                    <div className="absolute -bottom-1 -right-2 w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-bounce opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 shadow-lg" style={{animationDelay: '1.5s'}}></div>
                    
                    {/* Additional corner sparkles */}
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-ping opacity-80 group-hover:opacity-100" style={{animationDelay: '0.2s'}}></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-ping opacity-80 group-hover:opacity-100" style={{animationDelay: '0.7s'}}></div>
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-ping opacity-80 group-hover:opacity-100" style={{animationDelay: '1.2s'}}></div>
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full animate-ping opacity-80 group-hover:opacity-100" style={{animationDelay: '1.7s'}}></div>
                    
                    {/* Rotating ring effect */}
                    <div className="absolute -inset-2 border-2 border-red-400/30 rounded-lg animate-spin opacity-0 group-hover:opacity-60 transition-opacity duration-500" style={{animationDuration: '3s'}}></div>
                    <div className="absolute -inset-3 border border-red-500/20 rounded-lg animate-spin opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{animationDuration: '4s', animationDirection: 'reverse'}}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PostForm;


