export default function PatientsDashboard() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Patient Portal</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900">Dashboard</h1>
              <p className="mt-3 text-sm text-slate-600">Your health and appointments in one place.</p>
            </div>

            <nav className="space-y-2">
              {['Dashboard', 'Calendar', 'Appointments', 'Statistics'].map((item, idx) => (
                <button
                  key={item}
                  type="button"
                  className={`w-full rounded-3xl px-4 py-3 text-left text-sm font-medium transition ${
                    idx === 0
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-600">
              <p className="text-slate-900 font-medium">Tools</p>
              <div className="mt-4 space-y-3">
                <button className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 hover:border-slate-300">
                  Chats
                </button>
                <button className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 hover:border-slate-300">
                  Settings
                </button>
              </div>
            </div>
          </aside>

          <section className="grid gap-6">
            <div className="grid gap-6 xl:grid-cols-[1.75fr_1fr]">
              <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Welcome back</p>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-900">Hi, Sarah</h2>
                    <p className="mt-2 text-sm text-slate-600">Here is your health snapshot for today.</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 px-5 py-4 text-white shadow-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Next appointment</p>
                    <p className="mt-3 text-lg font-semibold">Cardiology</p>
                    <p className="mt-1 text-sm text-slate-200">May 12 · 02:00 PM</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Appointments</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">10</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">this year</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Weight</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">68 kg</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">stable</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Blood Pressure</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">120/78</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">healthy</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Heart rate</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-900">72 BPM</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">resting</p>
                  </div>
                </div>
              </div>

              <aside className="space-y-6">
                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Calendar</p>
                    <p className="text-sm text-slate-500">May 2026</p>
                  </div>
                  <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-7 gap-2 text-sm text-slate-700">
                    {Array.from({ length: 35 }).map((_, index) => {
                      const day = index - 1;
                      const isCurrent = day === 12;
                      return (
                        <div
                          key={index}
                          className={`rounded-3xl px-2 py-3 ${
                            isCurrent
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {day >= 1 && day <= 31 ? day : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">Your treatment</p>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-900">Ibuprofen</p>
                      <p className="mt-1 text-xs text-slate-500">2 times per day</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-900">Vitamin D</p>
                      <p className="mt-1 text-xs text-slate-500">1 capsule daily</p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
              <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Appointments</p>
                    <p className="mt-2 text-sm text-slate-500">63 appointments this year</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900 px-4 py-3 text-white">This year</div>
                </div>
                <div className="mt-8 h-56 rounded-4xl bg-linear-to-r from-slate-100 via-slate-50 to-white p-5">
                  <div className="h-full w-full rounded-4xl bg-slate-100 p-4">
                    <div className="flex h-full flex-col justify-between">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Jan</span>
                        <span>Dec</span>
                      </div>
                      <div className="flex h-full items-end gap-2">
                        <div className="h-12 w-full rounded-3xl bg-slate-200"></div>
                        <div className="h-24 w-full rounded-3xl bg-slate-300"></div>
                        <div className="h-20 w-full rounded-3xl bg-slate-200"></div>
                        <div className="h-28 w-full rounded-3xl bg-slate-300"></div>
                        <div className="h-16 w-full rounded-3xl bg-slate-200"></div>
                        <div className="h-32 w-full rounded-3xl bg-slate-300"></div>
                        <div className="h-20 w-full rounded-3xl bg-slate-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Health quick view</p>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                    <span className="text-sm text-slate-600">Weight</span>
                    <span className="font-semibold text-slate-900">68 kg</span>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                    <span className="text-sm text-slate-600">Blood pressure</span>
                    <span className="font-semibold text-slate-900">120/78</span>
                  </div>
                  <div className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                    <span className="text-sm text-slate-600">Pulse</span>
                    <span className="font-semibold text-slate-900">72 BPM</span>
                  </div>
                  <div className="rounded-3xl bg-slate-900 p-4 text-white">
                    <p className="text-sm font-medium">Follow-up</p>
                    <p className="mt-2 text-sm text-slate-200">See Dr. Saira Goodman on May 12 at 2:00 PM.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
