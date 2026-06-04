-- Enable Row Level Security on doctors and allow users to manage their own doctor row
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors: allow users to manage own row" ON public.doctors
FOR ALL
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );
    