import Link from 'next/link';

export default function landingPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      This is the Landing Page. <br /><br />
      <Link href="/login">Login Now!</Link>
    </main> 
  );
}