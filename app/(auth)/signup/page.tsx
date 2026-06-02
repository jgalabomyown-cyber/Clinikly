'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Role = 'doctor' | 'user' | 'staff';

type FieldValues = {
  medical_learning_number?: string;
  specialty?: string;
  email?: string;
  staff_number?: string;
  password?: string;
  confirmPassword?: string;
};


export default function SignupPage() {
  const [role, setRole] = useState<Role>('user');
  const [animPulse, setAnimPulse] = useState(false);
  const [form, setForm] = useState<FieldValues>({});

  const isDoctor = role === 'doctor';
  const isUser = role === 'user';
  const isStaff = role === 'staff';

  const submitLabel = useMemo(() => {
    if (isDoctor) return 'Sign up (Doctor)';
    if (isUser) return 'Sign up (User)';
    return 'Sign up (Staff)';
  }, [isDoctor, isUser]);

  const handleSubmitClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAnimPulse(true);
    window.setTimeout(() => setAnimPulse(false), 220);

    const email = form.email;
    const password = form.password;

    if (!email || !password) {
      console.log('Missing email or password');
      return;
    }

    const { data:authData, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.log(error.message);
      return;
    }

    const userId = authData?.user?.id;
    const session = authData?.session;

    if (!userId) {
      console.log('User created but no id returned');
      return;
    }

    // If signup returns a session (user is authenticated client-side), we can
    // safely insert a patients row from the client. If signup requires email
    // confirmation, `session` will be null and the client insert will be denied
    // by RLS. In that case rely on the DB trigger or a server API to create the
    // patients row.
    if (isUser) {
      if (!session) {
        console.log('Signup requires email confirmation — patient creation deferred until confirmation.');
      } else {
        const { error: insertError } = await supabase.from('patients').insert([{ id: userId }]);
        if (insertError) {
          console.log('Error creating patient row:', insertError.message);
        } else {
          console.log('Patient row created');
        }
      }
    }

    console.log('User created');
  };

  return (
    <main className="min-h-screen bg-[#A8C7A8]">
      <div className="flex flex-col min-h-screen items-center justify-center">
        <h1
          className="text-[#FF383C] text-5xl font-bold"
          style={{ fontFamily: 'Island Moments, cursive' }}
        >
          Clinikly
        </h1>
        <p className="text-gray-600 italic">
          "Where your health is our priority, your records secured, and
          your appointments at ease."
        </p>

        {/* login-container (same design language as login) */}
        <div className="flex flex-col h-full w-md border-black border-2 rounded-lg p-8 mt-6 bg-[#7DC77D]">
          <h2 className="self-center text-2xl text-black uppercase font-bold">
            Sign up
          </h2>

          {/* Role buttons */}
          <div className="flex gap-3 justify-between mt-4">
            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`px-4 py-2 rounded-3xl transition-all duration-300 ease-in-out border border-black w-24
                ${
                  role === 'doctor'
                    ? 'bg-white text-black scale-105 w-60'
                    : 'bg-black text-white hover:scale-105'
                }`}
            >
              Doctor
            </button>

            <button
              type="button"
              onClick={() => setRole('user')}
              className={`px-4 py-2 rounded-3xl transition-all duration-300 ease-in-out border border-black w-24
                ${
                  role === 'user'
                    ? 'bg-white text-black scale-105 w-60'
                    : 'bg-black text-white hover:scale-105'
                }`}
            >
              User
            </button>

            <button
              type="button"
              onClick={() => setRole('staff')}
              className={`px-4 py-2 rounded-3xl transition-all duration-300 ease-in-out border border-black w-24
                ${
                  role === 'staff'
                    ? 'bg-white text-black scale-105 w-60'
                    : 'bg-black text-white hover:scale-105'
                }`}
            >
              Staff
            </button>
          </div>

          {/* Doctor form */}
          {isDoctor && (
            <>
              <label
                htmlFor="medical_learning_number"
                className="text-gray-700 mt-6"
              >
                Medical Learning Number:
              </label>
              <input
                className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700"
                type="text"
                id="medical_learning_number"
                placeholder="01-222-344"
                value={form.medical_learning_number ?? ''}
                onChange={(e) =>
                  setForm((p) => ({ ...p, medical_learning_number: e.target.value }))
                }
              />

              <label htmlFor="specialty" className="text-gray-700 mt-3">
                Specialty:
              </label>
              <select
                id="specialty"
                className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                value={form.specialty ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))}
              >
                <option value="">Select a specialty</option>
                <optgroup label="Primary Care & Internal Medicine">
                  <option value="family_physician">Family Physician</option>
                  <option value="general_pediatrician">
                    General Pediatrician
                  </option>
                  <option value="internal_medicine_physician">
                    Internal Medicine Physician
                  </option>
                </optgroup>
                <optgroup label="Medical Subspecialties">
                  <option value="cardiologist">Cardiologist</option>
                  <option value="endocrinologist">Endocrinologist</option>
                  <option value="hematologist">Hematologist</option>
                  <option value="dermatologist">Dermatologist</option>
                  <option value="gastroenterologist">Gastroenterologist</option>
                  <option value="nephrologist">Nephrologist</option>
                  <option value="neurologist">Neurologist</option>
                  <option value="pulmonologist">Pulmonologist</option>
                  <option value="rheumatologist">Rheumatologist</option>
                  <option value="oncologist">Oncologist</option>
                  <option value="infectious_disease_specialist">
                    Infectious Disease Specialist
                  </option>
                </optgroup>
                <optgroup label="Surgical Specialties">
                  <option value="general_surgeon">General Surgeon</option>
                  <option value="cardiothoracic_surgeon">
                    Cardiothoracic Surgeon
                  </option>
                  <option value="neurosurgeon">Neurosurgeon</option>
                  <option value="orthopedic_surgeon">Orthopedic Surgeon</option>
                  <option value="ent_surgeon">ENT Surgeon</option>
                  <option value="plastic_surgeon">Plastic Surgeon</option>
                  <option value="urologist">Urologist</option>
                </optgroup>
                <optgroup label="Other Specialties">
                  <option value="ob_gyn">OB/GYN</option>
                  <option value="emergency_medicine">Emergency Medicine</option>
                  <option value="anesthesiologist">Anesthesiologist</option>
                  <option value="radiologist">Radiologist</option>
                  <option value="pathologist">Pathologist</option>
                  <option value="psychiatrist">Psychiatrist</option>
                </optgroup>
              </select>
            </>
          )}

          {/* User form */}
          {isUser && (
            <>
              <label htmlFor="email" className="text-gray-700 mt-6">
                Email:
              </label>
              <input
                className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                type="email"
                id="email"
                placeholder="you@example.com"
                value={form.email ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </>
          )}

          {/* Staff form */}
          {isStaff && (
            <>
              <label htmlFor="staff_number" className="text-gray-700 mt-6">
                Staff Number:
              </label>
              <input
                className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                type="text"
                id="staff_number"
                placeholder="STAFF-001"
                value={form.staff_number ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, staff_number: e.target.value }))}
              />
            </>
          )}

          {/* Shared password */}
          <label htmlFor="password" className="text-gray-700 mt-3">
            Password:
          </label>
          <input
            className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
            type="password"
            id="password"
            value={form.password ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />

          <label htmlFor="confirmPassword" className="text-gray-700 mt-3">
            Confirm Password:
          </label>
          <input
            className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
            type="password"
            id="confirmPassword"
            value={form.confirmPassword ?? ''}
            onChange={(e) =>
              setForm((p) => ({ ...p, confirmPassword: e.target.value }))
            }
          />

          <div className="mt-3 self-center">
            <Link
              href="/login"
              className="text-blue-700 font-bold"
            >
              Already have an account? Login
            </Link>
          </div>

          <button
            type="button"
            onClick={handleSubmitClick}
            className={`mt-6 bg-[#FF383C] self-center pl-7 pr-7 pt-2 pb-2 rounded-3xl cursor-pointer text-white transition-colors ${
              animPulse ? 'animate-signup-flip-reverse' : ''
            }`}
          >
            {submitLabel}
          </button>
        </div>

        <p className="mt-3 mb-3 text-black text-center">
          Need help?{' '}
          <a className="text-red-500 font-bold" href="">
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}

