import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useState } from 'react';
import VerticalLine from '../../components/VerticalLine';

interface PostDetail {
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
  additionalContent?: { title: string; paragraph: string }[];
  quote?: string;
  quoteAuthor?: string;
}

interface PostPageProps {
  post: PostDetail;
  relevantPosts: PostDetail[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
const PostPage: NextPage<PostPageProps> = ({ post, relevantPosts = [] }) => {
  const router = useRouter();
  const [isImageVisible, setIsImageVisible] = useState(true);

  if (router.isFallback) return <div>Loading post...</div>;

  return (
    <Layout>
      <VerticalLine />
      <div className="w-full" style={{ paddingLeft: '238px', marginRight: '0',  }}>
        <div className="grid grid-cols-1 md:grid-cols-9">
          {/* Left Half: Main Content */}
          <div className="flex flex-col space-y-4 mt-20 md:ml-[-75px] md:col-span-4 pr-6">
            <div className="text-sm text-gray-500">
              Bảng-tin / {post.type} / {post.title}
            </div>
            <h2 className="text-2xl font-semibold">{post.type}</h2>
            <h1 className="text-2xl font-semibold">{post.title}</h1>
            <p className="text-gray-700">
              <span className="font-semibold">BY {post.authorName}</span> <br />
              {post.authorJobTitle}
            </p>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <div className="flex items-center space-x-1">
                  <span>📅</span>
                  <span>{new Date(post.postDate || '').toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>⏰</span>
                  <span>{post.readingTime}</span>
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
                borderImage: 'repeating-linear-gradient(to right, #999380, #999380 50px, transparent 50px, transparent 55px) 1',
              }}
            />
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold">{post.title}</h2>
                {post.content && (
    <div
      className="prose max-w-none mt-6 text-gray-800"
      dangerouslySetInnerHTML={{ __html: post.content }}
    />
  )}
              {post.quote && (
                <div className="mt-4 p-4" style={{ backgroundColor: 'rgb(238, 235, 221)' }}>
                  <blockquote className="italic text-gray-600">
                    "{post.quote}"
                  </blockquote>
                  <div className="text-right text-gray-600 font-semibold">
                    - {post.quoteAuthor}
                  </div>
                </div>
              )}
                        {post.additionalContent && (
  <div className="mt-4 mb-8" >
    {post.additionalContent.map((section, idx) => (
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
          {/* Right Half: Extra Info */}
          <div className="flex flex-col space-y-8 mt-4 md:col-span-5 border-l-2 border-[#999380] pl-0">
            <div className="flex flex-row justify-end items-start space-x-4 relative">
              <div className="p-4 mt-24 relative" style={{ width: '29%' }}>
                {post.referencePicUrl && (
                  <button
                    onClick={() => setIsImageVisible(!isImageVisible)}
                    className="font-bebas absolute top-[-30px] right-0 bg-white bg-opacity-75 px-2 py-1 text-xs hover:bg-opacity-100 transition font-extrabold"
                    style={{ zIndex: 10 }}
                  >
                    {isImageVisible ? 'Hide' : 'Expand'}
                  </button>
                )}
                <ol className="list-decimal pl-5 space-y-1">
                  {post.contentSources?.map((source, idx) => (
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

              {post.referencePicUrl && isImageVisible && (
                <div className="relative w-3/4 bg-black px-16 py-32 rounded shadow overflow-hidden flex flex-col items-center justify-center" style={{ height: '100%' }}>
                  <img
                    src={post.referencePicUrl}
                    alt={post.referencePicName}
                    className="max-w-full max-h-full object-contain transition-all duration-300"
                  />
                  <div className="w-full text-right">
                    <span className="text-xs text-white">{post.referencePicName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Relevant Posts Section */}
      <div className="w-full p-12 border-t-2 border-[#999380] relevant_post" style={{ backgroundColor: 'rgb(238, 235, 221)' }}>
        <h2 className="text-3xl font-bold mb-4">Relevant Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relevantPosts.map((relevantPost) => (
            <Link key={relevantPost.id} href={`/new/${relevantPost.slug}`} legacyBehavior>
              <a className="border p-4 rounded-lg hover:shadow-lg transition cursor-pointer">
                {relevantPost.featuredImage && (
                  <img
                    src={relevantPost.featuredImage}
                    alt={relevantPost.title}
                    className="w-full h-100 object-cover rounded mb-2"
                    style={{ aspectRatio: '1 / 1' }} // Ensures the image is square
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

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch(`${API_BASE}/posts`);
    if (!res.ok) {
      console.error('Failed to fetch posts:', res.statusText);
      return { paths: [], fallback: true };
    }

    const posts = await res.json();
    console.log('Fetched posts:', posts);

    if (!Array.isArray(posts)) {
      console.error('Expected an array of posts but received:', posts);
      return { paths: [], fallback: true };
    }

    const paths = posts.map((post) => ({ params: { slug: post.slug } }));
    return { paths, fallback: true };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { paths: [], fallback: true };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || !params.slug) {
    return { notFound: true };
  }
  const slug = params.slug;
  try {
    const res = await fetch(`${API_BASE}/posts/${slug}`);
    if (!res.ok) {
      console.error('Failed to fetch post:', res.statusText);
      return { notFound: true };
    }
    const post: PostDetail = await res.json();
    console.log('Fetched post:', post);

    // Fetch relevant posts
    const relevantRes = await fetch(`${API_BASE}/posts`);
    const relevantPosts: PostDetail[] = await relevantRes.json();

    // Filter out the current post from relevant posts
    const filteredRelevantPosts = relevantPosts.filter(p => p.slug !== slug);

    return { props: { post, relevantPosts: filteredRelevantPosts || [] }, revalidate: 60 };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { notFound: true };
  }
};

export default PostPage;