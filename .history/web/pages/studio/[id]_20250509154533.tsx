import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import React from 'react';
import VerticalLine from '../../components/VerticalLine'; // Import the VerticalLine component

interface StudioDetail {
  id: string;
  name: string;
  slogan: string;
  portfolio?: { id: string; title: string; image: string; type: string; year: number }[];
  fonts?: { id: string; name: string; image: string; type: string; price: number }[];
  artworks?: { id: string; name: string; author: string; image: string; type: string; }[];
  sections: {
    fonts: {
      preTitle: string;       // "Handcrafted Typefaces"
      title: string;          // "Phông-chữ Nhà-làm"
      description: string;    // your long bilingual paragraph
      buttonText: string;     // "xem tất cả phông chữ"
    };
    artworks: {
      preTitle: string;       // "Home-cooked Illustrations"
      title: string;          // "<span class='italic'>Tranh-vẽ</span> Nhà-làm"
      description: string;
      buttonText: string;     // "xem tất cả Tranh-vẽ"
    };
    newsletter: {
      backgroundImage: string; // '/assets/background_sub.png'
      title: string;           // "Subscribe for\nDaily Goodness"
      subtitleEmphasis: string;// "Daily Goodness"
      namePlaceholder: string; // "Your name*"
      emailPlaceholder: string;// "Your email*"
      buttonText: string;      // "Subscribe"
    };
  };
  
}

const fetcher = (url: string) =>
  fetch(url, { headers: { 'Content-Type': 'application/json' } }).then(res =>
    res.json()
  );

const formatSlogan = (slogan: string) => {
  const lines = [
    "We're a Powerhouse crafting the",
    "next best sh*t on the net: Branding,",
    "Typeface, Illustration."
  ];
  
  return (
    <>
      {lines.map((line, index) => (
        <span key={index} className="block leading-tight tracking-wide w-full text-center" style={{ fontSize: '5.3rem' }}>
          {line.split(' ').map((word, wordIndex) => (
            <span
              key={wordIndex}
              className={word === "Powerhouse" ? 'italic' : ''}
            >
              {word}{' '}
            </span>
          ))}
        </span>
      ))}
    </>
  );
};

