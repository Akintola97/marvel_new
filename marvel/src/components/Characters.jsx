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

// const Characters = () => {
//   // Data states
//   const [characters, setCharacters] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Search and toggle states
//   const [characterSearch, setCharacterSearch] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [showAll, setShowAll] = useState(false);
//   const [visibleCharacters, setVisibleCharacters] = useState(10);

//   // Dialog state for character details
//   const [open, setOpen] = useState(false);
//   const [selectedCharacter, setSelectedCharacter] = useState(null);

//   // Recommendation states
//   const [recommendations, setRecommendations] = useState([]);
//   const [recommendationsLoading, setRecommendationsLoading] = useState(false);

//   // Get saved items and toggle function from context
//   const { savedItems, toggleSaveItem } = useContext(SavedContext);

//   // Ref for dialog content scrolling (if needed)
//   const dialogContentRef = useRef(null);

//   // Load characters on mount
//   useEffect(() => {
//     async function loadCharacters() {
//       try {
//         const res = await fetch("/api/characters", { cache: "force-cache" });
//         if (!res.ok) throw new Error("Failed to fetch characters");
//         const data = await res.json();
//         setCharacters(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching characters:", error);
//         setLoading(false);
//       }
//     }
//     loadCharacters();
//   }, []);

//   // Clear search results when input is cleared
//   useEffect(() => {
//     if (!characterSearch) {
//       setSearchResults([]);
//     }
//   }, [characterSearch]);

//   // Toggle between limited view and full grid view
//   const toggleView = () => {
//     setShowAll((prev) => {
//       const newShowAll = !prev;
//       setVisibleCharacters(newShowAll ? characters.length : 10);
//       return newShowAll;
//     });
//   };

//   // Handle search form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("/api/charactersearch", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ characterSearch }),
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
//     setCharacterSearch("");
//     setSearchResults([]);
//   };

//   // Decide which characters to display
//   const charactersToRender =
//     searchResults.length > 0 ? searchResults : characters.slice(0, visibleCharacters);

//   // Fetch character recommendations using the characterrecommendation endpoint
//   const fetchCharacterRecommendations = async (character) => {
//     setRecommendationsLoading(true);
//     try {
//       const res = await fetch("/api/characterrecommendation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           itemDetails: {
//             title: character.name,
//             type: "Character",
//             description: character.description,
//           },
//         }),
//       });
//       const data = await res.json();
//       setRecommendations(data.recommendations);
//     } catch (error) {
//       console.error("Failed to fetch character recommendations:", error);
//     } finally {
//       setRecommendationsLoading(false);
//     }
//   };

//   // Open the dialog to show character details and fetch recommendations
//   const handleClickOpen = (character) => {
//     setSelectedCharacter(character);
//     setOpen(true);
//     setRecommendations([]); // clear previous recommendations
//     fetchCharacterRecommendations(character);
//     if (dialogContentRef.current) {
//       dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight;
//     }
//   };

//   // Close the dialog and clear selected character
//   const handleClose = () => {
//     setOpen(false);
//     // Delay clearing selectedCharacter to avoid flicker after transition
//     setTimeout(() => {
//       setSelectedCharacter(null);
//       setRecommendations([]);
//     }, 300);
//   };

//   return (
//     <div className="w-full h-full font-poppins pt-8 bg-gray-100 dark:bg-black text-black dark:text-white">
//       {/* Header */}
//       <div className="p-5 flex justify-between items-center">
//         <h1 className="font-semibold text-[3vmin] md:text-[3vmin]">
//           Discover
//           <span className="font-bold block md:inline-block">&nbsp;Characters</span>
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
//               placeholder="Character name e.g., Spider"
//               value={characterSearch}
//               onChange={(e) => setCharacterSearch(e.target.value)}
//             />
//             {characterSearch && (
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

