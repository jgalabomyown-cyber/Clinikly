-- Create a trigger that creates or updates a patients row when a new auth user is created
-- Run this in the Supabase SQL editor (requires service role / admin privileges)

-- Function to create or update a patient row from auth metadata for patient users only
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create/update a patients row for users with role = 'user'
  IF NEW.raw_user_meta_data->>'role' IS DISTINCT FROM 'user' THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.patients (
    id,
    first_name,
    last_name,
    phone,
    birth_date,
    email
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    (NEW.raw_user_meta_data->>'birth_date')::date,
    NEW.raw_user_meta_data->>'email'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    first_name = COALESCE(EXCLUDED.first_name, public.patients.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.patients.last_name),
    phone = COALESCE(EXCLUDED.phone, public.patients.phone),
    birth_date = COALESCE(EXCLUDED.birth_date, public.patients.birth_date),
    email = COALESCE(EXCLUDED.email, public.patients.email)

  RETURN NEW;
END;
$$;

-- Trigger on auth.users (fires after insert or update of auth user metadata)
DROP TRIGGER IF EXISTS create_patient_on_user_create ON auth.users;
CREATE TRIGGER create_patient_on_user_create
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.raw_user_meta_data->>'role' = 'user')
EXECUTE PROCEDURE public.handle_new_auth_user();
