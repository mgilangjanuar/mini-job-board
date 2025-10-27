## Mini Job Board

This is a simple job board application built with Next.js and Supabase. It allows users to post and view job listings.

### Key Features

- [x] User Authentication
- [x] Job Posting & Management
- [x] Job Listing
- [x] Responsive Design
- [x] Search and Filter Jobs
- [x] Admin Dashboard
- [ ] Email Notifications
- [ ] Job Application Tracking

### Prerequisites

- [Bun](https://bun.com/) 1.3 or higher
- [Supabase Account](https://supabase.com/) and a project set up

### Get Started

1. Clone the repository:

   ```bash
   git clone git@github.com:mgilangjanuar/mini-job-board.git && \
   cd mini-job-board
   ```

2. Install dependencies using Bun:

   ```bash
   bun install
   ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
    ```

4. Run the development server:

    ```bash
    bun dev
    ```
