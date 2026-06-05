-- Trigger function to create/update doctors rows from auth.users metadata
DROP TRIGGER IF EXISTS create_doctor_on_user_create ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_doctor();

CREATE OR REPLACE FUNCTION public.handle_new_auth_doctor()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only create/update when role = 'doctor'
  IF NEW.raw_user_meta_data->>'role' IS DISTINCT FROM 'doctor' THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.doctors (
    id,
    medical_license_number,
    specialty,
    first_name,
    last_name,
    phone,
    email,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'medical_license_number',
    NEW.raw_user_meta_data->>'specialty',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'email';
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    medical_license_number = COALESCE(NULLIF(EXCLUDED.medical_license_number, ''), public.doctors.medical_license_number),
    specialty = COALESCE(NULLIF(EXCLUDED.specialty, ''), public.doctors.specialty),
    first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), public.doctors.first_name),
    last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), public.doctors.last_name),
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), public.doctors.phone);
    email = COALESCE(NULLIF(EXCLUDED.email, ''), public.doctors.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER create_doctor_on_user_create
AFTER INSERT OR UPDATE ON auth.users
FOR EACH ROW
WHEN (NEW.raw_user_meta_data->>'role' = 'doctor')
EXECUTE PROCEDURE public.handle_new_auth_doctor();
