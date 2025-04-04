// "use client";
// import React, { useState, useEffect, useContext } from "react";
// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import Image from "next/image";
// import YouTube from "react-youtube";
// import { IconButton, CircularProgress, Button } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { SavedContext } from "@/context/SavedItems";
// import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

// const SavedItems = ({ isUserAuthenticated }) => {
//   // Local state to hold saved items (from context)
//   const [savedItemsLocal, setSavedItemsLocal] = useState([]);
//   const [loading, setLoading] = useState(true);
//   // State for the item detail dialog.
//   const [open, setOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);

//   // Get saved items and toggle function from context.
//   const { savedItems, toggleSaveItem } = useContext(SavedContext);

//   // Helper function to check if an item is saved (by comparing ids)
//   const isItemSaved = (itemId) =>
//     savedItems.some((item) => item.id === itemId);

//   // Update local state from context without backend fetching.
//   useEffect(() => {
//     setSavedItemsLocal(savedItems);
//     setLoading(false);
//   }, [savedItems]);

//   // Open the dialog for the selected item.
//   const handleClickOpen = (item) => {
//     if (!isUserAuthenticated) return;
//     setSelectedItem(item);
//     setOpen(true);
//   };

//   // Close the dialog.
//   const handleClose = () => {
//     setOpen(false);
//     setTimeout(() => setSelectedItem(null), 300);
//   };

//   // Helper function to determine the image URL based on item type.
//   const getImageUrl = (item) => {
//     if (item.poster_path) {
//       // Entertainment item
//       return `https://image.tmdb.org/t/p/original${item.poster_path}`;
//     } else if (item.thumbnail) {
//       // Comics/Characters item
//       return `${item.thumbnail.path}.${item.thumbnail.extension}`;
//     }
//     return "/placeholder.webp";
//   };

//   // Render a card with a save icon overlay.
//   const renderCard = (item) => {
//     const cardContent = (
//       <div
//         className="cursor-pointer p-2 relative"
//         onClick={() => handleClickOpen(item)}
//       >
//         <img
//           className="w-full h-[20vh] md:h-[30vh] object-cover rounded-lg transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-500"
//           src={getImageUrl(item)}
//           alt={item.title || item.name}
//         />
//         {/* Overlay for Save Icon */}
//         <div
//           className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 rounded-full cursor-pointer"
//           onClick={(e) => {
//             e.stopPropagation();
//             if (!isUserAuthenticated) return;
//             toggleSaveItem(item);
//           }}
//         >
//           {isItemSaved(item.id) ? (
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
//     <div className="w-full h-full font-poppins pt-[8vh] bg-gray-100 dark:bg-black text-black dark:text-white">
//       {/* Header */}
//       <div className="p-5 flex justify-between items-center">
//         <h1 className="font-semibold text-[3vmin] md:text-[3vmin] text-gray-600 dark:text-gray-300">
//           Your Saved{" "}
//           <span className="font-bold block md:inline-block text-black dark:text-gray-100">
//             Items
//           </span>
//         </h1>
//       </div>

//       {/* Items Grid */}
//       {loading ? (
//         <div className="flex justify-center items-center h-[40vh]">
//           <CircularProgress />
//         </div>
//       ) : savedItemsLocal.length === 0 ? (
//         <p className="text-center p-5">No saved Items Found.</p>
//       ) : (
//         <div className="w-full px-8 grid grid-cols-3 gap-4 items-center">
//           {savedItemsLocal.map((item, index) => (
//             <div key={index} className="relative p-2 w-[30vw]">
//               {renderCard(item)}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Dialog for item details */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         maxWidth="md"
//         fullWidth={true}
//         className="rounded-lg p-4"
//         TransitionProps={{
//           onExited: () => {
//             setSelectedItem(null);
//           },
//         }}
//       >
//         <DialogTitle className="flex items-center justify-between dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2">
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
//               {isItemSaved(selectedItem.id) ? "Saved" : "Save"}
//             </Button>
//           )}
//           {/* Title in center */}
//           <span className="flex-1 text-center font-poppins font-semibold text-[3.5vmin]">
//             {selectedItem?.title || selectedItem?.name}
//           </span>
//           {/* Close Button on right */}
//           <IconButton onClick={handleClose} className="ml-2">
//             <CloseIcon className="text-red-500" />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent className="flex flex-col items-center bg-white dark:bg-gray-800">
//           {selectedItem && (
//             <>
//               {selectedItem.trailerKey ? (
//                 // If a trailerKey is available, render the YouTube trailer
//                 <YouTube videoId={selectedItem.trailerKey} className="w-full" />
//               ) : (
//                 // Otherwise, show the static image
//                 <Image
//                   src={getImageUrl(selectedItem)}
//                   width={500}
//                   height={500}
//                   layout="responsive"
//                   priority={true}
//                   alt={selectedItem.title || selectedItem.name}
//                 />
//               )}
//               <p className="p-5 dark:text-white">
//                 {selectedItem.overview ||
//                   selectedItem.description ||
//                   "No description available"}
//               </p>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default SavedItems;






