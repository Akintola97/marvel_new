"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { IconButton, CircularProgress, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import YouTube from "react-youtube";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { SavedContext } from "@/context/SavedItems";
import { Card, CardTitle, CardDescription } from "./ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchBar from "./SearchBar";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

const SavedItemsAestheticWithModal = ({ isUserAuthenticated }) => {
  const { savedItems, toggleSaveItem } = useContext(SavedContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(savedItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 6;

  // Filter saved items based on search query.
  useEffect(() => {
    const filtered = savedItems.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((item.overview || item.description || "")).toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [searchQuery, savedItems]);

  // Calculate pagination.
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredItems.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber, e) => {
    e.preventDefault();
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  };

  // Helper: truncate text.
  const truncate = (str, num) => (str && str.length > num ? str.slice(0, num) + "..." : str);

  // Helper: determine the image URL.
  const getImageUrl = (item) => {
    if (item.poster_path) {
      return `https://image.tmdb.org/t/p/original${item.poster_path}`;
    } else if (item.thumbnail) {
      return `${item.thumbnail.path}.${item.thumbnail.extension}`;
    }
    return "/placeholder.webp";
  };

  // Open modal dialog for the selected item.
  const handleClickOpen = (item) => {
    if (!isUserAuthenticated) return;
    setSelectedItem(item);
    setOpen(true);
  };

  // Close modal dialog.
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  // Check if an item is saved.
  const isItemSaved = (itemId) => savedItems.some((item) => item.id === itemId);

  // Render a card using the shadcn‑style components.
  const renderCard = (item) => {
    const cardContent = (
      <div
        className="cursor-pointer p-2"
        onClick={() => handleClickOpen(item)}
      >
        <Card className="w-full h-[700px] flex flex-col justify-between rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 bg-white dark:bg-gray-800 dark:text-white">
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={getImageUrl(item)}
              alt={item.title || item.name}
              layout="fill"
              objectFit="cover"
              priority={true}
              className="rounded-t-lg"
            />
            <div className="absolute inset-0 bg-black opacity-20"></div>
          </div>
          <div className="p-4 flex flex-col justify-between flex-grow relative">
            <div className="flex flex-col mb-4">
              <CardTitle className="text-lg font-bold mb-2">
                {truncate(item.title, 40)}
              </CardTitle>
              <CardDescription className="text-sm mb-2 text-gray-600 dark:text-gray-400">
                {truncate(item.overview || item.description || "No description available", 100)}
              </CardDescription>
            </div>
            {isUserAuthenticated && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveItem(item);
                }}
                className="absolute bottom-2 right-2"
              >
                <FaHeart className="text-red-500" size={24} />
              </div>
            )}
          </div>
        </Card>
      </div>
    );
    return isUserAuthenticated ? cardContent : <LoginLink>{cardContent}</LoginLink>;
  };

  return (
    <div className="w-full min-h-screen pt-[10vh] p-6 bg-gray-100 dark:bg-black text-black dark:text-white">
      {/* Search */}
      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* Grid of saved items */}
      {filteredItems.length === 0 ? (
        <div className="w-full flex justify-center items-center">
          <h2>No saved items found</h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((item) => (
              <div key={item.id}>{renderCard(item)}</div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="w-full flex justify-center my-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={(e) => handlePageChange(currentPage - 1, e)}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => handlePageChange(page, e)}
                        className={`${currentPage === page ? "bg-blue-600 text-white" : ""}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={(e) => handlePageChange(currentPage + 1, e)}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal Dialog for item details */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        className="rounded-lg p-4"
        TransitionProps={{ onExited: () => setSelectedItem(null) }}
      >
        <DialogTitle className="flex items-center justify-between dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-2">
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
          <span className="flex-1 text-center font-poppins font-semibold text-[3.5vmin]">
            {selectedItem?.title || selectedItem?.name}
          </span>
          <IconButton onClick={handleClose} className="ml-2">
            <CloseIcon className="text-red-500" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="flex flex-col items-center bg-white dark:bg-gray-800">
          {selectedItem && (
            <>
              {selectedItem.trailerKey ? (
                <div className="flex justify-center w-full pt-8">
                  <YouTube videoId={selectedItem.trailerKey} className="mx-auto" />
                </div>
              ) : (
                <div className="pt-5">
                <Image
                  src={getImageUrl(selectedItem)}
                  // Use smaller dimensions if the item has a thumbnail (comic/character)
                  width={selectedItem.thumbnail ? 300 : 500}
                  height={selectedItem.thumbnail ? 300 : 500}
                  layout="responsive"
                  priority={true}
                  alt={selectedItem.title || selectedItem.name}
                />
                </div>
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

export default SavedItemsAestheticWithModal;
