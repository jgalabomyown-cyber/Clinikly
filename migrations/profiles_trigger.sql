-- Create a trigger that creates or updates a profiles row when a new auth user is created
-- Run this in the Supabase SQL editor (requires service role / admin privileges)

CREATE OR REPLACE FUNCTION public.handle_new_auth_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    role,
    full_name,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'role',
    trim(CONCAT(NEW.raw_user_meta_data->>'first_name', ' ', NEW.raw_user_meta_data->>'last_name')),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    role = EXCLUDED.role,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS create_profile_on_user_create ON auth.users;
CREATE TRIGGER create_profile_on_user_create
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_auth_profile();