"use client";
import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Image from "next/image";
import YouTube from "react-youtube";
import { IconButton, CircularProgress, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { SavedContext } from "@/context/SavedItems";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

const SavedItems = ({ isUserAuthenticated }) => {
  // Local state to hold saved items (from context)
  const [savedItemsLocal, setSavedItemsLocal] = useState([]);
  const [loading, setLoading] = useState(true);
  // State for the item detail dialog.
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Get saved items and toggle function from context.
  const { savedItems, toggleSaveItem } = useContext(SavedContext);

  // Helper function to check if an item is saved (by comparing ids)
  const isItemSaved = (itemId) =>
    savedItems.some((item) => item.id === itemId);

  // Update local state from context without backend fetching.
  useEffect(() => {
    setSavedItemsLocal(savedItems);
    setLoading(false);
  }, [savedItems]);

  // Open the dialog for the selected item.
  const handleClickOpen = (item) => {
    if (!isUserAuthenticated) return;
    setSelectedItem(item);
    setOpen(true);
  };

  // Close the dialog.
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  // Helper function to determine the image URL based on item type.
  const getImageUrl = (item) => {
    if (item.poster_path) {
      // Entertainment item
      return `https://image.tmdb.org/t/p/original${item.poster_path}`;
    } else if (item.thumbnail) {
      // Comics/Characters item
      return `${item.thumbnail.path}.${item.thumbnail.extension}`;
    }
    return "/placeholder.webp";
  };

  // Render a card with a save icon overlay.
  const renderCard = (item) => {
    const cardContent = (
      <div
        className="cursor-pointer p-2 relative"
        onClick={() => handleClickOpen(item)}
      >
        <img
          className="w-full h-[20vh] md:h-[30vh] object-cover rounded-lg transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-500"
          src={getImageUrl(item)}
          alt={item.title || item.name}
        />
        {/* Overlay for Save Icon */}
        <div
          className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (!isUserAuthenticated) return;
            toggleSaveItem(item);
          }}
        >
          {isItemSaved(item.id) ? (
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
    <div className="w-full h-full font-poppins pt-[8vh] bg-gray-100 dark:bg-black text-black dark:text-white">
      {/* Header */}
      <div className="p-5 flex justify-between items-center">
        <h1 className="font-semibold text-[3vmin] md:text-[3vmin] text-gray-600 dark:text-gray-300">
          Your Saved{" "}
          <span className="font-bold block md:inline-block text-black dark:text-gray-100">
            Items
          </span>
        </h1>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-[40vh]">
          <CircularProgress />
        </div>
      ) : savedItemsLocal.length === 0 ? (
        <p className="text-center p-5">No saved Items Found.</p>
      ) : (
        <div className="w-full px-8 grid grid-cols-3 gap-4 items-center">
          {savedItemsLocal.map((item, index) => (
            <div key={index} className="relative p-2 w-[30vw]">
              {renderCard(item)}
            </div>
          ))}
        </div>
      )}

      {/* Dialog for item details */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth={true}
        className="rounded-lg p-4"
        TransitionProps={{
          onExited: () => {
            setSelectedItem(null);
          },
        }}
      >
        <DialogTitle className="flex items-center justify-between dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2">
          {/* Save Toggle on left */}
          {selectedItem && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (!isUserAuthenticated) return;
                toggleSaveItem(selectedItem);
              }}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 rounded px-2"
            >
              {isItemSaved(selectedItem.id) ? "Saved" : "Save"}
            </Button>
          )}
          {/* Title in center */}
          <span className="flex-1 text-center font-poppins font-semibold text-[3.5vmin]">
            {selectedItem?.title || selectedItem?.name}
          </span>
          {/* Close Button on right */}
          <IconButton onClick={handleClose} className="ml-2">
            <CloseIcon className="text-red-500" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="flex flex-col items-center bg-white dark:bg-gray-800">
          {selectedItem && (
            <>
              {selectedItem.trailerKey ? (
                // Wrap YouTube component in a flex container to center it horizontally.
                <div className="flex justify-center w-full">
                  <YouTube videoId={selectedItem.trailerKey} className="mx-auto" />
                </div>
              ) : (
                // Otherwise, show the static image.
                <Image
                  src={getImageUrl(selectedItem)}
                  width={500}
                  height={500}
                  layout="responsive"
                  priority={true}
                  alt={selectedItem.title || selectedItem.name}
                />
              )}
              <p className="p-5 dark:text-white">
                {selectedItem.overview ||
                  selectedItem.description ||
                  "No description available"}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedItems;