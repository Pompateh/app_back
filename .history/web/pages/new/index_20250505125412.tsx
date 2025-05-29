import type { NextPage } from 'next';
import useSWR from 'swr';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VerticalLine from '../../components/VerticalLine';
import Link from 'next/link';

interface AdditionalSection {
  title: string;
  paragraph: string;
}

interface PostRaw {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  featuredImage?: string;
  publishedAt?: string;
  type?: string;
  authorName?: string;
  authorJobTitle?: string;
  postDate?: string;
  readingTime?: string;
  content?: string;
  contentSources?: string[];
  referencePicUrl?: string;
  referencePicName?: string;
  additionalContent: AdditionalSection[];  // Now an array
  quote?: string;
  quoteAuthor?: string;
}

const fetcher = (url: string) =>
  fetch(url, { headers: { 'Content-Type': 'application/json' } }).then((res) => res.json());

const NewsListing: NextPage = () => {
  const { data, error } = useSWR<PostRaw[]>('/api/posts', fetcher);
  const [isImageExpanded, setIsImageExpanded] = useState(true);

  if (error) {
    toast.error('Failed to load posts.');
    return <p>Error loading posts.</p>;
  }
  if (!data) return <p>Loading posts…</p>;

  const posts = data;
  const featuredPost = posts[0];
  const relevantPosts = posts.slice(1);

  return (
    <Layout>
      <VerticalLine />
      <div className="containeer">
        {featuredPost && (
            <div className="grid grid-cols-1 md:grid-cols-7" style={{ columnGap: '2.375rem' }}>
            {/* Left Half */}
            <div className="flex flex-col space-y-4 mt-20 md:col-span-3 md:ml-[-75px]">
              <div className="text-sm text-gray-500">
                Bảng-tin / {featuredPost.type} / {featuredPost.title}
              </div>
              <h2 className="text-2xl font-semibold">{featuredPost.type}</h2>
              <h1 className="text-2xl font-semibold">{featuredPost.title}</h1>
              <p className="text-gray-700">
                <span className="font-semibold">BY {featuredPost.authorName}</span> <br />
                {featuredPost.authorJobTitle}
              </p>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <div className="flex items-center space-x-1">
                    <span>📅</span>
                    <span>{new Date(featuredPost.postDate || '').toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>⏰</span>
                    <span>{featuredPost.readingTime}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="font-bebas flex items-center text-blue-500 hover:text-blue-700 text-sm space-x-1">
                    <span>❤️</span>
                    <span>THÍCH</span>
                  </button>
                  <button className="font-bebas flex items-center text-green-500 hover:text-green-700 text-sm space-x-1">
                    <span>🔗</span>
                    <span>CHIA SẺ</span>
                  </button>
                </div>
              </div>
              <hr
                className="border-gray-300"
                style={{
                  borderTop: '2px solid transparent',
                  borderImage:
                    'repeating-linear-gradient(to right, #999380, #999380 50px, transparent 50px, transparent 55px) 1',
                }}
              />
              <div className="prose max-w-none">
                {featuredPost.content && (
    <div
      className="prose max-w-none mt-6 text-gray-800"
      dangerouslySetInnerHTML={{ __html: featuredPost.content }}
    />
  )}

                {/* Famous Quote */}
                <div className="mt-4 p-4" style={{ backgroundColor: 'rgb(238, 235, 221)' }}>
                  <blockquote className="italic text-gray-600">
                    "{featuredPost.quote || 'A famous quote from a random person.'}"
                  </blockquote>
                  <div className="text-right text-gray-600 font-semibold">
                    - {featuredPost.quoteAuthor || 'Author Name'}
                  </div>
                </div>

                {/* Additional Content Sections */}
                {featuredPost.additionalContent.length > 0 && (
                  <div className="mt-4 mt-8 mb-8">
                    {featuredPost.additionalContent.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-xl font-semibold">{section.title}</h3>
                        <div
                          className="text-gray-700"
                          dangerouslySetInnerHTML={{ __html: section.paragraph }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Half */}
            <div className="flex flex-col space-y-8 mt-4 md:col-span-4 border-l-2 border-[#999380] pl-0">
              <div className="flex flex-row justify-end items-start space-x-4 relative">
                <div className="p-4 mt-24 relative" style={{ width: '29%' }}>
                  {featuredPost.referencePicUrl && (
                    <button
                      onClick={() => setIsImageExpanded(!isImageExpanded)}
                      className="font-bebas absolute top-[-30px] right-0 bg-white bg-opacity-75 px-2 py-1 text-xs hover:bg-opacity-100 transition font-extrabold"
                      style={{ zIndex: 10 }}
                    >
                      {isImageExpanded ? 'Minimize»' : 'Phóng to'}
                    </button>
                  )}
                  <ol className="list-decimal pl-5 space-y-1">
                    {featuredPost.contentSources?.map((source, idx) => (
                      <li key={idx} className="text-sm text-gray-700 break-words">
                        {source}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-72">
                    <div
                      className="w-full p-4 flex flex-col items-center border-t border-b border-gray-500"
                      style={{ backgroundColor: '#eeebdd' }}
                    >
                      <div className="flex justify-between items-center w-full ">
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-bold font-bebas">SUBSCRIBE TO OUR</span>
                          <span className="text-xs font-bold font-bebas">NEWSLETTER FOR</span>
                          <span className="text-xs font-bold font-bebas">DAILY GOODNESS</span>
                        </div>
                        <span className="text-5xl font-light flex items-center" style={{ marginTop: '-10px' }}>+</span>
                      </div>
                      <div className="flex justify-end w-full">
                        <img src="/assets/Layer 6.png" alt="Doodle" className="w-24 h-24 mt-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reference Picture Section */}
                {featuredPost.referencePicUrl && isImageExpanded && (
                  <div className="relative w-4/6 bg-black px-16 py-32 rounded shadow overflow-hidden flex flex-col items-center justify-center" style={{ height: '100%' }}>
                    <img
                      src={featuredPost.referencePicUrl}
                      alt={featuredPost.referencePicName}
                      className="max-w-full max-h-full object-contain transition-all duration-300"
                    />
                    <div className="w-full text-right">
                      <span className="text-xs text-white">{featuredPost.referencePicName}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Full-width Relevant Posts Section */}
      <div className="w-full p-12 border-t-2 border-[#999380] relevant_post" style={{ backgroundColor: 'rgb(238, 235, 221)' }}>
        <h2 className="text-3xl font-bold mb-4">Relevant Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relevantPosts.slice(0, 3).map((relevantPost) => (
            <Link key={relevantPost.id} href={`/new/${relevantPost.slug}`} legacyBehavior>
              <a className="border rounded-lg hover:shadow-lg transition cursor-pointer">
                {relevantPost.featuredImage && (
                  <img
                    src={relevantPost.featuredImage}
                    alt={relevantPost.title}
                    className="w-full h-100 object-cover rounded mb-2"
                    style={{ aspectRatio: '1 / 1' }}
                  />
                )}
                <p className="text-sm text-gray-500">{relevantPost.type}</p>
                <h3 className="text-xl font-semibold">{relevantPost.title}</h3>
                {relevantPost.summary && (
                  <p className="text-sm text-gray-700 mt-1">{relevantPost.summary}</p>
                )}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default NewsListing;
