'use client';
import { useMemo, useState } from 'react';
import Toast from '../../../components/Toast';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Role = 'doctor' | 'user' | 'staff';

export default function LoginPage() {
  const [role, setRole] = useState<Role>('doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isDoctor = role === 'doctor';
  const isUser = role === 'user';
  const isStaff = role === 'staff';

  const submitLabel = useMemo(() => {
    if (isDoctor) return 'Login (Doctor)';
    if (isUser) return 'Login (User)';
    return 'Login (Staff)';
  }, [isDoctor, isUser]);

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setToast({ type: 'error', message: 'Email and password are required' });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setToast({ type: 'error', message: error.message ?? 'Login failed' });
      return;
    }

    setToast({ type: 'success', message: 'Logged in successfully' });
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

        {/* login-container */}
        <div className="flex flex-col h-full w-md border-black border-2 rounded-lg p-8 mt-6 bg-[#7DC77D]">
          <h2 className="self-center text-2xl text-black uppercase font-bold">Login</h2>

          {/* Role buttons */}
          <div className="flex gap-3 justify-between mt-4">
  <button
    type="button"
    onClick={() => setRole("doctor")}
    className={`px-4 py-2 rounded-3xl transition-all duration-300 ease-in-out border border-black w-24
      ${
        role === "doctor"
          ? "bg-white text-black scale-105 w-60"
          : "bg-black text-white hover:scale-105"
      }`}
  >
    Doctor
  </button>

  <button
    type="button"
    onClick={() => setRole("user")}
    className={`px-4 py-2 rounded-3xl transition-all duration-300 ease-in-out border border-black w-24
      ${
        role === "user"
          ? "bg-white text-black scale-105 w-60"
          : "bg-black text-white hover:scale-105"
      }`}
  >
    User
  </button>

  <button
    type="button"
    onClick={() => setRole("staff")}
    className={`px-4 py-2 rounded-3xl transition-all duration-300 ease-in-out border border-black w-24
      ${
        role === "staff"
          ? "bg-white text-black scale-105 w-60"
          : "bg-black text-white hover:scale-105"
      }`}
  >
    Staff
  </button>
</div>

          {/* Doctor form (kept) */}
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
              />

              <label htmlFor="specialty" className="text-gray-700 mt-3">
                Specialty:
              </label>
              <select
                id="specialty"
             
                className="bg-white text-gray-600 pl-3 pr-3 pt-2 pb-2 rounded-md border border-gray-300 outline-none transition-colors duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">Select a specialty</option>
                <optgroup label="Primary Care & Internal Medicine">
                  <option value="family_physician">Family Physician</option>
                  <option value="general_pediatrician">General Pediatrician</option>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />


          <a
            href="/forgot-password"
            className="mt-3 self-center text-blue-700 font-bold"
          >
            Forgot Password?
          </a>

          <Link
            href="#"
            onClick={handleLogin}
            className="mt-6 bg-[#FF383C] self-center pl-7 pr-7 pt-2 pb-2 rounded-3xl cursor-pointer text-white hover:bg-white hover:text-[#FF383C] transition-colors"
          >
            {submitLabel}
          </Link>

        </div>

        <p className="mt-3 mb-3 text-black">
          Don't have an account yet?{' '}
          <span className="text-red-500">
            <a href="/signup">Sign-up</a>
          </span>
        </p>
      </div>
    </main>
  );
}