//       {/* Characters Grid / Horizontal scroll */}
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
//           {charactersToRender.map((character, index) => (
//             <div
//               key={index}
//               className={`cursor-pointer p-2 ${showAll ? "w-[30vw]" : "w-[35vw] flex-shrink-0"} relative`}
//               onClick={() => handleClickOpen(character)}
//             >
//               <img
//                 className="w-full h-[20vh] md:h-[30vh] object-cover rounded-lg transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-500"
//                 src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
//                 alt={character.name}
//               />
//               {/* Overlay for Save Icon on grid */}
//               <div
//                 className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 rounded-full cursor-pointer"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleSaveItem(character);
//                 }}
//               >
//                 {savedItems.includes(character.id) ? (
//                   <FaHeart className="text-red-500" size={24} />
//                 ) : (
//                   <FaRegHeart className="text-red-500" size={24} />
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Dialog for character details and recommendations */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="md"
//         fullWidth={true}
//         className="rounded-lg p-4"
//         TransitionProps={{
//           onExited: () => {
//             // Clear modal state after transition completes to avoid flicker
//             setSelectedCharacter(null);
//             setRecommendations([]);
//           },
//         }}
//       >
//         <DialogTitle className="flex items-center justify-between dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2">
//           {/* Save Toggle (left side) */}
//           {selectedCharacter && (
//             <Button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleSaveItem(selectedCharacter);
//               }}
//               className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded px-2"
//             >
//               {savedItems.includes(selectedCharacter.id) ? "Saved" : "Save"}
//             </Button>
//           )}
//           {/* Title in center */}
//           <span className="flex-1 text-center font-poppins font-semibold text-[3.5vmin]">
//             {selectedCharacter?.name}
//           </span>
//           {/* Close button on right */}
//           <IconButton aria-label="close" onClick={handleClose} className="ml-2">
//             <CloseIcon className="text-red-500" />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent
//           className="flex flex-col items-center bg-white dark:bg-gray-800"
//           ref={dialogContentRef}
//         >
//           {selectedCharacter && (
//             <>
//               <Image
//                 src={`${selectedCharacter.thumbnail.path}.${selectedCharacter.thumbnail.extension}`}
//                 width={500}
//                 height={500}
//                 layout="responsive"
//                 priority={true}
//                 alt={selectedCharacter.name}
//               />
//               <p className="p-5 dark:text-white">
//                 {selectedCharacter.description || "No description available"}
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
//                     {recommendations.map((rec, index) => (
//                       <div
//                         key={index}
//                         className="w-full md:w-[30vw] bg-gray-200 rounded-lg relative flex-shrink-0 cursor-pointer transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-black p-4"
//                         onClick={() => setSelectedCharacter(rec)}
//                       >
//                         <h3 className="pb-2 text-lg font-medium">{rec.title}</h3>
//                         <p className="pb-2 text-sm">
//                           <strong>Type:</strong> {rec.type}
//                         </p>
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
// };

// export default Characters;






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

const Characters = () => {
  // Data states
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and toggle states
  const [characterSearch, setCharacterSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [visibleCharacters, setVisibleCharacters] = useState(10);

  // Dialog state for character details
  const [open, setOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Recommendation states
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  // Get saved items and toggle function from context
  const { savedItems, toggleSaveItem } = useContext(SavedContext);

  // Ref for dialog content scrolling (if needed)
  const dialogContentRef = useRef(null);

  // Helper function to check if a character is saved (by comparing ids)
  const isCharacterSaved = (characterId) =>
    savedItems.some((saved) => saved.id === characterId);

  // Load characters on mount
  useEffect(() => {
    async function loadCharacters() {
      try {
        const res = await fetch("/api/characters", { cache: "force-cache" });
        if (!res.ok) throw new Error("Failed to fetch characters");
        const data = await res.json();
        setCharacters(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching characters:", error);
        setLoading(false);
      }
    }
    loadCharacters();
  }, []);

  // Clear search results when input is cleared
  useEffect(() => {
    if (!characterSearch) {
      setSearchResults([]);
    }
  }, [characterSearch]);

  // Toggle between limited view and full grid view
  const toggleView = () => {
    setShowAll((prev) => {
      const newShowAll = !prev;
      setVisibleCharacters(newShowAll ? characters.length : 10);
      return newShowAll;
    });
  };

  // Handle search form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/charactersearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ characterSearch }),
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
    setCharacterSearch("");
    setSearchResults([]);
  };

  // Decide which characters to display
  const charactersToRender =
    searchResults.length > 0 ? searchResults : characters.slice(0, visibleCharacters);

  // Fetch character recommendations using the characterrecommendation endpoint
  const fetchCharacterRecommendations = async (character) => {
    setRecommendationsLoading(true);
    try {
      const res = await fetch("/api/characterrecommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemDetails: {
            title: character.name,
            type: "Character",
            description: character.description,
          },
        }),
      });
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Failed to fetch character recommendations:", error);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  // Open the dialog to show character details and fetch recommendations
  const handleClickOpen = (character) => {
    setSelectedCharacter(character);
    setOpen(true);
    setRecommendations([]); // clear previous recommendations
    fetchCharacterRecommendations(character);
    if (dialogContentRef.current) {
      dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight;
    }
  };

  // Close the dialog and clear selected character
  const handleClose = () => {
    setOpen(false);
    // Delay clearing selectedCharacter to avoid flicker after transition
    setTimeout(() => {
      setSelectedCharacter(null);
      setRecommendations([]);
    }, 300);
  };

  return (
    <div className="w-full h-full font-poppins pt-8 bg-gray-100 dark:bg-black text-black dark:text-white">
      {/* Header */}
      <div className="p-5 flex justify-between items-center">
        <h1 className="font-semibold text-[3vmin] md:text-[3vmin]">
          Discover
          <span className="font-bold block md:inline-block">&nbsp;Characters</span>
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
              placeholder="Character name e.g., Spider"
              value={characterSearch}
              onChange={(e) => setCharacterSearch(e.target.value)}
            />
            {characterSearch && (
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

      {/* Characters Grid / Horizontal scroll */}
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
          {charactersToRender.map((character, index) => (
            <div
              key={index}
              className={`cursor-pointer p-2 ${
                showAll ? "w-[30vw]" : "w-[35vw] flex-shrink-0"
              } relative`}
              onClick={() => handleClickOpen(character)}
            >
              <img
                className="w-full h-[20vh] md:h-[30vh] object-cover rounded-lg transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-500"
                src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                alt={character.name}
              />
              {/* Overlay for Save Icon on grid */}
              <div
                className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 rounded-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveItem(character);
                }}
              >
                {isCharacterSaved(character.id) ? (
                  <FaHeart className="text-red-500" size={24} />
                ) : (
                  <FaRegHeart className="text-red-500" size={24} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog for character details and recommendations */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth={true}
        className="rounded-lg p-4"
        TransitionProps={{
          onExited: () => {
            // Clear modal state after transition completes to avoid flicker
            setSelectedCharacter(null);
            setRecommendations([]);
          },
        }}
      >
        <DialogTitle className="flex items-center justify-between dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2">
          {/* Save Toggle (left side) */}
          {selectedCharacter && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveItem(selectedCharacter);
              }}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded px-2"
            >
              {isCharacterSaved(selectedCharacter.id) ? "Saved" : "Save"}
            </Button>
          )}
          {/* Title in center */}
          <span className="flex-1 text-center font-poppins font-semibold text-[3.5vmin]">
            {selectedCharacter?.name}
          </span>
          {/* Close button on right */}
          <IconButton aria-label="close" onClick={handleClose} className="ml-2">
            <CloseIcon className="text-red-500" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          className="flex flex-col items-center bg-white dark:bg-gray-800"
          ref={dialogContentRef}
        >
          {selectedCharacter && (
            <>
              <Image
                src={`${selectedCharacter.thumbnail.path}.${selectedCharacter.thumbnail.extension}`}
                width={500}
                height={500}
                layout="responsive"
                priority={true}
                alt={selectedCharacter.name}
              />
              <p className="p-5 dark:text-white">
                {selectedCharacter.description || "No description available"}
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
                        onClick={() => setSelectedCharacter(rec)}
                      >
                        <h3 className="pb-2 text-lg font-medium">{rec.title}</h3>
                        <p className="pb-2 text-sm">
                          <strong>Type:</strong> {rec.type}
                        </p>
                        <p className="pb-2 text-sm">
                          <strong>Description:</strong> {rec.description.slice(0, 50)}...
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
                          {isCharacterSaved(rec.id) ? (
                            <FaHeart className="text-red-500" size={24} />
                          ) : (
                            <FaRegHeart className="text-red-500" size={24} />
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
};

export default Characters;
