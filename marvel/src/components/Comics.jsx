// "use client";
// import React, { useState, useEffect, useContext, useRef } from "react";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import Image from "next/image";
// import { IconButton, CircularProgress, Button } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { SavedContext } from "@/context/SavedItems";
// import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

// export default function Comics({ isUserAuthenticated }) {
//   // Data states
//   const [comics, setComics] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Search and toggle states
//   const [comicSearch, setComicSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [showAll, setShowAll] = useState(false);
//   const [visibleComics, setVisibleComics] = useState(10);

//   // Dialog state for comic details
//   const [open, setOpen] = useState(false);
//   const [selectedComic, setSelectedComic] = useState(null);

//   // Recommendation states
//   const [recommendations, setRecommendations] = useState([]);
//   const [recommendationsLoading, setRecommendationsLoading] = useState(false);

//   // Get saved items and toggle function from context
//   const { savedItems, toggleSaveItem } = useContext(SavedContext);

//   // Ref for dialog content scrolling (if needed)
//   const dialogContentRef = useRef(null);

//   // Load comics on mount
//   useEffect(() => {
//     async function loadComics() {
//       try {
//         const res = await fetch("/api/comics", { cache: "force-cache" });
//         if (!res.ok) throw new Error("Failed to fetch comics");
//         const data = await res.json();
//         setComics(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching comics:", error);
//         setLoading(false);
//       }
//     }
//     loadComics();
//   }, []);

//   // Clear search results when search input is cleared
//   useEffect(() => {
//     if (!comicSearch) {
//       setSearchResults([]);
//     }
//   }, [comicSearch]);

//   // Toggle between limited view and full grid view
//   const toggleView = () => {
//     setShowAll((prev) => {
//       const newShowAll = !prev;
//       setVisibleComics(newShowAll ? comics.length : 10);
//       return newShowAll;
//     });
//   };

//   // Handle search form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("/api/comicsearch", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query: comicSearch }),
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
//     setComicSearch("");
//     setSearchResults([]);
//   };

//   // Decide which comics to display
//   const comicsToRender =
//     searchResults.length > 0 ? searchResults : comics.slice(0, visibleComics);

//   // Fetch recommendations for the selected comic
//   const fetchRecommendations = async (comic) => {
//     setRecommendationsLoading(true);
//     try {
//       const res = await fetch("/api/comicrecommendation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           itemDetails: {
//             title: comic.title,
//             type: "Comic",
//             description: comic.description,
//           },
//         }),
//       });
//       const data = await res.json();
//       setRecommendations(data.recommendations);
//     } catch (error) {
//       console.error("Failed to fetch recommendations:", error);
//     } finally {
//       setRecommendationsLoading(false);
//     }
//   };

//   // Open dialog to show comic details and load recommendations (only if authenticated)
//   const handleClickOpen = (comic) => {
//     if (!isUserAuthenticated) return;
//     setSelectedComic(comic);
//     setOpen(true);
//     // Clear previous recommendations and fetch new ones
//     setRecommendations([]);
//     fetchRecommendations(comic);
//     // Scroll to bottom if needed
//     if (dialogContentRef.current) {
//       dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight;
//     }
//   };

//   // Close the dialog; clear selectedComic after transition completes
//   const handleClose = () => {
//     setOpen(false);
//     setSelectedComic(null);
//     setRecommendations([]);
//   };

//   // Render comic card; if not authenticated, wrap with LoginLink.
//   const renderComicCard = (comic) => {
//     const cardContent = (
//       <div
//         className="cursor-pointer p-2 relative"
//         onClick={() => handleClickOpen(comic)}
//       >
//         <img
//           className="w-full h-[20vh] md:h-[30vh] object-cover rounded-lg transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-500"
//           src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
//           alt={comic.title}
//         />
//         {/* Overlay for Save Icon */}
//         <div
//           className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 rounded-full"
//           onClick={(e) => {
//             e.stopPropagation();
//             if (!isUserAuthenticated) return;
//             toggleSaveItem(comic);
//           }}
//         >
//           {savedItems.includes(comic.id) ? (
//             <FaHeart className="text-red-500" size={24} />
//           ) : (
//             <FaRegHeart className="text-red-500" size={24} />
//           )}
//         </div>
//       </div>
//     );

//     return isUserAuthenticated ? cardContent : <LoginLink>{cardContent}</LoginLink>;
//   };

//   return (
//     <div className="w-full h-full font-poppins pt-8 bg-gray-100 dark:bg-black text-black dark:text-white">
//       {/* Header */}
//       <div className="p-5 flex justify-between items-center">
//         <h1 className="font-semibold text-[3vmin] md:text-[3vmin] text-gray-600 dark:text-gray-300">
//           Discover{" "}
//           <span className="font-bold block md:inline-block text-black dark:text-gray-100">
//             &nbsp;Comics
//           </span>
//         </h1>
//         <button
//           onClick={toggleView}
//           className="py-2 px-2 rounded-md text-[2vmin] bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
//         >
//           {showAll ? "View Less" : "View All"}
//         </button>
//       </div>

//       {/* Search form */}
//       {showAll && (
//         <div className="w-full flex justify-end px-5">
//           <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
//             <input
//               className="w-full bg-transparent border-b focus:outline-none"
//               type="text"
//               placeholder="Comic title, #issueNumber e.g (Wolverine: Enemy of the state or Thor, #5)"
//               value={comicSearch}
//               onChange={(e) => setComicSearch(e.target.value)}
//             />
//             {comicSearch && (
//               <button type="button" onClick={clearSearch}>
//                 <AiOutlineClose className="text-lg text-red-500" />
//               </button>
//             )}
//             <button
//               type="submit"
//               className="py-1 px-2 rounded bg-green-500 hover:bg-green-700 text-sm text-white"
//             >
//               <AiOutlineSearch className="text-lg" />
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Comics Grid / Horizontal Scroll */}
//       {loading ? (
//         <div className="flex justify-center items-center h-[40vh]">
//           <CircularProgress />
//         </div>
//       ) : (
//         <div
//           className={`w-full px-8 scrollbar-hidden ${
//             showAll
//               ? "grid grid-cols-3 gap-4"
//               : "flex overflow-x-auto space-x-4 md:h-[40vh]"
//           } items-center`}
//         >
//           {comicsToRender.map((comic, index) => (
//             <div
//               key={index}
//               className={`relative p-2 ${showAll ? "w-[30vw]" : "w-[35vw] flex-shrink-0"}`}
//             >
//               {renderComicCard(comic)}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Dialog for comic details and recommendations */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="md"
//         fullWidth={true}
//         className="rounded-lg p-4"
//         TransitionProps={{
//           onExited: () => setSelectedComic(null),
//         }}
//       >
//         <DialogTitle className="flex items-center justify-between dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2">
//           {/* Save Toggle on left */}
//           {selectedComic && (
//             <Button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (!isUserAuthenticated) return;
//                 toggleSaveItem(selectedComic);
//               }}
//               className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded px-2"
//             >
//               {savedItems.includes(selectedComic.id) ? "Saved" : "Save"}
//             </Button>
//           )}
//           {/* Title in center */}
//           <span className="flex-1 text-center font-poppins font-semibold text-[3.5vmin]">
//             {selectedComic?.title}
//           </span>
//           {/* Close Button on right */}
//           <IconButton onClick={handleClose} className="ml-2">
//             <CloseIcon className="text-red-500" />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent className="flex flex-col items-center bg-white dark:bg-gray-800" ref={dialogContentRef}>
//           {selectedComic && (
//             <>
//               <Image
//                 src={`${selectedComic.thumbnail.path}.${selectedComic.thumbnail.extension}`}
//                 width={500}
//                 height={500}
//                 layout="responsive"
//                 priority={true}
//                 alt={selectedComic.title}
//               />
//               <p className="p-5 dark:text-white">
//                 {selectedComic.description || "No description available"}
//               </p>
//               {/* Recommendation Section */}
//               <div className="w-full mt-4">
//                 <h2 className="text-center font-semibold text-[3vmin] mb-2">You Might Also Like</h2>
//                 {recommendationsLoading ? (
//                   <div className="flex justify-center items-center">
//                     <CircularProgress />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col md:flex-row overflow-x-scroll gap-4 px-4">
//                     {recommendations.map((rec, index) => (
//                       <div
//                         key={index}
//                         className="w-full md:w-[30vw] bg-gray-200 rounded-lg relative flex-shrink-0 cursor-pointer transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-black p-4"
//                         onClick={() => setSelectedComic(rec)}
//                       >
//                         <h3 className="pb-2 text-lg font-medium">{rec.title}</h3>
//                         <p className="pb-2 text-sm"><strong>Type:</strong> {rec.type}</p>
//                         <p className="pb-2 text-sm">
//                           <strong>Description:</strong> {rec.description.slice(0, 50)}...
//                         </p>
//                         {rec.thumbnail ? (
//                           <img
//                             className="w-full h-auto object-cover rounded"
//                             src={`${rec.thumbnail.path}.${rec.thumbnail.extension}`}
//                             alt={rec.title}
//                           />
//                         ) : (
//                           <div className="w-full h-[100px] bg-gray-400 flex items-center justify-center">
//                             No Image
//                           </div>
//                         )}
//                         {/* Recommendation Save Icon */}
//                         <IconButton
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             // Toggle save for recommendation similar to main comic
//                             toggleSaveItem(rec);
//                           }}
//                           className="absolute top-2 right-2"
//                         >
//                           {savedItems.includes(rec.id) ? (
//                             <FaHeart className="text-red-500" />
//                           ) : (
//                             <FaRegHeart className="text-red-500" />
//                           )}
//                         </IconButton>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }






"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Image from "next/image";
import { IconButton, CircularProgress, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { SavedContext } from "@/context/SavedItems";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Comics({ isUserAuthenticated }) {
  // Data states
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and toggle states
  const [comicSearch, setComicSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleComics, setVisibleComics] = useState(10);

  // Dialog state for comic details
  const [open, setOpen] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);

  // Recommendation states
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  // Get saved items and toggle function from context
  const { savedItems, toggleSaveItem } = useContext(SavedContext);

  // Ref for dialog content scrolling (if needed)
  const dialogContentRef = useRef(null);

  // Load comics on mount
  useEffect(() => {
    async function loadComics() {
      try {
        const res = await fetch("/api/comics", { cache: "force-cache" });
        if (!res.ok) throw new Error("Failed to fetch comics");
        const data = await res.json();
        setComics(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching comics:", error);
        setLoading(false);
      }
    }
    loadComics();
  }, []);

  // Clear search results when search input is cleared
  useEffect(() => {
    if (!comicSearch) {
      setSearchResults([]);
    }
  }, [comicSearch]);

  // Toggle between limited view and full grid view
  const toggleView = () => {
    setShowAll((prev) => {
      const newShowAll = !prev;
      setVisibleComics(newShowAll ? comics.length : 10);
      return newShowAll;
    });
  };

  // Handle search form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/comicsearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: comicSearch }),
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
    setComicSearch("");
    setSearchResults([]);
  };

  // Decide which comics to display
  const comicsToRender =
    searchResults.length > 0 ? searchResults : comics.slice(0, visibleComics);

  // Fetch recommendations for the selected comic
  const fetchRecommendations = async (comic) => {
    setRecommendationsLoading(true);
    try {
      const res = await fetch("/api/comicrecommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemDetails: {
            title: comic.title,
            type: "Comic",
            description: comic.description,
          },
        }),
      });
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Open dialog to show comic details and load recommendations (only if authenticated)
  const handleClickOpen = (comic) => {
    if (!isUserAuthenticated) return;
    setSelectedComic(comic);
    setOpen(true);
    // Clear previous recommendations and fetch new ones
    setRecommendations([]);
    fetchRecommendations(comic);
    // Scroll to bottom if needed
    if (dialogContentRef.current) {
      dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight;
    }
  };

  // Close the dialog; clear selectedComic after transition completes
  const handleClose = () => {
    setOpen(false);
    setSelectedComic(null);
    setRecommendations([]);
  };

  // Helper function to check if a comic is saved (based on its id)
  const isComicSaved = (comicId) =>
    savedItems.some((item) => item.id === comicId);

  // Render comic card; if not authenticated, wrap with LoginLink.
  const renderComicCard = (comic) => {
    const cardContent = (
      <div
        className="cursor-pointer p-2 relative"
        onClick={() => handleClickOpen(comic)}
      >
        <img
          className="w-full h-[20vh] md:h-[30vh] object-cover rounded-lg transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-500"
          src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
          alt={comic.title}
        />
        {/* Overlay for Save Icon */}
        <div
          className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            if (!isUserAuthenticated) return;
            toggleSaveItem(comic);
          }}
        >
          {isComicSaved(comic.id) ? (
            <FaHeart className="text-red-500" size={24} />
          ) : (
            <FaRegHeart className="text-red-500" size={24} />
          )}
        </div>
      </div>
    );

    return isUserAuthenticated ? cardContent : <LoginLink>{cardContent}</LoginLink>;
  };

  return (
    <div className="w-full h-full font-poppins pt-8 bg-gray-100 dark:bg-black text-black dark:text-white">
      {/* Header */}
      <div className="p-5 flex justify-between items-center">
        <h1 className="font-semibold text-[3vmin] md:text-[3vmin] text-gray-600 dark:text-gray-300">
          Discover{" "}
          <span className="font-bold block md:inline-block text-black dark:text-gray-100">
            &nbsp;Comics
          </span>
        </h1>
        <button
          onClick={toggleView}
          className="py-2 px-2 rounded-md text-[2vmin] bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          {showAll ? "View Less" : "View All"}
        </button>
      </div>

      {/* Search form */}
      {showAll && (
        <div className="w-full flex justify-end px-5">
          <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
            <input
              className="w-full bg-transparent border-b focus:outline-none"
              type="text"
              placeholder="Comic title, #issueNumber e.g (Wolverine: Enemy of the state or Thor, #5)"
              value={comicSearch}
              onChange={(e) => setComicSearch(e.target.value)}
            />
            {comicSearch && (
              <button type="button" onClick={clearSearch}>
                <AiOutlineClose className="text-lg text-red-500" />
              </button>
            )}
            <button
              type="submit"
              className="py-1 px-2 rounded bg-green-500 hover:bg-green-700 text-sm text-white"
            >
              <AiOutlineSearch className="text-lg" />
            </button>
          </form>
        </div>
      )}

      {/* Comics Grid / Horizontal Scroll */}
      {loading ? (
        <div className="flex justify-center items-center h-[40vh]">
          <CircularProgress />
        </div>
      ) : (
        <div
          className={`w-full px-8 scrollbar-hidden ${
            showAll
              ? "grid grid-cols-3 gap-4"
              : "flex overflow-x-auto space-x-4 md:h-[40vh]"
          } items-center`}
        >
          {comicsToRender.map((comic, index) => (
            <div
              key={index}
              className={`relative p-2 ${
                showAll ? "w-[30vw]" : "w-[35vw] flex-shrink-0"
              }`}
            >
              {renderComicCard(comic)}
            </div>
          ))}
        </div>
      )}

      {/* Dialog for comic details and recommendations */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth={true}
        className="rounded-lg p-4"
        TransitionProps={{
          onExited: () => setSelectedComic(null),
        }}
      >
        <DialogTitle className="flex items-center justify-between dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2">
          {/* Save Toggle on left */}
          {selectedComic && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (!isUserAuthenticated) return;
                toggleSaveItem(selectedComic);
              }}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded px-2"
            >
              {isComicSaved(selectedComic?.id) ? "Saved" : "Save"}
            </Button>
          )}
          {/* Title in center */}
          <span className="flex-1 text-center font-poppins font-semibold text-[3.5vmin]">
            {selectedComic?.title}
          </span>
          {/* Close Button on right */}
          <IconButton onClick={handleClose} className="ml-2">
            <CloseIcon className="text-red-500" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          className="flex flex-col items-center bg-white dark:bg-gray-800"
          ref={dialogContentRef}
        >
          {selectedComic && (
            <>
            <div className="pt-5">
              <Image
                src={`${selectedComic.thumbnail.path}.${selectedComic.thumbnail.extension}`}
                width={500}
                height={500}
                layout="responsive"
                priority={true}
                alt={selectedComic.title}
              />
              </div>
              <p className="p-5 dark:text-white">
                {selectedComic.description || "No description available"}
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
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="w-full md:w-[30vw] bg-gray-200 rounded-lg relative flex-shrink-0 cursor-pointer transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-black p-4"
                        onClick={() => setSelectedComic(rec)}
                      >
                        <h3 className="pb-2 text-lg font-medium">{rec.title}</h3>
                        <p className="pb-2 text-sm">
                          <strong>Type:</strong> {rec.type}
                        </p>
                        <p className="pb-2 text-sm">
                          <strong>Description:</strong>{" "}
                          {rec.description.slice(0, 50)}...
                        </p>
                        {rec.thumbnail ? (
                          <img
                            className="w-full h-auto object-cover rounded"
                            src={`${rec.thumbnail.path}.${rec.thumbnail.extension}`}
                            alt={rec.title}
                          />
                        ) : (
                          <div className="w-full h-[100px] bg-gray-400 flex items-center justify-center">
                            No Image
                          </div>
                        )}
                        {/* Recommendation Save Icon */}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveItem(rec);
                          }}
                          className="absolute top-2 right-2"
                        >
                          {isComicSaved(rec.id) ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart className="text-red-500" />
                          )}
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}