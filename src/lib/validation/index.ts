import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().max(2200, { message: "Maximum 2,200 characters" }).optional(),
  file: z.custom<File[]>().optional(),
  location: z.string().max(1000, { message: "Maximum 1000 characters." }).optional(),
  tags: z.string().optional(),
  imageUrl: z.string().optional(),
  imageId: z.string().optional(),
}).refine((data) => {
  // Ensure at least one of caption, file, or location has content
  const hasCaption = data.caption && data.caption.trim().length > 0;
  const hasFile = data.file && data.file.length > 0;
  const hasLocation = data.location && data.location.trim().length > 0;
  const hasImageUrl = data.imageUrl && data.imageUrl.trim().length > 0;
  
  return hasCaption || hasFile || hasLocation || hasImageUrl;
}, {
  message: "At least one of Caption, Photo, or Location must be provided",
  path: ["caption"] // This will show the error on the caption field
});
