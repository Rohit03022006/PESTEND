// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PesticideStore = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Amazon Product Advertising API credentials (you need to get these from Amazon Associates)
//   const ACCESS_KEY = 'YOUR_AMAZON_ACCESS_KEY';
//   const SECRET_KEY = 'YOUR_AMAZON_SECRET_KEY';
//   const ASSOCIATE_TAG = 'YOUR_ASSOCIATE_TAG';

//   useEffect(() => {
//     fetchAmazonProducts();
//   }, []);

//   const fetchAmazonProducts = async () => {
//     try {
//       setLoading(true);
      
//       // In a real implementation, you would make this API call from your backend
//       // to keep your credentials secure
//       const response = await axios.get('/api/amazon-products', {
//         params: {
//           keywords: 'agricultural pesticide organic',
//           searchIndex: 'GardenAndOutdoor',
//           responseGroup: 'Images,ItemAttributes,Offers'
//         }
//       });
      
//       setProducts(response.data.items || []);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//       setError('Failed to load products. Showing sample data.');
//       // Fallback to sample data
//       setProducts(getSampleProducts());
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSampleProducts = () => {
//     return [
//       {
//         ASIN: 'B08XYZEXAMPLE',
//         DetailPageURL: 'https://www.amazon.com/dp/B08XYZEXAMPLE',
//         ItemAttributes: {
//           Title: 'Neem Oil Organic Pesticide',
//           Manufacturer: 'Organic Garden',
//           ListPrice: { FormattedPrice: '₹499' }
//         },
//         ImageSets: {
//           ImageSet: [{ MediumImage: { URL: 'https://images.unsplash.com/photo-1589923188937-cb64779f4abe?w=300&h=200&fit=crop' } }]
//         },
//         Offers: { Offer: { OfferListing: { Price: { FormattedPrice: '₹449' } } } }
//       },
//       {
//         ASIN: 'B09ABCDEXAMPLE',
//         DetailPageURL: 'https://www.amazon.com/dp/B09ABCDEXAMPLE',
//         ItemAttributes: {
//           Title: 'Bayer Advanced Insecticide',
//           Manufacturer: 'Bayer',
//           ListPrice: { FormattedPrice: '₹899' }
//         },
//         ImageSets: {
//           ImageSet: [{ MediumImage: { URL: 'https://images.unsplash.com/photo-1589923188937-cb64779f4abe?w=300&h=200&fit=crop' } }]
//         },
//         Offers: { Offer: { OfferListing: { Price: { FormattedPrice: '₹799' } } } }
//       },
//       {
//         ASIN: 'B10EFGHEXAMPLE',
//         DetailPageURL: 'https://www.amazon.com/dp/B10EFGHEXAMPLE',
//         ItemAttributes: {
//           Title: 'Organic Caterpillar Control',
//           Manufacturer: 'EcoGardener',
//           ListPrice: { FormattedPrice: '₹379' }
//         },
//         ImageSets: {
//           ImageSet: [{ MediumImage: { URL: 'https://images.unsplash.com/photo-1589923188937-cb64779f4abe?w=300&h=200&fit=crop' } }]
//         },
//         Offers: { Offer: { OfferListing: { Price: { FormattedPrice: '₹349' } } } }
//       },
//       {
//         ASIN: 'B11HIJKLEXAMPLE',
//         DetailPageURL: 'https://www.amazon.com/dp/B11HIJKLEXAMPLE',
//         ItemAttributes: {
//           Title: 'DAP Fertilizer with Pesticide',
//           Manufacturer: 'PlantCare',
//           ListPrice: { FormattedPrice: '₹649' }
//         },
//         ImageSets: {
//           ImageSet: [{ MediumImage: { URL: 'https://images.unsplash.com/photo-1589923188937-cb64779f4abe?w=300&h=200&fit=crop' } }]
//         },
//         Offers: { Offer: { OfferListing: { Price: { FormattedPrice: '₹599' } } } }
//       }
//     ];
//   };

//   const handleRedirect = (url) => {
//     window.open(url, '_blank', 'noopener,noreferrer');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-10">
//             <h1 className="text-3xl font-bold text-green-600 mb-3">Pesticide Store</h1>
//             <p className="text-gray-600">Loading products...</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
//                 <div className="h-48 bg-gray-300"></div>
//                 <div className="p-4">
//                   <div className="h-6 bg-gray-300 rounded mb-2"></div>
//                   <div className="h-4 bg-gray-300 rounded mb-3"></div>
//                   <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
//                   <div className="h-10 bg-gray-300 rounded mb-2"></div>
//                   <div className="h-10 bg-gray-300 rounded"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-bold text-green-600 mb-3">Pesticide Store</h1>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Recommended pesticides for your crop issues. Purchase from trusted partners.
//           </p>
//           {error && (
//             <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {products.map((product, index) => (
//             <div key={product.ASIN || index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//               <div className="h-48 bg-gray-200 overflow-hidden">
//                 <img 
//                   src={product.ImageSets?.ImageSet?.[0]?.MediumImage?.URL || "https://images.unsplash.com/photo-1589923188937-cb64779f4abe?w=300&h=200&fit=crop"} 
//                   alt={product.ItemAttributes?.Title || "Pesticide product"}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
              
//               <div className="p-4">
//                 <h3 className="font-semibold text-lg text-gray-800 mb-2">
//                   {product.ItemAttributes?.Title || "Agricultural Pesticide"}
//                 </h3>
//                 <p className="text-gray-600 text-sm mb-3">
//                   {product.ItemAttributes?.Manufacturer || "Trusted brand"}
//                 </p>
//                 <p className="text-green-700 font-bold text-xl mb-4">
//                   {product.Offers?.Offer?.OfferListing?.Price?.FormattedPrice || 
//                    product.ItemAttributes?.ListPrice?.FormattedPrice || 
//                    "₹---"}
//                 </p>
                
//                 <div className="flex flex-col gap-2">
//                   <button
//                     onClick={() => handleRedirect(product.DetailPageURL)}
//                     className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
//                   >
//                     Buy on Amazon
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-12 bg-white rounded-lg shadow-md p-6 border-2">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Important Note</h2>
//           <p className="text-gray-600 mb-3">
//             Always read and follow the instructions on the pesticide label carefully. 
//             Use protective equipment as recommended and avoid using pesticides during 
//             windy conditions or when bees are active.
//           </p>
//           <p className="text-gray-600">
//             These recommendations are based on common crop issues. For specific advice 
//             tailored to your situation, consult with an agricultural expert.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PesticideStore;


import React, { useState, useEffect } from 'react';

const PesticideStore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setProducts(getSampleProducts());
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getSampleProducts = () => {
    return [
      {
        id: 1,
        name: "Neem Oil Organic Pesticide",
        description: "100% cold pressed neem oil for organic gardening, safe for vegetables and fruits",
        price: "₹499",
        originalPrice: "₹599",
        discount: "17% off",
        amazonLink: "https://www.amazon.in/s?k=neem+oil+organic+pesticide",
        flipkartLink: "https://www.flipkart.com/search?q=neem+oil+organic+pesticide",
        image: "https://images.unsplash.com/photo-1589923188937-cb64779f4abe?w=400&h=300&fit=crop",
        rating: 4.3,
        reviews: 128
      },
      {
        id: 2,
        name: "Bayer Advanced Insecticide",
        description: "Systemic insecticide for long-lasting protection against common pests",
        price: "₹899",
        originalPrice: "₹999",
        discount: "10% off",
        amazonLink: "https://www.amazon.in/s?k=bayer+advanced+insecticide",
        flipkartLink: "https://www.flipkart.com/search?q=bayer+advanced+insecticide",
        image: "https://images.unsplash.com/photo-1591955506264-3f5a6834570a?w=400&h=300&fit=crop",
        rating: 4.5,
        reviews: 89
      },
      {
        id: 3,
        name: "DAP Fertilizer with Pesticide",
        description: "Combination fertilizer and pesticide for complete plant care and growth",
        price: "₹649",
        originalPrice: "₹749",
        discount: "13% off",
        amazonLink: "https://www.amazon.in/s?k=dap+fertilizer+with+pesticide",
        flipkartLink: "https://www.flipkart.com/search?q=dap+fertilizer+with+pesticide",
        image: "https://images.unsplash.com/photo-1517191430049-5e067f58e2f5?w=400&h=300&fit=crop",
        rating: 4.2,
        reviews: 156
      },
      {
        id: 4,
        name: "Organic Caterpillar Control",
        description: "Safe for vegetables and fruits, organic certified caterpillar control",
        price: "₹379",
        originalPrice: "₹449",
        discount: "16% off",
        amazonLink: "https://www.amazon.in/s?k=organic+caterpillar+control",
        flipkartLink: "https://www.flipkart.com/search?q=organic+caterpillar+control",
        image: "https://images.unsplash.com/photo-1563213126-a4273f7b4cfa?w=400&h=300&fit=crop",
        rating: 4.1,
        reviews: 203
      },
      {
        id: 5,
        name: "Fungicide Powder for Plants",
        description: "Effective against fungal diseases, safe for most plants and vegetables",
        price: "₹299",
        originalPrice: "₹399",
        discount: "25% off",
        amazonLink: "https://www.amazon.in/s?k=fungicide+powder+for+plants",
        flipkartLink: "https://www.flipkart.com/search?q=fungicide+powder+for+plants",
        image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400&h=300&fit=crop",
        rating: 4.4,
        reviews: 167
      },
      {
        id: 6,
        name: "Weed Killer Herbicide",
        description: "Fast-acting weed killer for agricultural and garden use",
        price: "₹549",
        originalPrice: "₹699",
        discount: "21% off",
        amazonLink: "https://www.amazon.in/s?k=weed+killer+herbicide",
        flipkartLink: "https://www.flipkart.com/search?q=weed+killer+herbicide",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
        rating: 4.0,
        reviews: 94
      },
      {
        id: 7,
        name: "Plant Growth Promoter",
        description: "Organic plant growth promoter with essential nutrients",
        price: "₹429",
        originalPrice: "₹549",
        discount: "22% off",
        amazonLink: "https://www.amazon.in/s?k=plant+growth+promoter",
        flipkartLink: "https://www.flipkart.com/search?q=plant+growth+promoter",
        image: "https://images.unsplash.com/photo-1463320898484-cdee8141c787?w=400&h=300&fit=crop",
        rating: 4.6,
        reviews: 312
      },
      {
        id: 8,
        name: "Natural Pest Repellent",
        description: "Eco-friendly pest repellent made from natural ingredients",
        price: "₹389",
        originalPrice: "₹499",
        discount: "22% off",
        amazonLink: "https://www.amazon.in/s?k=natural+pest+repellent",
        flipkartLink: "https://www.flipkart.com/search?q=natural+pest+repellent",
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop",
        rating: 4.2,
        reviews: 178
      }
    ];
  };

  const handleRedirect = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-green-600 mb-3">Pesticide Store</h1>
            <p className="text-gray-600">Loading products...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded mb-2"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-green-600 mb-3">Pesticide Store</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Recommended pesticides for your crop issues. Purchase from trusted partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              <div className="p-4 flex-grow">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>
                
                <div className="flex items-center mb-4">
                  <p className="text-green-700 font-bold text-xl mr-2">{product.price}</p>
                  <p className="text-gray-500 text-sm line-through">{product.originalPrice}</p>
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                    {product.discount}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2 mt-auto">
                  <button
                    onClick={() => handleRedirect(product.amazonLink)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    Buy on Amazon
                  </button>
                  <button
                    onClick={() => handleRedirect(product.flipkartLink)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    Buy on Flipkart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Important Note</h2>
          <p className="text-gray-600 mb-3">
            Always read and follow the instructions on the pesticide label carefully. 
            Use protective equipment as recommended and avoid using pesticides during 
            windy conditions or when bees are active.
          </p>
          <p className="text-gray-600">
            These recommendations are based on common crop issues. For specific advice 
            tailored to your situation, consult with an agricultural expert.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PesticideStore;