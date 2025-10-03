// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "cdn.sanity.io",
//         port: "",
//         pathname: "/images/**",
//       },
//       {
//         protocol: "https",
//         hostname: "gravatar.com",
//         port: "",
//         pathname: "/avatar/**",
//       },
//       {
//         protocol: 'https',
//         hostname: 'cdn.sanity.io',
//         port: '',
//         pathname: '/images/**',
//       },
//     ],
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  output:"standalone",
    images: {
      remotePatterns: [
        {
            protocol: "http",
            hostname: "i.annihil.us",
            port: "",
            pathname: "/u/prod/marvel/**",
          },
          {
            protocol: "https",
            hostname: "image.tmdb.org",
            port: "",
            pathname: "/t/p/original/**",
          },
        {
          protocol: "https",
          hostname: "gravatar.com",
          port: "",
          pathname: "/avatar/**",
        },
        {
          protocol: "https",
          hostname: "avatars.githubusercontent.com",
          port: "",
          pathname: "/u/**",
        },
      ],
    },
  };
  
  export default nextConfig;
  