-- Enable Row Level Security on profiles and allow users to manage their own profile row

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: allow authenticated users to select/insert/update/delete only their own profile row
CREATE POLICY "Profiles: allow users to manage own row" ON public.profiles
FOR ALL
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- Note: service_role key bypasses RLS; use server-side functions for admin tasks.