const StudioHomepage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR<StudioDetail>(id ? `/api/studios/${id}` : null, fetcher);
  const [studio, setStudio] = useState<StudioDetail | null>(null);

  useEffect(() => {
    if (data) {
      setStudio(data);
    }
    if (error) {
      toast.error('Failed to load studio details');
    }
  }, [data, error]);

  if (!studio) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-400 text-lg">Loading studio details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <VerticalLine /> {/* Use the VerticalLine component */}

      <section className="w-full py-28 bg-black text-white">
        <div className="max-w-screen-2xl mx-auto px-4 ">
          <div className="flex flex-col items-center">
            <img src="/assets/Layer 11.png" alt="Studio Doodle" className="w-40 h-25 object-cover mb-4" />
            <p className="text-lg font-extrasmall text-center mb-4">Xin chào! Chúng tôi là {studio.name}</p>
            <h1 className=" text-center mb-6 leading-tight tracking-wide w-full custom-heading">
              {formatSlogan(studio.slogan)}
            </h1>
            <p className="text-3xl font-semibold text-center italic">You name it. We've got it</p>
          </div>
        </div>
      </section>

      {/* Work Portfolio Section */}
      {studio.portfolio && (
        <section className="w-full py-10 bg-black text-white">
          <div className="max-w-screen-2xl mx-auto px-4">
            <div className="space-y-12">
              {studio.portfolio.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto max-h-custom object-cover"
                  />
                  <div className="py-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-gray-300">{item.type}</p>
                      <p className="text-gray-300">{item.year}</p>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Fonts Section */}
      {studio.fonts && (
        <section className="w-full pt-6 bg-gray-50">
          <div className="max-w-screen-2xl mx-auto px-4 ">
            <img src="/assets/Layer 2.png" alt="Fonts Doodle" className="w-64 h-64 object-contain mx-auto " />
            <p className="text-center text-lg mb-2">Handcrafted Typefaces</p>
            <h3 className="text-2xl font-semibold text-center mb-4">
              Phông-chữ <span className="italic">Nhà-làm</span>
            </h3>
            <p className="text-center mb-8">
              Bổn tiệm bán thiết kế nhà làm có tính cá nhân hóa - tất cả túi xách, con chữ và các sản phẩm khác<br></br> đều có thể được tùy chỉnh theo nhu cầu của khách
              
              Được làm từ nguyên liệu 100% hữu cơ (bắp),<br /> nhập mới hàng ngày, đảm bảo chát lượng tốt nhất ngay từ khâu lên ý tưởng.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {studio.fonts.map((item) => (
                <div
                  key={item.id}
                  className=" overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  {/* Brown frame container with refined padding */}
                  <div className="bg-[#2A211C] px-14 py-12">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-82 object-contain"
                    />
                  </div>
                  
                  {/* Info Section */}
                  <div className="py-2 bg-gray-50">
                    <p className="text-gray-700 uppercase">{item.type}</p>
                    <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                    <p className="text-gray-700">từ {item.price}đ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
<div className="border-wrapper">
<button
  className="w-full py-3 bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-colors">
  xem tất cả phông chữ
</button>
</div>

{/* Featured Artworks Section */}
{studio.artworks && (
  <section className="w-full pt-12 bg-white">
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <img src="/assets/Layer 15.png" alt="Arts Doodle" className="w-64 h-64 object-contain mx-auto mb-8" />
      <p className="text-center text-lg mb-2">Home-cooked Illustrations</p>
      <h3 className="text-3xl font-semibold text-center mb-4">
        <span className="italic">Tranh-vẽ</span> Nhà-làm
      </h3>
      <p className="text-center mb-8">
        Bổn tiệm bán thiết kế nhà làm có tính cá nhân hóa - tất cả túi xách, con chữ và các sản phẩm khác<br></br> đều có thể được tùy chỉnh theo nhu cầu của khách
        Được làm từ nguyên liệu 100% hữu cơ (bắp),<br /> nhập mới hàng ngày, đảm bảo chát lượng tốt nhất ngay từ khâu lên ý tưởng.
      </p>
{/* First Row (Square Images) */}
<div className="grid grid-cols-2 gap-0">
  {studio.artworks.slice(0, 2).map((item) => (
    <div
      key={item.id}
      className="overflow-hidden transform transition duration-300"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full object-cover"
        style={{ aspectRatio: '1 / 1', height: 'auto' }} // Ensures the image is square without covering other content
      />
      <div className="p-4">
        <p className="text-gray-700 uppercase">{item.author}</p>
        <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
      </div>
    </div>
  ))}
</div>

{/* Second Row (Vertical Rectangular Images) */}
<div className="grid grid-cols-4 gap-0">
  {studio.artworks.slice(2, 6).map((item) => (
    <div
      key={item.id}
      className="overflow-hidden transform transition duration-300"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full object-cover"
        style={{ width: '100%', height: '700px' }} // Adjust the height for a vertical rectangular shape
      />
      <div className="p-4">
        <p className="text-gray-700 uppercase">{item.author}</p>
        <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
      </div>
    </div>
  ))}
</div>
      </div>
    
  </section>
)}
<div className="border-wrapper">
<button
  className="w-full py-3 bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-colors artworks-button">
  xem tất cả Tranh-vẽ
</button>
</div>

<section
  className="w-full py-32 bg-[#f9f6f1] newsletter"
  style={{ backgroundImage: 'url(/assets/background_sub.png)' }}
>
  <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
    
    {/* Left Half: Subscription Form */}
    <div className="w-full md:w-1/2 flex justify-center items-center">
      <div className="bg-[#fafaf0] border border-gray-200 shadow-md p-12 space-y-8 w-full"> {/* Adjusted padding and width */}
      <h2 className="text-2xl md:text-3xl text-gray-800 font-normal "> {/* Centered text */}
          Subscribe for <br /> <em className="italic font-semibold">Daily Goodness</em> {/* Added line break */}
        </h2>
        <input
  type="text"
  className="w-full px-6 py-3 border-b-2 border-gray-300 focus:border-b-2 focus:border-gray-500 bg-[#eae5db]"
  placeholder="Your name*"
/>
<input
  type="email"
  className="w-full px-6 py-3 border-b-2 border-gray-300 focus:border-b-2 focus:border-gray-500 bg-[#eae5db]"
  placeholder="Your email*"
/>
<div
  style={{
    marginLeft: '-3rem',        // Reduced left margin
    marginRight: '-3rem',       // Reduced right margin
    marginBottom: '-3rem'       // Reduced bottom margin
  }}
>
  <button className="w-full px-4 py-3 bg-[#f1c75d] text-gray-800 font-extrabold hover:bg-yellow-600 transition-colors border-wrapper subscribe-button">
    Subscribe
  </button>
</div>
      </div>
    </div>


    {/* Right Half: Doodle Images */}
    <div className="w-full md:w-1/2 flex flex-wrap justify-center items-center mt-8 md:mt-0 relative">
  <img src="/assets/Layer 2.png" alt="Doodle 1" className="w-32 h-32 object-contain absolute top-0 left-0" />
  <img src="/assets/Layer 2.png" alt="Doodle 2" className="w-32 h-32 object-contain absolute top-0 right-0" />
  <img src="/assets/Layer 2.png" alt="Doodle 3" className="w-32 h-32 object-contain absolute bottom-0 left-0" />
  <img src="/assets/Layer 2.png" alt="Doodle 4" className="w-32 h-32 object-contain absolute bottom-0 right-0" />
</div>
  </div>
</section>
    </Layout>
  );
};

export default StudioHomepage;