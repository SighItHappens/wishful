// Landing page component
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-10">
      
      <h1 className="text-5xl font-bold mb-6">Wishful</h1>
      <p className="text-xl mb-10 max-w-lg">
        Track your gift ideas all year round. Create wishlists and share them with friends and family.
      </p>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all">
          <span>Get Started</span>
          <FaArrowRight />
        </Link>
      </div>
      
      <div className="mt-16 flex flex-wrap justify-center gap-8 max-w-4xl">
        <FeatureCard 
          icon="🎁" 
          title="Create Wishlists" 
          description="Organize your gift ideas into multiple wishlists" 
        />
        <FeatureCard 
          icon="🔗" 
          title="Share Easily" 
          description="Share your wishlists with friends and family" 
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description } : {icon:string, title:string, description: string}) {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl shadow-lg hover:shadow-xl border border-gray-100 transform hover:-translate-y-1 transition-all duration-200">
      <div className="text-4xl mb-4 bg-indigo-100 text-indigo-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
