// "use client";
// import React, { useState, useEffect, useRef, useContext } from "react";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import Image from "next/image";
// import YouTube from "react-youtube";
// import { IconButton, CircularProgress, Button } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import axios from "axios";
// import { SavedContext } from "@/context/SavedItems";
// import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

// const Entertainment = ({ isUserAuthenticated }) => {
//   // Data and loading states
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Search and toggle states
//   const [entertainmentSearch, setEntertainmentSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [showAll, setShowAll] = useState(false);
//   const [visibleItems, setVisibleItems] = useState(10);

//   // Dialog state for showing details and trailer
//   const [open, setOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [trailerKey, setTrailerKey] = useState(null);

//   // Recommendation states
//   const [recommendations, setRecommendations] = useState([]);
//   const [recommendationsLoading, setRecommendationsLoading] = useState(false);

//   const dialogContentRef = useRef(null);

//   // Get saved items and toggle function from context
//   const { savedItems, toggleSaveItem } = useContext(SavedContext);

//   // Helper to generate a unique id for an item.
//   // If the item already has an id and it's unique, it returns that.
//   // Otherwise, it creates a composite key using type, title, and index.
//   const getItemUniqueId = (item, index) => {
//     return item.uniqueId || item.id || `${item.type}-${item.title}-${index}`;
//   };

//   // Helper function to check if an item is saved (using the unique id)
//   const isItemSaved = (item, index) => {
//     const uniqueId = getItemUniqueId(item, index);
//     return savedItems.some((saved) => saved.id === uniqueId);
//   };

//   // Load entertainment items on mount
//   useEffect(() => {
//     async function loadEntertainment() {
//       try {
//         const res = await fetch("/api/entertainment", { cache: "force-cache" });
//         if (!res.ok) throw new Error("Failed to fetch entertainment data");
//         const data = await res.json();
//         setItems(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching entertainment:", error);
//         setLoading(false);
//       }
//     }
//     loadEntertainment();
//   }, []);

//   // Clear search results when input is cleared
//   useEffect(() => {
//     if (!entertainmentSearch) {
//       setSearchResults([]);
//     }
//   }, [entertainmentSearch]);

//   // Toggle between limited view and full grid view
//   const toggleView = () => {
//     setShowAll((prev) => {
//       const newShowAll = !prev;
//       setVisibleItems(newShowAll ? items.length : 10);
//       return newShowAll;
//     });
//   };

//   // Handle search form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("/api/entertainmentsearch", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query: entertainmentSearch }),
//       });
//       if (!res.ok) throw new Error("Failed to fetch search results");
//       const searchData = await res.json();
//       setSearchResults(searchData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching search data:", error);
//       setLoading(false);
//     }
//   };

//   // Clear the search input and results
//   const clearSearch = () => {
//     setEntertainmentSearch("");
//     setSearchResults([]);
//   };

//   // Decide which items to render
//   const itemsToRender =
//     searchResults.length > 0 ? searchResults : items.slice(0, visibleItems);

//   // Render an entertainment card; if not authenticated, wrap in LoginLink.
//   const renderEntertainmentCard = (item) => {
//     const cardContent = (
//       <div
//         className="cursor-pointer p-2 relative"
//         onClick={() => {
//           if (!isUserAuthenticated) return;
//           handleClickOpen(item);
//         }}
//       >
//         <img
//           className="w-full h-[20vh] md:h-[30vh] object-cover rounded-lg transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-500 dark:hover:shadow-gray-300"
//           src={
//             item.poster_path
//               ? `https://image.tmdb.org/t/p/original${item.poster_path}`
//               : "/placeholder.webp"
//           }
//           alt={item.title || item.name}
//         />
//         {/* Overlay for Save Icon on grid */}
//         <div
//           className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 rounded-full cursor-pointer"
//           onClick={(e) => {
//             e.stopPropagation();
//             if (!isUserAuthenticated) return;
//             // Pass the item as-is; it may already have an id,
//             // or later we assign a uniqueId below.
//             toggleSaveItem(item);
//           }}
//         >
//           {isItemSaved(item) ? (
//             <FaHeart className="text-red-500" size={24} />
//           ) : (
//             <FaRegHeart className="text-red-500" size={24} />
//           )}
//         </div>
//       </div>
//     );

//     return isUserAuthenticated ? cardContent : <LoginLink>{cardContent}</LoginLink>;
//   };

