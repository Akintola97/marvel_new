"use client";
import React, { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Image from "next/image";
import { IconButton, CircularProgress, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { SavedContext } from "@/context/SavedItems";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

const SavedItems = ({ isUserAuthenticated }) => {
  // Local state to hold saved characters (from context)
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  // State for the character detail dialog.
  const [open, setOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Get saved character objects and toggle function from context.
  const { savedItems, toggleSaveItem } = useContext(SavedContext);

  // Helper function to check if a character is saved (by comparing ids)
  const isCharacterSaved = (characterId) =>
    savedItems.some((item) => item.id === characterId);

  // Update local state from context without backend fetching.
  useEffect(() => {
    setSavedCharacters(savedItems);
    setLoading(false);
  }, [savedItems]);

  // Open the dialog for the selected character.
  const handleClickOpen = (character) => {
    if (!isUserAuthenticated) return;
    setSelectedCharacter(character);
    setOpen(true);
  };

  // Close the dialog.
  const handleClose = () => {
    setOpen(false);
    // Optionally clear the selected character after transition.
    setTimeout(() => setSelectedCharacter(null), 300);
  };

  // Render a character card with a save icon overlay.
  const renderCharacterCard = (character) => {
    const cardContent = (
      <div
        className="cursor-pointer p-2 relative"
        onClick={() => handleClickOpen(character)}
      >
        <img
          className="w-full h-[20vh] md:h-[30vh] object-cover rounded-lg transform transition duration-300 ease-in-out hover:shadow-lg hover:shadow-gray-500"
          src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
          alt={character.name}
        />
        {/* Overlay for Save Icon */}
        <div
          className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-black bg-opacity-50 rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (!isUserAuthenticated) return;
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

      {/* Characters Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-[40vh]">
          <CircularProgress />
        </div>
      ) : savedCharacters.length === 0 ? (
        <p className="text-center p-5">No saved Items Found.</p>
      ) : (
        <div className="w-full px-8 grid grid-cols-3 gap-4 items-center">
          {savedCharacters.map((character, index) => (
            <div key={index} className="relative p-2 w-[30vw]">
              {renderCharacterCard(character)}
            </div>
          ))}
        </div>
      )}

      {/* Dialog for character details */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth={true}
        className="rounded-lg p-4"
        TransitionProps={{
          onExited: () => {
            // Clear modal state after closing to prevent flicker.
            setSelectedCharacter(null);
          },
        }}
      >
        <DialogTitle className="flex items-center justify-between dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2">
          {/* Save Toggle on left */}
          {selectedCharacter && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (!isUserAuthenticated) return;
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
          {/* Close Button on right */}
          <IconButton onClick={handleClose} className="ml-2">
            <CloseIcon className="text-red-500" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="flex flex-col items-center bg-white dark:bg-gray-800">
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedItems;