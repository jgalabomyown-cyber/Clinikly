-- Create a trigger that creates a patients row when a new auth user is created
-- Run this in the Supabase SQL editor (requires service role / admin privileges)

-- Function to create patient row
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert a patients row for the new user id if it doesn't already exist
  INSERT INTO public.patients (id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger on auth.users (fires after a new user is created)
CREATE TRIGGER create_patient_on_user_create
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_auth_user();
