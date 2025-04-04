"use client"
import React, { createContext, useState, useEffect } from "react";

export const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItems")) || [];
    setSavedItems(saved);
  }, []);

  const toggleSaveItem = (item) => {
    // Extract only the properties you really need:
    const { id, title, description, thumbnail } = item;
    const simplifiedItem = { id, title, description, thumbnail };

    // Check if the item is already saved (by id)
    const exists = savedItems.find((saved) => saved.id === item.id);
    let updatedSavedItems;
    if (exists) {
      // If it exists, remove it
      updatedSavedItems = savedItems.filter((saved) => saved.id !== item.id);
    } else {
      // Otherwise, add the simplified item to savedItems
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