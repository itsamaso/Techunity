<h1 align="center"> Techunity </h1>

<br>

<h2 align="left">Introduction</h2>


<br>

In today’s digital world, communities thrive where connection and learning come
together.

**Techunity** was born from this vision: a platform where technology
enthusiasts, developers, and learners can not only interact socially but also grow
their technical skills in meaningful ways. Built with modern web technologies — **React 18, TypeScript, and Appwrite’s**
Backend-as-a-Service. The platform unites the strengths of a social media network with an educational coding hub.

  - **Objective:** It empowers coders to connect, collaborate, and grow by sharing posts,
    completing challenges, showcasing code, and contributing to
    developer-centric conversations.

    > **Technology Stack:** React, TypeScript, Tailwind CSS & Appwrite (BaaS).


<h2 align="left">Core Features</h2>


<br>

- **Authentication & Profiles.**
- **Post System.**
- **Following System.**
- **Chat System.**
- **Achievement-based Coding-Challenges System.**




<h2 align="left">Prerequisites</h2>


<br>

- Node.js

<h2 align="left">How To Run</h2>


<br>

Follow these steps to set up and run the Techunity application:

- **Clone repository:**
  
  ```
  git clone https://github.com/itsamaso/Techunity
  cd Techunity

- **Install Dependencies:**

  ```
  npm install

- **Environment Configuration:**
  
  Create a .env file in the root directory by copying the template.
  
  ```
  # Appwrite Configuration
  VITE_APPWRITE_URL=https://fra.cloud.appwrite.io/v1
  VITE_APPWRITE_PROJECT_ID=your_project_id_here
  VITE_APPWRITE_DATABASE_ID=your_database_id_here
  VITE_APPWRITE_STORAGE_ID=your_storage_id_here
  
  # Collection IDs (get these from your Appwrite console)
  VITE_APPWRITE_USER_COLLECTION_ID=your_user_collection_id
  VITE_APPWRITE_POST_COLLECTION_ID=your_post_collection_id
  VITE_APPWRITE_SAVES_COLLECTION_ID=your_saves_collection_id
  VITE_APPWRITE_FOLLOWS_COLLECTION_ID=your_follows_collection_id
  VITE_APPWRITE_CHATS_COLLECTION_ID=chats
  VITE_APPWRITE_MESSAGES_COLLECTION_ID=messages
  VITE_APPWRITE_COMMENTS_COLLECTION_ID=comments
  
  # Optional: Coding Challenges Collections
  VITE_APPWRITE_CHALLENGES_COLLECTION_ID=your_challenges_collection_id
  VITE_APPWRITE_CHALLENGE_ATTEMPTS_COLLECTION_ID=your_challenge_attempts_collection_id
  VITE_APPWRITE_USER_PROGRESS_COLLECTION_ID=your_user_progress_collection_id
  VITE_APPWRITE_ACHIEVEMENTS_COLLECTION_ID=your_achievements_collection_id

- **Run Development Server:**

  ```
  npm run dev
