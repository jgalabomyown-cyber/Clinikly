import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return NextResponse.json(
      {
        error: 'Missing required Supabase environment variables',
        missing: {
          NEXT_PUBLIC_SUPABASE_URL: !supabaseUrl,
          SUPABASE_SERVICE_ROLE_KEY: !serviceRoleKey,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: !anonKey,
        },
      },
      { status: 500 }
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
  });
  try {
    const body = await request.json();
    const medical_license_number = body?.medical_license_number?.toString().trim();
    const specialty = body?.specialty?.toString().trim();
    const password = body?.password?.toString();

    if (!medical_license_number || !specialty || !password) {
      return NextResponse.json(
        {
          error: 'Medical license number, specialty, and password are required',
        },
        { status: 400 }
      );
    }

    const { data: doctor, error: doctorError } = await supabaseAdmin
      .from('doctors')
      .select('id')
      .eq('medical_license_number', medical_license_number)
      .eq('specialty', specialty)
      .single();

    if (doctorError || !doctor?.id) {
      console.error('Doctor lookup error:', doctorError);
      return NextResponse.json(
        { error: 'Doctor not found with the provided license number and specialty' },
        { status: 401 }
      );
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(doctor.id);
    const email = userData?.user?.email;

    if (userError || !email) {
      console.error('User lookup error:', userError);
      return NextResponse.json(
        { error: 'Unable to resolve the doctor account email' },
        { status: 500 }
      );
    }

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !loginData?.session) {
      console.error('Login error:', loginError);
      return NextResponse.json(
        { error: loginError?.message ?? 'Doctor login failed' },
        { status: 401 }
      );
    }

    const userRole = loginData.user?.user_metadata?.role;
    if (userRole !== 'doctor') {
      return NextResponse.json(
        { error: 'This account is not registered as a doctor' },
        { status: 403 }
      );
    }

    return NextResponse.json({ session: loginData.session });
  } catch (error) {
    console.error('Doctor login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