//   // Fetch trailer and recommendations when an item is clicked
//   const handleClickOpen = async (item) => {
//     if (!isUserAuthenticated) return;
//     // For entertainment items, assign a uniqueId if not present.
//     const uniqueItem = { ...item, uniqueId: item.id || getItemUniqueId(item) };
//     setSelectedItem(uniqueItem);
//     setOpen(true);
//     setTrailerKey(null);
//     setRecommendations([]); // clear previous recommendations
//     try {
//       const trailerResponse = await axios.post("/api/trailer", {
//         media_type: item.type,
//         id: item.id,
//       });
//       setTrailerKey(trailerResponse.data.trailerKey);
//     } catch (error) {
//       console.error("Failed to fetch trailer:", error);
//     }
//     // Fetch recommendations
//     fetchEntertainmentRecommendations(uniqueItem);
//   };

//   // Fetch recommendations from /api/entertainmentrecommendation endpoint
//   const fetchEntertainmentRecommendations = async (item) => {
//     setRecommendationsLoading(true);
//     try {
//       const res = await fetch("/api/entertainmentrecommendation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           itemDetails: {
//             title: item.title || item.name,
//             type: item.type, // or use a default like "movie" if needed
//             description: item.overview,
//           },
//         }),
//       });
//       const data = await res.json();
//       // Map through recommendations and assign a uniqueId if necessary.
//       const recsWithIds = data.recommendations.map((rec, index) => ({
//         ...rec,
//         uniqueId: rec.id || `${rec.type}-${rec.title}-${index}`,
//       }));
//       setRecommendations(recsWithIds);
//     } catch (error) {
//       console.error("Failed to fetch entertainment recommendations:", error);
//     } finally {
//       setRecommendationsLoading(false);
//     }
//   };

//   // Close the dialog (clear state after transition)
//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div className="w-full bg-gray-100 dark:bg-black h-full font-poppins pt-8 text-black dark:text-white">
//       {/* Header */}
//       <div className="p-5 flex justify-between items-center">
//         <h1 className="font-semibold text-gray-600 dark:text-gray-300 text-[3vmin] md:text-[3vmin]">
//           Browse Featured
//           <span className="text-black dark:text-gray-100 font-bold block md:inline-block">
//             &nbsp;Titles
//           </span>
//         </h1>
//         <button
//           onClick={toggleView}
//           className="bg-gray-400 dark:bg-gray-700 py-2 px-2 rounded-md text-black dark:text-white text-[2vmin] hover:bg-gray-200 dark:hover:bg-gray-600"
//         >
//           {showAll ? "View Less" : "View All"}
//         </button>
//       </div>

//       {/* Search form */}
//       {showAll && (
//         <div className="w-full flex justify-end px-5">
//           <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
//             <input
//               className="w-full bg-transparent border-b focus:outline-none text-black dark:text-white"
//               type="text"
//               placeholder="Search movies or TV shows..."
//               value={entertainmentSearch}
//               onChange={(e) => setEntertainmentSearch(e.target.value)}
//             />
//             {entertainmentSearch && (
//               <button type="button" onClick={clearSearch}>
//                 <AiOutlineClose className="text-lg text-red-500" />
//               </button>
//             )}
//             <button
//               type="submit"
//               className="bg-green-500 hover:bg-green-700 text-sm text-white py-1 px-2 rounded"
//             >
//               <AiOutlineSearch className="text-lg" />
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Items display */}
//       {loading ? (
//         <div className="flex justify-center items-center h-[40vh]">
//           <CircularProgress />
//         </div>
//       ) : (
//         <div
//           className={`w-full px-8 scrollbar-hidden ${
//             showAll
//               ? "grid grid-cols-3 gap-4"
//               : "flex overflow-x-auto scrollbar-hidden space-x-4 md:h-[40vh]"
//           } items-center`}
//         >
//           {itemsToRender.map((item, index) => (
//             <div
//               key={index}
//               className={`cursor-pointer p-2 ${
//                 showAll ? "w-[30vw]" : "w-[35vw] flex-shrink-0"
//               } relative`}
//               onClick={() => handleClickOpen(item)}
//             >
//               {renderEntertainmentCard(item)}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal for item details */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="md"
//         fullWidth={true}
//         className="rounded-lg p-4"
//         TransitionProps={{
//           onExited: () => {
//             // Clear modal state after transition completes
//             setSelectedItem(null);
//             setTrailerKey(null);
//             setRecommendations([]);
//           },
//         }}
//       >
//         <DialogTitle className="flex dark:text-white items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-2">
//           {/* Save Toggle on left */}
//           {selectedItem && (
//             <Button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (!isUserAuthenticated) return;
//                 toggleSaveItem(selectedItem);
//               }}
//               className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded px-2"
//             >
//               {savedItems.some(
//                 (saved) =>
//                   saved.id ===
//                   (selectedItem.uniqueId || selectedItem.id)
//               )
//                 ? "Saved"
//                 : "Save"}
//             </Button>
//           )}
//           {/* Title in center */}
//           <span className="flex-1 text-center font-poppins font-semibold text-[3.5vmin]">
//             {selectedItem?.title || selectedItem?.name}
//           </span>
//           {/* Close Button on right */}
//           <IconButton aria-label="close" onClick={handleClose} className="ml-2">
//             <CloseIcon className="text-red-500" />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent
//           className="flex flex-col items-center bg-white dark:bg-gray-800"
//           ref={dialogContentRef}
//         >
//           {selectedItem && (
//             <>
//               <div className="flex items-center">
//                 {trailerKey ? (
//                   <YouTube videoId={trailerKey} className="w-full h-full" />
//                 ) : (
//                   <Image
//                     src={
//                       selectedItem.poster_path
//                         ? `https://image.tmdb.org/t/p/original${selectedItem.poster_path}`
//                         : "/placeholder.webp"
//                     }
//                     width={500}
//                     height={500}
//                     layout="responsive"
//                     priority={true}
//                     alt={selectedItem.title || selectedItem.name}
//                   />
//                 )}
//               </div>
//               <p className="p-5 dark:text-white">
//                 {selectedItem.overview || "No description available"}
//               </p>

//               {/* Recommendation Section */}
//               <div className="w-full mt-4">
//                 <h2 className="text-center font-semibold text-[3vmin] mb-2">
//                   You Might Also Like
//                 </h2>
//                 {recommendationsLoading ? (
//                   <div className="flex justify-center items-center">
//                     <CircularProgress />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col md:flex-row overflow-x-scroll gap-4 px-4">
//                     {recommendations.map((rec, index) => {
//                       // Generate a unique id for each recommendation
//                       const uniqueId = getItemUniqueId(rec, index);
//                       const recWithUnique = { ...rec, uniqueId };
//                       return (
//                         <div
//                           key={index}
//                           className="w-full md:w-[30vw] bg-gray-200 rounded-lg relative flex-shrink-0 cursor-pointer transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-black p-4"
//                           onClick={() => setSelectedItem(recWithUnique)}
//                         >
//                           <h3 className="pb-2 text-lg font-medium">
//                             {rec.title}
//                           </h3>
//                           <p className="pb-2 text-sm">
//                             <strong>Type:</strong> {rec.type}
//                           </p>
//                           <p className="pb-2 text-sm">
//                             <strong>Description:</strong>{" "}
//                             {rec.description.slice(0, 50)}...
//                           </p>
//                           {rec.poster_path ? (
//                             <img
//                               className="w-full h-auto object-cover rounded"
//                               src={`https://image.tmdb.org/t/p/original${rec.poster_path}`}
//                               alt={rec.title}
//                             />
//                           ) : (
//                             <div className="w-full h-[100px] bg-gray-400 flex items-center justify-center">
//                               No Image
//                             </div>
//                           )}
//                           {/* Recommendation Save Icon */}
//                           <IconButton
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               toggleSaveItem(recWithUnique);
//                             }}
//                             className="absolute top-2 right-2"
//                           >
//                             {isItemSaved(recWithUnique, index) ? (
//                               <FaHeart className="text-red-500" size={24} />
//                             ) : (
//                               <FaRegHeart className="text-red-500" size={24} />
//                             )}
//                           </IconButton>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Entertainment;





// "use client";
// import React, { useState, useEffect, useRef, useContext } from "react";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import Image from "next/image";
// import YouTube from "react-youtube";
// import { IconButton, CircularProgress, Button } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { SavedContext } from "@/context/SavedItems";
// import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

// const Entertainment = ({ isUserAuthenticated }) => {
//   // Data and loading states
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Search and toggle states
//   const [entertainmentSearch, setEntertainmentSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [showAll, setShowAll] = useState(false);
//   const [visibleItems, setVisibleItems] = useState(10);

//   // Dialog state for showing details and trailer
//   const [open, setOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [trailerKey, setTrailerKey] = useState(null);

//   // Recommendation states
//   const [recommendations, setRecommendations] = useState([]);
//   const [recommendationsLoading, setRecommendationsLoading] = useState(false);

//   const dialogContentRef = useRef(null);

//   // Get saved items and toggle function from context
//   const { savedItems, toggleSaveItem } = useContext(SavedContext);

//   // Helper to generate a unique id for an item.
//   const getItemUniqueId = (item, index) => {
//     return item.uniqueId || item.id || `${item.type}-${item.title}-${index}`;
//   };

//   // Helper function to check if an item is saved (using the unique id)
//   const isItemSaved = (item, index) => {
//     const uniqueId = getItemUniqueId(item, index);
//     return savedItems.some((saved) => saved.id === uniqueId);
//   };

//   // This function fetches the trailer key if missing and then calls the save toggle.
//   const toggleSaveItemWithTrailer = async (item) => {
//     // Use the existing id or uniqueId for consistency.
//     const uniqueId = item.uniqueId || item.id;
//     // Check if the item is an entertainment item and if the trailer key is missing.
//     if ((item.type === "movie" || item.type === "tv series") && !item.trailerKey) {
//       try {
//         const response = await fetch("/api/trailer", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ media_type: item.type, id: item.id }),
//         });
//         const data = await response.json();
//         item = { ...item, trailerKey: data.trailerKey };
//       } catch (error) {
//         console.error("Error fetching trailer key:", error);
//       }
//     }
//     // Now call the save toggle with the enriched item.
//     toggleSaveItem(item);
//   };

//   // Load entertainment items on mount
//   useEffect(() => {
//     async function loadEntertainment() {
//       try {
//         const res = await fetch("/api/entertainment", { cache: "force-cache" });
//         if (!res.ok) throw new Error("Failed to fetch entertainment data");
//         const data = await res.json();
//         setItems(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching entertainment:", error);
//         setLoading(false);
//       }
//     }
//     loadEntertainment();
//   }, []);

//   // Clear search results when input is cleared
//   useEffect(() => {
//     if (!entertainmentSearch) {
//       setSearchResults([]);
//     }
//   }, [entertainmentSearch]);

//   // Toggle between limited view and full grid view
//   const toggleView = () => {
//     setShowAll((prev) => {
//       const newShowAll = !prev;
//       setVisibleItems(newShowAll ? items.length : 10);
//       return newShowAll;
//     });
//   };

//   // Handle search form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("/api/entertainmentsearch", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query: entertainmentSearch }),
//       });
//       if (!res.ok) throw new Error("Failed to fetch search results");
//       const searchData = await res.json();
//       setSearchResults(searchData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching search data:", error);
//       setLoading(false);
//     }
//   };

//   // Clear the search input and results
//   const clearSearch = () => {
//     setEntertainmentSearch("");
//     setSearchResults([]);
//   };

//   // Decide which items to render
//   const itemsToRender =
//     searchResults.length > 0 ? searchResults : items.slice(0, visibleItems);

//   // Render an entertainment card; if not authenticated, wrap in LoginLink.
//   const renderEntertainmentCard = (item) => {
//     const cardContent = (
//       <div
//         className="cursor-pointer p-2 relative"
//         onClick={() => {
//           if (!isUserAuthenticated) return;
//           handleClickOpen(item);
//         }}
//       >
//         <img
//           className="w-full h-[20vh] md:h-[30vh] object-cover rounded-lg transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-500 dark:hover:shadow-gray-300"
//           src={
//             item.poster_path
//               ? `https://image.tmdb.org/t/p/original${item.poster_path}`
//               : "/placeholder.webp"
//           }
//           alt={item.title || item.name}
//         />
//         {/* Overlay for Save Icon on grid */}
//         <div
//           className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 rounded-full cursor-pointer"
//           onClick={(e) => {
//             e.stopPropagation();
//             if (!isUserAuthenticated) return;
//             toggleSaveItemWithTrailer(item);
//           }}
//         >
//           {isItemSaved(item) ? (
//             <FaHeart className="text-red-500" size={24} />
//           ) : (
//             <FaRegHeart className="text-red-500" size={24} />
//           )}
//         </div>
//       </div>
//     );

//     return isUserAuthenticated ? cardContent : <LoginLink>{cardContent}</LoginLink>;
//   };

//   // Fetch trailer and recommendations when an item is clicked
//   const handleClickOpen = async (item) => {
//     if (!isUserAuthenticated) return;
//     const uniqueItem = { ...item, uniqueId: item.id || getItemUniqueId(item) };
//     setSelectedItem(uniqueItem);
//     setOpen(true);
//     setTrailerKey(null);
//     setRecommendations([]);
//     try {
//       const trailerResponse = await fetch("/api/trailer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ media_type: item.type, id: item.id }),
//       });
//       const trailerData = await trailerResponse.json();
//       setTrailerKey(trailerData.trailerKey);
//     } catch (error) {
//       console.error("Failed to fetch trailer:", error);
//     }
//     fetchEntertainmentRecommendations(uniqueItem);
//   };

//   // Fetch recommendations from /api/entertainmentrecommendation endpoint
//   const fetchEntertainmentRecommendations = async (item) => {
//     setRecommendationsLoading(true);
//     try {
//       const res = await fetch("/api/entertainmentrecommendation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           itemDetails: {
//             title: item.title || item.name,
//             type: item.type,
//             description: item.overview,
//           },
//         }),
//       });
//       const data = await res.json();
//       const recsWithIds = data.recommendations.map((rec, index) => ({
//         ...rec,
//         uniqueId: rec.id || `${rec.type}-${rec.title}-${index}`,
//       }));
//       setRecommendations(recsWithIds);
//     } catch (error) {
//       console.error("Failed to fetch entertainment recommendations:", error);
//     } finally {
//       setRecommendationsLoading(false);
//     }
//   };

//   // Close the dialog (clear state after transition)
//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <div className="w-full bg-gray-100 dark:bg-black h-full font-poppins pt-8 text-black dark:text-white">
//       {/* Header */}
//       <div className="p-5 flex justify-between items-center">
//         <h1 className="font-semibold text-gray-600 dark:text-gray-300 text-[3vmin] md:text-[3vmin]">
//           Browse Featured
//           <span className="text-black dark:text-gray-100 font-bold block md:inline-block">
//             &nbsp;Titles
//           </span>
//         </h1>
//         <button
//           onClick={toggleView}
//           className="bg-gray-400 dark:bg-gray-700 py-2 px-2 rounded-md text-black dark:text-white text-[2vmin] hover:bg-gray-200 dark:hover:bg-gray-600"
//         >
//           {showAll ? "View Less" : "View All"}
//         </button>
//       </div>

//       {/* Search form */}
//       {showAll && (
//         <div className="w-full flex justify-end px-5">
//           <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
//             <input
//               className="w-full bg-transparent border-b focus:outline-none text-black dark:text-white"
//               type="text"
//               placeholder="Search movies or TV shows..."
//               value={entertainmentSearch}
//               onChange={(e) => setEntertainmentSearch(e.target.value)}
//             />
//             {entertainmentSearch && (
//               <button type="button" onClick={clearSearch}>
//                 <AiOutlineClose className="text-lg text-red-500" />
//               </button>
//             )}
//             <button
//               type="submit"
//               className="bg-green-500 hover:bg-green-700 text-sm text-white py-1 px-2 rounded"
//             >
//               <AiOutlineSearch className="text-lg" />
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Items display */}
//       {loading ? (
//         <div className="flex justify-center items-center h-[40vh]">
//           <CircularProgress />
//         </div>
//       ) : (
//         <div
//           className={`w-full px-8 scrollbar-hidden ${
//             showAll
//               ? "grid grid-cols-3 gap-4"
//               : "flex overflow-x-auto scrollbar-hidden space-x-4 md:h-[40vh]"
//           } items-center`}
//         >
//           {itemsToRender.map((item, index) => (
//             <div
//               key={index}
//               className={`cursor-pointer p-2 ${
//                 showAll ? "w-[30vw]" : "w-[35vw] flex-shrink-0"
//               } relative`}
//               onClick={() => handleClickOpen(item)}
//             >
//               {renderEntertainmentCard(item)}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal for item details */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="md"
//         fullWidth={true}
//         className="rounded-lg p-4"
//         TransitionProps={{
//           onExited: () => {
//             setSelectedItem(null);
//             setTrailerKey(null);
//             setRecommendations([]);
//           },
//         }}
//       >
//         <DialogTitle className="flex dark:text-white items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-2">
//           {selectedItem && (
//             <Button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (!isUserAuthenticated) return;
//                 toggleSaveItemWithTrailer(selectedItem);
//               }}
//               className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded px-2"
//             >
//               {savedItems.some(
//                 (saved) =>
//                   saved.id === (selectedItem.uniqueId || selectedItem.id)
//               )
//                 ? "Saved"
//                 : "Save"}
//             </Button>
//           )}
//           <span className="flex-1 text-center font-poppins font-semibold text-[3.5vmin]">
//             {selectedItem?.title || selectedItem?.name}
//           </span>
//           <IconButton aria-label="close" onClick={handleClose} className="ml-2">
//             <CloseIcon className="text-red-500" />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent
//           className="flex flex-col items-center bg-white dark:bg-gray-800"
//           ref={dialogContentRef}
//         >
//           {selectedItem && (
//             <>
//               <div className="flex items-center">
//                 {trailerKey ? (
//                   <YouTube videoId={trailerKey} className="w-full h-full" />
//                 ) : (
//                   <Image
//                     src={
//                       selectedItem.poster_path
//                         ? `https://image.tmdb.org/t/p/original${selectedItem.poster_path}`
//                         : "/placeholder.webp"
//                     }
//                     width={500}
//                     height={500}
//                     layout="responsive"
//                     priority={true}
//                     alt={selectedItem.title || selectedItem.name}
//                   />
//                 )}
//               </div>
//               <p className="p-5 dark:text-white">
//                 {selectedItem.overview || "No description available"}
//               </p>

//               {/* Recommendation Section */}
//               <div className="w-full mt-4">
//                 <h2 className="text-center font-semibold text-[3vmin] mb-2">
//                   You Might Also Like
//                 </h2>
//                 {recommendationsLoading ? (
//                   <div className="flex justify-center items-center">
//                     <CircularProgress />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col md:flex-row overflow-x-scroll gap-4 px-4">
//                     {recommendations.map((rec, index) => {
//                       const uniqueId = getItemUniqueId(rec, index);
//                       const recWithUnique = { ...rec, uniqueId };
//                       return (
//                         <div
//                           key={index}
//                           className="w-full md:w-[30vw] bg-gray-200 rounded-lg relative flex-shrink-0 cursor-pointer transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-black p-4"
//                           onClick={() => setSelectedItem(recWithUnique)}
//                         >
//                           <h3 className="pb-2 text-lg font-medium">{rec.title}</h3>
//                           <p className="pb-2 text-sm">
//                             <strong>Type:</strong> {rec.type}
//                           </p>
//                           <p className="pb-2 text-sm">
//                             <strong>Description:</strong> {rec.description.slice(0, 50)}...
//                           </p>
//                           {rec.poster_path ? (
//                             <img
//                               className="w-full h-auto object-cover rounded"
//                               src={`https://image.tmdb.org/t/p/original${rec.poster_path}`}
//                               alt={rec.title}
//                             />
//                           ) : (
//                             <div className="w-full h-[100px] bg-gray-400 flex items-center justify-center">
//                               No Image
//                             </div>
//                           )}
//                           <IconButton
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               toggleSaveItemWithTrailer(recWithUnique);
//                             }}
//                             className="absolute top-2 right-2"
//                           >
//                             {isItemSaved(recWithUnique, index) ? (
//                               <FaHeart className="text-red-500" size={24} />
//                             ) : (
//                               <FaRegHeart className="text-red-500" size={24} />
//                             )}
//                           </IconButton>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Entertainment;





"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Image from "next/image";
import YouTube from "react-youtube";
import { IconButton, CircularProgress, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { SavedContext } from "@/context/SavedItems";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

const Entertainment = ({ isUserAuthenticated }) => {
  // Data and loading states
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and toggle states
  const [entertainmentSearch, setEntertainmentSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleItems, setVisibleItems] = useState(10);

  // Dialog state for showing details and trailer
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  // Recommendation states
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  const dialogContentRef = useRef(null);

  // Get saved items and toggle function from context
  const { savedItems, toggleSaveItem } = useContext(SavedContext);

  // Helper to generate a unique id for an item.
  const getItemUniqueId = (item, index) => {
    return item.uniqueId || item.id || `${item.type}-${item.title}-${index}`;
  };

  // Helper function to check if an item is saved (using the unique id)
  const isItemSaved = (item, index) => {
    const uniqueId = getItemUniqueId(item, index);
    return savedItems.some((saved) => saved.id === uniqueId);
  };

  // This function fetches the trailer key if missing and then calls the save toggle.
  const toggleSaveItemWithTrailer = async (item) => {
    // Use the existing id or uniqueId for consistency.
    const uniqueId = item.uniqueId || item.id;
    // Check if the item is an entertainment item and if the trailer key is missing.
    if ((item.type === "movie" || item.type === "tv series") && !item.trailerKey) {
      try {
        const response = await fetch("/api/trailer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ media_type: item.type, id: item.id }),
        });
        const data = await response.json();
        item = { ...item, trailerKey: data.trailerKey };
      } catch (error) {
        console.error("Error fetching trailer key:", error);
      }
    }
    // Now call the save toggle with the enriched item.
    toggleSaveItem(item);
  };

  // Load entertainment items on mount
  useEffect(() => {
    async function loadEntertainment() {
      try {
        const res = await fetch("/api/entertainment", { cache: "force-cache" });
        if (!res.ok) throw new Error("Failed to fetch entertainment data");
        const data = await res.json();
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching entertainment:", error);
        setLoading(false);
      }
    }
    loadEntertainment();
  }, []);

  // Clear search results when input is cleared
  useEffect(() => {
    if (!entertainmentSearch) {
      setSearchResults([]);
    }
  }, [entertainmentSearch]);

  // Toggle between limited view and full grid view
  const toggleView = () => {
    setShowAll((prev) => {
      const newShowAll = !prev;
      setVisibleItems(newShowAll ? items.length : 10);
      return newShowAll;
    });
  };

  // Handle search form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/entertainmentsearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: entertainmentSearch }),
      });
      if (!res.ok) throw new Error("Failed to fetch search results");
      const searchData = await res.json();
      setSearchResults(searchData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search data:", error);
      setLoading(false);
    }
  };

  // Clear the search input and results
  const clearSearch = () => {
    setEntertainmentSearch("");
    setSearchResults([]);
  };

  // Decide which items to render
  const itemsToRender =
    searchResults.length > 0 ? searchResults : items.slice(0, visibleItems);

  // Render an entertainment card; if not authenticated, wrap in LoginLink.
  const renderEntertainmentCard = (item) => {
    const cardContent = (
      <div
        className="cursor-pointer p-2 relative"
        onClick={() => {
          if (!isUserAuthenticated) return;
          handleClickOpen(item);
        }}
      >
        <img
          className="w-full h-[20vh] md:h-[30vh] object-cover rounded-lg transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-500 dark:hover:shadow-gray-300"
          src={
            item.poster_path
              ? `https://image.tmdb.org/t/p/original${item.poster_path}`
              : "/placeholder.webp"
          }
          alt={item.title || item.name}
        />
        {/* Overlay for Save Icon on grid */}
        <div
          className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (!isUserAuthenticated) return;
            toggleSaveItemWithTrailer(item);
          }}
        >
          {isItemSaved(item) ? (
            <FaHeart className="text-red-500" size={24} />
          ) : (
            <FaRegHeart className="text-red-500" size={24} />
          )}
        </div>
      </div>
    );

    return isUserAuthenticated ? cardContent : <LoginLink>{cardContent}</LoginLink>;
  };

  // Fetch trailer and recommendations when an item is clicked
  const handleClickOpen = async (item) => {
    if (!isUserAuthenticated) return;
    const uniqueItem = { ...item, uniqueId: item.id || getItemUniqueId(item) };
    setSelectedItem(uniqueItem);
    setOpen(true);
    setTrailerKey(null);
    setRecommendations([]);
    try {
      const trailerResponse = await fetch("/api/trailer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ media_type: item.type, id: item.id }),
      });
      const trailerData = await trailerResponse.json();
      setTrailerKey(trailerData.trailerKey);
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
    }
    fetchEntertainmentRecommendations(uniqueItem);
  };

  // Fetch recommendations from /api/entertainmentrecommendation endpoint
  // This version also fetches a trailer key for each recommended item.
  const fetchEntertainmentRecommendations = async (item) => {
    setRecommendationsLoading(true);
    try {
      const res = await fetch("/api/entertainmentrecommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemDetails: {
            title: item.title || item.name,
            type: item.type,
            description: item.overview,
          },
        }),
      });
      const data = await res.json();
      // Map recommendations and fetch trailer keys for entertainment items.
      const recsWithTrailers = await Promise.all(
        data.recommendations.map(async (rec, index) => {
          let trailerKey = null;
          if ((rec.type === "movie" || rec.type === "tv series") && !rec.trailerKey) {
            try {
              const trailerRes = await fetch("/api/trailer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ media_type: rec.type, id: rec.id }),
              });
              const trailerData = await trailerRes.json();
              trailerKey = trailerData.trailerKey;
            } catch (error) {
              console.error("Error fetching trailer for recommendation:", error);
            }
          }
          return {
            ...rec,
            uniqueId: rec.id || `${rec.type}-${rec.title}-${index}`,
            trailerKey,
          };
        })
      );
      setRecommendations(recsWithTrailers);
    } catch (error) {
      console.error("Failed to fetch entertainment recommendations:", error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Close the dialog (clear state after transition)
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="w-full bg-gray-100 dark:bg-black h-full font-poppins pt-8 text-black dark:text-white">
      {/* Header */}
      <div className="p-5 flex justify-between items-center">
        <h1 className="font-semibold text-gray-600 dark:text-gray-300 text-[3vmin] md:text-[3vmin]">
          Browse Featured
          <span className="text-black dark:text-gray-100 font-bold block md:inline-block">
            &nbsp;Titles
          </span>
        </h1>
        <button
          onClick={toggleView}
          className="bg-gray-400 dark:bg-gray-700 py-2 px-2 rounded-md text-black dark:text-white text-[2vmin] hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          {showAll ? "View Less" : "View All"}
        </button>
      </div>

      {/* Search form */}
      {showAll && (
        <div className="w-full flex justify-end px-5">
          <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
            <input
              className="w-full bg-transparent border-b focus:outline-none text-black dark:text-white"
              type="text"
              placeholder="Search movies or TV shows..."
              value={entertainmentSearch}
              onChange={(e) => setEntertainmentSearch(e.target.value)}
            />
            {entertainmentSearch && (
              <button type="button" onClick={clearSearch}>
                <AiOutlineClose className="text-lg text-red-500" />
              </button>
            )}
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-sm text-white py-1 px-2 rounded"
            >
              <AiOutlineSearch className="text-lg" />
            </button>
          </form>
        </div>
      )}

      {/* Items display */}
      {loading ? (
        <div className="flex justify-center items-center h-[40vh]">
          <CircularProgress />
        </div>
      ) : (
        <div
          className={`w-full px-8 scrollbar-hidden ${
            showAll
              ? "grid grid-cols-3 gap-4"
              : "flex overflow-x-auto scrollbar-hidden space-x-4 md:h-[40vh]"
          } items-center`}
        >
          {itemsToRender.map((item, index) => (
            <div
              key={index}
              className={`cursor-pointer p-2 ${
                showAll ? "w-[30vw]" : "w-[35vw] flex-shrink-0"
              } relative`}
              onClick={() => handleClickOpen(item)}
            >
              {renderEntertainmentCard(item)}
            </div>
          ))}
        </div>
      )}

      {/* Modal for item details */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth={true}
        className="rounded-lg p-4"
        TransitionProps={{
          onExited: () => {
            setSelectedItem(null);
            setTrailerKey(null);
            setRecommendations([]);
          },
        }}
      >
        <DialogTitle className="flex dark:text-white items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-2">
          {selectedItem && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (!isUserAuthenticated) return;
                toggleSaveItemWithTrailer(selectedItem);
              }}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded px-2"
            >
              {savedItems.some(
                (saved) =>
                  saved.id === (selectedItem.uniqueId || selectedItem.id)
              )
                ? "Saved"
                : "Save"}
            </Button>
          )}
          <span className="flex-1 text-center font-poppins font-semibold text-[3.5vmin]">
            {selectedItem?.title || selectedItem?.name}
          </span>
          <IconButton aria-label="close" onClick={handleClose} className="ml-2">
            <CloseIcon className="text-red-500" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          className="flex flex-col items-center bg-white dark:bg-gray-800"
          ref={dialogContentRef}
        >
          {selectedItem && (
            <>
              <div className="flex items-center">
                {trailerKey ? (
                  <YouTube videoId={trailerKey} className="w-full h-full" />
                ) : (
                  <Image
                    src={
                      selectedItem.poster_path
                        ? `https://image.tmdb.org/t/p/original${selectedItem.poster_path}`
                        : "/placeholder.webp"
                    }
                    width={500}
                    height={500}
                    layout="responsive"
                    priority={true}
                    alt={selectedItem.title || selectedItem.name}
                  />
                )}
              </div>
              <p className="p-5 dark:text-white">
                {selectedItem.overview || "No description available"}
              </p>

              {/* Recommendation Section */}
              <div className="w-full mt-4">
                <h2 className="text-center font-semibold text-[3vmin] mb-2">
                  You Might Also Like
                </h2>
                {recommendationsLoading ? (
                  <div className="flex justify-center items-center">
                    <CircularProgress />
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row overflow-x-scroll gap-4 px-4">
                    {recommendations.map((rec, index) => {
                      const uniqueId = getItemUniqueId(rec, index);
                      const recWithUnique = { ...rec, uniqueId };
                      return (
                        <div
                          key={index}
                          className="w-full md:w-[30vw] bg-gray-200 rounded-lg relative flex-shrink-0 cursor-pointer transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-black p-4"
                          onClick={() => setSelectedItem(recWithUnique)}
                        >
                          <h3 className="pb-2 text-lg font-medium">{rec.title}</h3>
                          <p className="pb-2 text-sm">
                            <strong>Type:</strong> {rec.type}
                          </p>
                          <p className="pb-2 text-sm">
                            <strong>Description:</strong> {rec.description.slice(0, 50)}...
                          </p>
                          {rec.poster_path ? (
                            <img
                              className="w-full h-auto object-cover rounded"
                              src={`https://image.tmdb.org/t/p/original${rec.poster_path}`}
                              alt={rec.title}
                            />
                          ) : (
                            <div className="w-full h-[100px] bg-gray-400 flex items-center justify-center">
                              No Image
                            </div>
                          )}
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveItemWithTrailer(recWithUnique);
                            }}
                            className="absolute top-2 right-2"
                          >
                            {isItemSaved(recWithUnique, index) ? (
                              <FaHeart className="text-red-500" size={24} />
                            ) : (
                              <FaRegHeart className="text-red-500" size={24} />
                            )}
                          </IconButton>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Entertainment;