-- Create doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  medical_license_number text,
  specialty text,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz DEFAULT now()
);
