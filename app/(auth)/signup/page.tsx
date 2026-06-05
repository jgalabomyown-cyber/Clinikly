"use client";
import { useMemo, useState } from 'react';
import Toast from '../../../components/Toast';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Role = 'doctor' | 'user';

type FieldValues = {
  medical_license_number?: string;
  specialty?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  birth_date?: string;
  password?: string;
  confirmPassword?: string;
};


export default function SignupPage() {
  const [role, setRole] = useState<Role>('user');
  const [animPulse, setAnimPulse] = useState(false);
  const [form, setForm] = useState<FieldValues>({});

  const isDoctor = role === 'doctor';
  const isUser = role === 'user';

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const submitLabel = useMemo(() => {
    if (isDoctor) return 'Sign up (Doctor)';
    return 'Sign up (User)';
  }, [isDoctor]);

  const handleSubmitClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setAnimPulse(true);
    window.setTimeout(() => setAnimPulse(false), 220);

    const email = form.email?.trim();
    const password = form.password;
    const confirmPassword = form.confirmPassword;
    const first_name = form.first_name?.trim();
    const last_name = form.last_name?.trim();
    const phone = form.phone?.trim();
    const birth_date = form.birth_date;
    const specialty = form.specialty?.trim();
    const medical_license_number = form.medical_license_number?.trim();

    const missingFields: string[] = [];
    if (!first_name) missingFields.push('first name');
    if (!last_name) missingFields.push('last name');
    if (!phone) missingFields.push('phone');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!confirmPassword) missingFields.push('confirm password');


    if (role === 'user') {
      if (!birth_date) missingFields.push('birth date');
    }

    if (role === 'doctor') {
      if (!specialty) missingFields.push('specialty');
      if (!medical_license_number) missingFields.push('medical license number');
    }

    if (missingFields.length > 0) {
      setToast({
        type: 'error',
        message: `Please fill all fields: ${missingFields.join(', ')}`,
      });
      return;
    }

    if (password !== confirmPassword) {
      setToast({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: email!,
      password: password!,
      options: {
        data: {
          role,
          first_name,
          last_name,
          phone,
          birth_date,
          specialty,
          medical_license_number,
        },
      },
    });

    if (error) {
      setToast({ type: 'error', message: error.message ?? 'Signup error' });
      return;
    }

    const userId = authData?.user?.id;
    if (!userId) {
      console.log('User created but no id returned');
      return;
    }

    // Profile rows are created/updated by the auth trigger after user signup.
    // Patient rows are also created/updated by the auth trigger for role = 'user'.
    console.log('User created');
    setToast({ type: 'success', message: 'Email confirmation sent, please check your email' });
  };

  return (
    <main className="min-h-screen bg-[#A8C7A8]">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          duration={5000}
          onClose={() => setToast(null)}
        />
      )}
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

          </div>

          {/* Doctor form */}
          {isDoctor && (
            <>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-6">
                <div className="flex flex-col">
                  <label htmlFor="first_name" className="text-gray-700">
                    First name:
                  </label>
                  <input
                    className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                    type="text"
                    id="first_name"
                    placeholder="First name"
                    value={form.first_name ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="last_name" className="text-gray-700">
                    Last name:
                  </label>
                  <input
                    className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                    type="text"
                    id="last_name"
                    placeholder="Last name"
                    value={form.last_name ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                  />
                </div>
              </div>

              <label htmlFor="email" className="text-gray-700 mt-3">
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

              <label htmlFor="phone" className="text-gray-700 mt-3">
                Phone:
              </label>
              <input
                className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                type="tel"
                id="phone"
                placeholder="07XXXXXXXX"
                value={form.phone ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />

              <label htmlFor="medical_license_number" className="text-gray-700 mt-3">
                Medical License Number:
              </label>
              <input
                className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700"
                type="text"
                id="medical_license_number"
                placeholder="654321"
                value={form.medical_license_number ?? ''}
                onChange={(e) =>
                  setForm((p) => ({ ...p, medical_license_number: e.target.value }))
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
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-6">
                <div className="flex flex-col">
                  <label htmlFor="first_name" className="text-gray-700">
                    First name:
                  </label>
                  <input
                    className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                    type="text"
                    id="first_name"
                    placeholder="First name"
                    value={form.first_name ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="last_name" className="text-gray-700">
                    Last name:
                  </label>
                  <input
                    className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                    type="text"
                    id="last_name"
                    placeholder="Last name"
                    value={form.last_name ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                  />
                </div>
              </div>

              <label htmlFor="phone" className="text-gray-700 mt-3">
                Phone:
              </label>
              <input
                className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                type="tel"
                id="phone"
                placeholder="07XXXXXXXX"
                value={form.phone ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />

              <label htmlFor="birth_date" className="text-gray-700 mt-3">
                Birth date:
              </label>
              <input
                className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
                type="date"
                id="birth_date"
                value={form.birth_date ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, birth_date: e.target.value }))}
              />

              <label htmlFor="email" className="text-gray-700 mt-3">
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

