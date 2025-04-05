"use client";
import React, { createContext, useState, useEffect } from "react";

export const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems")) || [];
    setSavedItems(saved);
  }, []);

  const toggleSaveItem = (item) => {
    // Use uniqueId if available, otherwise default to item.id
    const uniqueId = item.uniqueId || item.id;
    let simplifiedItem;

    if (item.poster_path) {
      // For entertainment items, also include trailerKey if available.
      simplifiedItem = {
      //   id: uniqueId,
      //   title: item.title || item.name,
      //   overview: item.overview,
      //   poster_path: item.poster_path,
      //   type: item.type,
      //   trailerKey: item.trailerKey || null, // save trailerKey
      id: uniqueId,
      title: item.title || item.name,
      overview: item.overview || item.description, // Use description as a fallback
      poster_path: item.poster_path,
      type: item.type,
      trailerKey: item.trailerKey || null,
      };
    } else {
      // For comics/characters
      const { id, title, description, thumbnail } = item;
      simplifiedItem = { id: uniqueId, title, description, thumbnail };
    }

    const exists = savedItems.find((saved) => saved.id === uniqueId);
    let updatedSavedItems;
    if (exists) {
      updatedSavedItems = savedItems.filter((saved) => saved.id !== uniqueId);
    } else {
      updatedSavedItems = [...savedItems, simplifiedItem];
    }
    setSavedItems(updatedSavedItems);
    localStorage.setItem("savedItems", JSON.stringify(updatedSavedItems));
  };

  return (
    <SavedContext.Provider value={{ savedItems, toggleSaveItem }}>
      {children}
    </SavedContext.Provider>
  );
};
