import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { NavigationProvider } from '../components/NavigationContext';
import StudioNavigation from '../components/StudioNavigation';
import VerticalLineBlack from '../components/VerticalLine_black';
import Preloader from '../components/Preloader';

interface NavItem {
  label: string;
  href: string;
}

interface Studio {
  id: string;
  name: string;
  description: string;
  author?: string;
  thumbnail?: string;
  imageTitle?: string;
  imageDescription?: string;
  openDays?: string[];
  openHours?: string;
  navigation?: NavItem[];
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('Response Status:', res.status);
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error Response:', errorText);
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  const data = await res.json();
  console.log('Fetched Data:', data);
  return data;
};

const MasterHomepage: NextPage = () => {
  const { data, error } = useSWR<Studio[]>('/api/studios', fetcher);
  const [studios, setStudios] = useState<Studio[]>([]);

  useEffect(() => {
    if (data) {
      setStudios(data);
      setLoading(false);
    }
    if (error) {
      toast.error(error.message || 'Failed to load studios');
      setLoading(false);
    }
  }, [data, error]);

  return (
    <div className="flex-1 h-screen snap-y snap-mandatory overflow-y-auto">
      <VerticalLineBlack />
      {loading ? (
        <Preloader />
      ) : (
        Array.isArray(studios) && studios.length > 0 ? (
        studios.map((studio) => {
          const defaultNavItems: NavItem[] = [
            { label: 'Overview', href: `/studio/${studio.id}/overview` },
            { label: 'Exhibits', href: `/studio/${studio.id}/exhibits` },
            { label: 'Events', href: `/studio/${studio.id}/events` },
          ];
          const navItems = studio.navigation || defaultNavItems;
          return (
            <section key={studio.id} className="relative h-screen snap-start flex flex-col md:flex-row bg-indigo-900 text-white overflow-hidden">
              {/* Left: Image content */}
              <div className="relative flex-1 overflow-hidden">
                {studio.thumbnail ? (
                  <div className="w-full h-full relative">
                    <img
                      src={studio.thumbnail}
                      alt={studio.name}
                      className="w-full h-full object-cover transform transition-transform duration-1000 ease-in-out hover:scale-105 opacity-0 animate-fadeIn"
                    />
                    <div className="absolute inset-0 bg-black opacity-20" style={{ transform: 'translateY(0px)' }} />
                    {(studio.imageTitle || studio.imageDescription || studio.author) && (
                      <div
                        className="absolute bottom-0 left-8 right-4 flex items-center justify-between bg-white animate-fadeIn"
                        style={{ height: '130px', boxSizing: 'border-box' }}
                      >
                        <div className="flex flex-col" style={{ maxWidth: '70%', lineHeight: '1.2', padding: '14px 14px' }}>
                          {studio.imageTitle && (
                            <h2
                              style={{
                                fontFamily: '"Bebas Neue", cursive',
                                letterSpacing: '0.05em',
                                margin: '0 0 0.5em 0',
                                fontWeight: 500,
                                fontSize: '1.5rem',
                              }}
                              className="text-black"
                            >
                              {studio.imageTitle}
                            </h2>
                          )}
                          {studio.imageDescription && (
                            <p
                              style={{ fontSize: '0.875rem', lineHeight: '1.3', margin: 0 }}
                              className="font-literata text-black"
                            >
                              {studio.imageDescription}
                            </p>
                          )}
                        </div>
                        {studio.author && (
                          <div className="flex flex-col justify-center text-right" style={{ maxWidth: '30%', padding: '14px 14px', position: 'absolute', bottom: 0, right: 0 }}>
                            {studio.author.split(',').map((line, index) =>
                              index === 0 ? (
                                <p
                                  key={index}
                                  style={{
                                    fontSize: '0.875rem',
                                    margin: 0,
                                    fontWeight: 600,
                                  }}
                                  className="font-literata text-black"
                                >
                                  {line.trim()}
                                </p>
                              ) : (
                                <p
                                  key={index}
                                  style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    margin: 0,
                                    
                                  }}
                                  className="font-literata text-black "
                                >
                                  {line.trim()}
                                </p>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-300">No Image Available</span>
                  </div>
                )}
              </div>
              
{/* Right: Studio details and Navigation */}
<div className="flex-1 flex flex-col bg-[#1a1916] relative">
  <div className="flex-1 flex flex-col justify-center items-center">
    <div
      className="relative border border-gray-300 bg-black text-white"
      style={{ width: '350px', height: 'auto', minHeight: '400px' }} // Adjust width and minHeight as needed
    >
      {/* Studio Detail Box */}
      <div className="p-4">
        <div className="w-full">
          <h2 className="text-2xl font-bold mb-1 font-crimson-pro">{studio.name}</h2>
          <hr className="border-t-2 border-[#999380] mt-2 w-full" />
        </div>
      </div>
      <p className="text-sm font-gothic-a1 p-4 leading-relaxed">{studio.description}</p>
      <hr className="micro-divider mt-2" />
      <div className="py-2 mb-4">
        <div className="p-4">
          <p className="text-xs font-semibold uppercase mb-1">Giờ Mở Cửa</p>
          <hr className="border-t-2 border-[#999380] mt-2 w-full" />
        </div>
        <div className="flex justify-between p-4">
          <span className="text-sm">{studio.openHours || 'N/A'}</span>
          <span className="text-sm">
            {studio.openDays && studio.openDays.length > 0 ? studio.openDays.join(', ') : ''}
          </span>
        </div>
      </div>
          {/* Enter Studio Button */}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <Link href={`/studio/${studio.id}`}>
        <button
          className="w-full bg-yellow-400 text-black py-3 px-4 flex items-center justify-between transition hover:bg-yellow-500 focus:outline-none"
          style={{
            fontFamily: '"Bebas Neue", cursive',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          <span>TỚI STUDIO</span>
          <span className="text-xl">
            <img
              src="https://www.svgrepo.com/show/175121/door-open.svg"
              alt="Door Icon"
              className="w-6 h-6"
            />
          </span>
        </button>
      </Link>
    </div>
      {/* Conditional Stickers: Only show for Newstalgia studio */}
      {studio.name?.trim().toLowerCase() === "newstalgia" && (
        <>
          <div className="absolute -top-8 -left-8">
            <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center animate-bounce">
              <span role="img" aria-label="sticker">🎨</span>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8">
            <div className="w-10 h-10 bg-green-300 rounded-full flex items-center justify-center animate-bounce">
              <span role="img" aria-label="sticker">✨</span>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
  {/* Full-Width Navigation Bar */}
  <div className="w-full">
    <NavigationProvider key={studio.id}>
      <StudioNavigation navItems={navItems} />
    </NavigationProvider>
  </div>
</div>
            </section>
          );
        })
      ) : (
<Preloader />
      )}
      
      <style jsx global>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s forwards;
        }
        .micro-divider {
content: "";
  position: absolute;
  left: 0;
  right: 0;

  /* Apply the custom dashed pattern using borderImage */
  border-image: repeating-linear-gradient(to right, #999380, #999380 67px, transparent 67px, transparent 72px) 1;
  pointer-events: none;
      `}</style>
    </div>
  );
};

export default MasterHomepage;