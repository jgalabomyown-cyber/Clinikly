-- Enable Row Level Security on patients and allow users to manage their own row

-- Enable RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Policy: allow authenticated users to select/insert/update/delete only their own patient row
CREATE POLICY "Patients: allow users to manage own row" ON public.patients
FOR ALL
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- Note: service_role key bypasses RLS; use server-side functions for admin tasks.
