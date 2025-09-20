
// // // // "use client";
// // // // import React, { useState, useEffect, useRef } from "react";
// // // // import {
// // // //   Dialog,
// // // //   DialogContent,
// // // //   DialogTitle,
// // // //   IconButton,
// // // //   TextField,
// // // //   Button,
// // // // } from "@mui/material";
// // // // import SendIcon from "@mui/icons-material/Send";
// // // // import CloseIcon from "@mui/icons-material/Close";
// // // // import axios from "axios";
// // // // import ReactMarkdown from "react-markdown";

// // // // const Chatbot = () => {
// // // //   const [userInput, setUserInput] = useState("");
// // // //   const [responses, setResponses] = useState([]);
// // // //   const [isTyping, setIsTyping] = useState(false);
// // // //   const messageEndRef = useRef(null);
// // // //   const [open, setOpen] = useState(false);

// // // //   const scrollToBottom = () => {
// // // //     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // // //   };

// // // //   useEffect(() => {
// // // //     scrollToBottom();
// // // //   }, [responses]);

// // // //   const handleClickOpen = () => {
// // // //     setOpen(true);
// // // //   };

// // // //   const handleClose = () => {
// // // //     setOpen(false);
// // // //     setResponses([]);
// // // //   };

// // // //   const handleSendMessages = async () => {
// // // //     if (userInput.trim() !== "") {
// // // //       const newMessage = {
// // // //         message: userInput,
// // // //         from: "user",
// // // //       };
// // // //       setResponses((oldResponses) => [...oldResponses, newMessage]);
// // // //       setUserInput("");
// // // //       setIsTyping(true);

// // // //       try {
// // // //         const { data } = await axios.post("/api/chatbot", {
// // // //           messages: responses.concat(newMessage),
// // // //         });
// // // //         setTimeout(() => {
// // // //           setResponses((oldResponses) => [
// // // //             ...oldResponses,
// // // //             {
// // // //               message: data.response,
// // // //               from: "bot",
// // // //             },
// // // //           ]);
// // // //           setIsTyping(false);
// // // //         }, 500);
// // // //       } catch (error) {
// // // //         console.error("Error occurred during fetching data", error);
// // // //         setResponses((oldResponses) => [
// // // //           ...oldResponses,
// // // //           { message: "Failed to fetch response", from: "bot" },
// // // //         ]);
// // // //       }
// // // //     }
// // // //   };

// // // //   return (
// // // //     <>
// // // //       <Button
// // // //         onClick={handleClickOpen}
// // // //         variant="contained"
// // // //         color="primary"
// // // //         style={{ position: "fixed", bottom: 20, right: 20 }}
// // // //       >
// // // //         Open Chat
// // // //       </Button>
// // // //       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
// // // //         <DialogTitle className="bg-gray-100 text-xl leading-6 font-medium text-gray-900">
// // // //           How Can I Assist?
// // // //           <IconButton aria-label="close" onClick={handleClose} style={{
// // // //             position: "absolute", right: 8, top: 8
// // // //           }}>
// // // //             <CloseIcon />
// // // //           </IconButton>
// // // //         </DialogTitle>
// // // //         <DialogContent className="p-4">
// // // //           <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
// // // //             {responses.map((res, index) => (
// // // //               <div key={index} className={`p-2 rounded-lg m-2 ${res.from === 'user' ? "bg-blue-400 ml-auto" : "bg-white mr-auto"}`}>
// // // //                 <p className="text-black">
// // // //                   {res.from === 'user' ? res.message : <ReactMarkdown>{res.message}</ReactMarkdown>}
// // // //                 </p>
// // // //               </div>
// // // //             ))}
// // // //             <div ref={messageEndRef} />
// // // //             {isTyping && <p className="italic text-left m-2">Typing...</p>}
// // // //           </div>
// // // //           <TextField
// // // //             fullWidth
// // // //             variant='outlined'
// // // //             placeholder="Comic recommendations, Character info..."
// // // //             value={userInput}
// // // //             onChange={(e) => setUserInput(e.target.value)}
// // // //             onKeyPress={(e) => (e.key === "Enter" ? handleSendMessages() : null)}
// // // //             margin='normal'
// // // //             className="bg-white"
// // // //           />
// // // //           <Button
// // // //             onClick={handleSendMessages}
// // // //             endIcon={<SendIcon />}
// // // //             color="primary"
// // // //             variant="contained"
// // // //             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg mt-2"
// // // //           >
// // // //             Send
// // // //           </Button>
// // // //         </DialogContent>
// // // //       </Dialog>
// // // //     </>
// // // //   );
// // // // };

// // // // export default Chatbot;



// // // // "use client";
// // // // import React, { useState, useEffect, useRef } from "react";
// // // // import {
// // // //   Dialog,
// // // //   DialogContent,
// // // //   DialogTitle,
// // // //   IconButton,
// // // //   TextField,
// // // //   Button,
// // // // } from "@mui/material";
// // // // import SendIcon from "@mui/icons-material/Send";
// // // // import CloseIcon from "@mui/icons-material/Close";
// // // // import axios from "axios";
// // // // import ReactMarkdown from "react-markdown";

// // // // const Chatbot = () => {
// // // //   const [userInput, setUserInput] = useState("");
// // // //   const [responses, setResponses] = useState([]);
// // // //   const [isTyping, setIsTyping] = useState(false);
// // // //   const messageEndRef = useRef(null);
// // // //   const [open, setOpen] = useState(false);

// // // //   const scrollToBottom = () => {
// // // //     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // // //   };

// // // //   useEffect(() => {
// // // //     scrollToBottom();
// // // //   }, [responses]);

// // // //   const handleClickOpen = () => {
// // // //     setOpen(true);
// // // //   };

// // // //   const handleClose = () => {
// // // //     setOpen(false);
// // // //     setResponses([]);
// // // //   };

// // // //   const handleSendMessages = async () => {
// // // //     if (userInput.trim() !== "") {
// // // //       const newMessage = {
// // // //         message: userInput,
// // // //         from: "user",
// // // //       };
// // // //       setResponses((oldResponses) => [...oldResponses, newMessage]);
// // // //       setUserInput("");
// // // //       setIsTyping(true);

// // // //       try {
// // // //         const { data } = await axios.post("/api/chatbot", {
// // // //           messages: responses.concat(newMessage),
// // // //         });
// // // //         setTimeout(() => {
// // // //           setResponses((oldResponses) => [
// // // //             ...oldResponses,
// // // //             {
// // // //               message: data.response,
// // // //               from: "bot",
// // // //             },
// // // //           ]);
// // // //           setIsTyping(false);
// // // //         }, 500);
// // // //       } catch (error) {
// // // //         console.error("Error occurred during fetching data", error);
// // // //         setResponses((oldResponses) => [
// // // //           ...oldResponses,
// // // //           { message: "Failed to fetch response", from: "bot" },
// // // //         ]);
// // // //       }
// // // //     }
// // // //   };

// // // //   return (
// // // //     <>
// // // //       <Button
// // // //         onClick={handleClickOpen}
// // // //         variant="contained"
// // // //         color="primary"
// // // //         style={{ position: "fixed", bottom: 20, right: 20 }}
// // // //       >
// // // //         Open Chat
// // // //       </Button>
// // // //       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
// // // //         <DialogTitle className="bg-gray-100 dark:bg-gray-700 text-xl leading-6 font-medium text-gray-900 dark:text-gray-100">
// // // //           How Can I Assist?
// // // //           <IconButton
// // // //             aria-label="close"
// // // //             onClick={handleClose}
// // // //             style={{ position: "absolute", right: 8, top: 8 }}
// // // //           >
// // // //             <CloseIcon className="text-gray-900 dark:text-gray-100" />
// // // //           </IconButton>
// // // //         </DialogTitle>
// // // //         <DialogContent className="p-4 bg-white dark:bg-gray-800">
// // // //           <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
// // // //             {responses.map((res, index) => (
// // // //               <div
// // // //                 key={index}
// // // //                 className={`p-2 rounded-lg m-2 ${
// // // //                   res.from === "user"
// // // //                     ? "bg-blue-400 ml-auto"
// // // //                     : "bg-gray-100 dark:bg-gray-600 mr-auto"
// // // //                 }`}
// // // //               >
// // // //                 <p className="text-black dark:text-gray-100">
// // // //                   {res.from === "user" ? (
// // // //                     res.message
// // // //                   ) : (
// // // //                     <ReactMarkdown>{res.message}</ReactMarkdown>
// // // //                   )}
// // // //                 </p>
// // // //               </div>
// // // //             ))}
// // // //             <div ref={messageEndRef} />
// // // //             {isTyping && <p className="italic text-left m-2">Typing...</p>}
// // // //           </div>
// // // //           <TextField
// // // //             fullWidth
// // // //             variant="outlined"
// // // //             placeholder="Comic recommendations, Character info..."
// // // //             value={userInput}
// // // //             onChange={(e) => setUserInput(e.target.value)}
// // // //             onKeyPress={(e) => (e.key === "Enter" ? handleSendMessages() : null)}
// // // //             margin="normal"
// // // //             className="bg-white dark:bg-gray-700"
// // // //           />
// // // //           <Button
// // // //             onClick={handleSendMessages}
// // // //             endIcon={<SendIcon />}
// // // //             color="primary"
// // // //             variant="contained"
// // // //             className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg mt-2"
// // // //           >
// // // //             Send
// // // //           </Button>
// // // //         </DialogContent>
// // // //       </Dialog>
// // // //     </>
// // // //   );
// // // // };

// // // // export default Chatbot;


// // // "use client";
// // // import React, { useState, useEffect, useRef } from "react";
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogTitle,
// // //   IconButton,
// // //   TextField,
// // //   Button,
// // // } from "@mui/material";
// // // import SendIcon from "@mui/icons-material/Send";
// // // import CloseIcon from "@mui/icons-material/Close";
// // // import axios from "axios";
// // // import ReactMarkdown from "react-markdown";

// // // const Chatbot = () => {
// // //   const [userInput, setUserInput] = useState("");
// // //   const [responses, setResponses] = useState([]);
// // //   const [isTyping, setIsTyping] = useState(false);
// // //   const messageEndRef = useRef(null);
// // //   const [open, setOpen] = useState(false);

// // //   const scrollToBottom = () => {
// // //     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   };

// // //   useEffect(() => {
// // //     scrollToBottom();
// // //   }, [responses]);

// // //   const handleClickOpen = () => {
// // //     setOpen(true);
// // //   };

// // //   const handleClose = () => {
// // //     setOpen(false);
// // //     setResponses([]);
// // //   };

// // //   const handleSendMessages = async () => {
// // //     if (userInput.trim() !== "") {
// // //       const newMessage = {
// // //         message: userInput,
// // //         from: "user",
// // //       };
// // //       setResponses((oldResponses) => [...oldResponses, newMessage]);
// // //       setUserInput("");
// // //       setIsTyping(true);

// // //       try {
// // //         const { data } = await axios.post("/api/chatbot", {
// // //           messages: responses.concat(newMessage),
// // //         });
// // //         setTimeout(() => {
// // //           setResponses((oldResponses) => [
// // //             ...oldResponses,
// // //             {
// // //               message: data.response,
// // //               from: "bot",
// // //             },
// // //           ]);
// // //           setIsTyping(false);
// // //         }, 500);
// // //       } catch (error) {
// // //         console.error("Error occurred during fetching data", error);
// // //         setResponses((oldResponses) => [
// // //           ...oldResponses,
// // //           { message: "Failed to fetch response", from: "bot" },
// // //         ]);
// // //       }
// // //     }
// // //   };

// // //   // 🔎 Helper to render bot messages differently
// // //   const renderBotMessage = (message) => {
// // //     // YouTube video embed
// // //     if (message.includes("youtube.com") || message.includes("youtu.be")) {
// // //       const videoId = message.split("v=")[1]?.split("&")[0];
// // //       return videoId ? (
// // //         <iframe
// // //           width="100%"
// // //           height="200"
// // //           src={`https://www.youtube.com/embed/${videoId}`}
// // //           title="YouTube trailer"
// // //           frameBorder="0"
// // //           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// // //           allowFullScreen
// // //           className="rounded-lg shadow-md"
// // //         ></iframe>
// // //       ) : (
// // //         <ReactMarkdown>{message}</ReactMarkdown>
// // //       );
// // //     }

// // //     // Image rendering
// // //     if (message.match(/\.(jpeg|jpg|png|gif)$/i)) {
// // //       return (
// // //         <img
// // //           src={message}
// // //           alt="poster"
// // //           className="max-w-full rounded-lg shadow-md"
// // //         />
// // //       );
// // //     }

// // //     // Default → Markdown
// // //     return <ReactMarkdown>{message}</ReactMarkdown>;
// // //   };

// // //   return (
// // //     <>
// // //       <Button
// // //         onClick={handleClickOpen}
// // //         variant="contained"
// // //         color="primary"
// // //         style={{ position: "fixed", bottom: 20, right: 20 }}
// // //       >
// // //         Open Chat
// // //       </Button>
// // //       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
// // //         <DialogTitle className="bg-gray-100 dark:bg-gray-700 text-xl leading-6 font-medium text-gray-900 dark:text-gray-100">
// // //           How Can I Assist?
// // //           <IconButton
// // //             aria-label="close"
// // //             onClick={handleClose}
// // //             style={{ position: "absolute", right: 8, top: 8 }}
// // //           >
// // //             <CloseIcon className="text-gray-900 dark:text-gray-100" />
// // //           </IconButton>
// // //         </DialogTitle>
// // //         <DialogContent className="p-4 bg-white dark:bg-gray-800">
// // //           <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
// // //             {responses.map((res, index) => (
// // //               <div
// // //                 key={index}
// // //                 className={`p-2 rounded-lg m-2 ${
// // //                   res.from === "user"
// // //                     ? "bg-blue-400 ml-auto"
// // //                     : "bg-gray-100 dark:bg-gray-600 mr-auto"
// // //                 }`}
// // //               >
// // //                 <div className="text-black dark:text-gray-100">
// // //                   {res.from === "user" ? res.message : renderBotMessage(res.message)}
// // //                 </div>
// // //               </div>
// // //             ))}
// // //             <div ref={messageEndRef} />
// // //             {isTyping && <p className="italic text-left m-2">Typing...</p>}
// // //           </div>
// // //           <TextField
// // //             fullWidth
// // //             variant="outlined"
// // //             placeholder="Comic recommendations, Character info..."
// // //             value={userInput}
// // //             onChange={(e) => setUserInput(e.target.value)}
// // //             onKeyPress={(e) => (e.key === "Enter" ? handleSendMessages() : null)}
// // //             margin="normal"
// // //             className="bg-white dark:bg-gray-700"
// // //           />
// // //           <Button
// // //             onClick={handleSendMessages}
// // //             endIcon={<SendIcon />}
// // //             color="primary"
// // //             variant="contained"
// // //             className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg mt-2"
// // //           >
// // //             Send
// // //           </Button>
// // //         </DialogContent>
// // //       </Dialog>
// // //     </>
// // //   );
// // // };

// // // export default Chatbot;





// // "use client";
// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogTitle,
// //   IconButton,
// //   TextField,
// //   Button,
// // } from "@mui/material";
// // import SendIcon from "@mui/icons-material/Send";
// // import CloseIcon from "@mui/icons-material/Close";
// // import axios from "axios";
// // import ReactMarkdown from "react-markdown";
// // import YouTube from "react-youtube"; // 👈 add this

// // const Chatbot = () => {
// //   const [userInput, setUserInput] = useState("");
// //   const [responses, setResponses] = useState([]); // each item: { from, message, tmdb? }
// //   const [isTyping, setIsTyping] = useState(false);
// //   const messageEndRef = useRef(null);
// //   const [open, setOpen] = useState(false);

// //   const scrollToBottom = () => {
// //     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [responses]);

// //   const handleClickOpen = () => setOpen(true);
// //   const handleClose = () => {
// //     setOpen(false);
// //     setResponses([]);
// //   };

// //   const handleSendMessages = async () => {
// //     if (!userInput.trim()) return;

// //     const newMessage = { message: userInput, from: "user" };
// //     setResponses((prev) => [...prev, newMessage]);
// //     setUserInput("");
// //     setIsTyping(true);

// //     try {
// //       const { data } = await axios.post("/api/chatbot", {
// //         messages: responses.concat(newMessage),
// //       });

// //       // Push bot message with possible TMDB struct
// //       setResponses((prev) => [
// //         ...prev,
// //         {
// //           message: data.response,
// //           from: "bot",
// //           tmdb: data.tmdb || null,
// //         },
// //       ]);
// //     } catch (error) {
// //       console.error("chatbot error", error);
// //       setResponses((prev) => [
// //         ...prev,
// //         { message: "Failed to fetch response", from: "bot" },
// //       ]);
// //     } finally {
// //       setIsTyping(false);
// //     }
// //   };

// //   // Render bot block with trailer/poster (if provided)
// //   const BotBlock = ({ msg }) => {
// //     const tmdb = msg.tmdb;

// //     return (
// //       <div className="space-y-2">
// //         {/* Media area: trailer or poster */}
// //         {tmdb && (tmdb.trailerKey || tmdb.posterUrl) && (
// //           <div className="w-full">
// //             {tmdb.trailerKey ? (
// //               <YouTube
// //                 videoId={tmdb.trailerKey}
// //                 className="w-full h-full"
// //                 opts={{
// //                   width: "100%",
// //                   playerVars: { modestbranding: 1, rel: 0 },
// //                 }}
// //               />
// //             ) : tmdb.posterUrl ? (
// //               <img
// //                 src={tmdb.posterUrl}
// //                 alt={`${tmdb.title} poster`}
// //                 className="w-full max-h-[320px] object-cover rounded-lg shadow-md"
// //               />
// //             ) : null}
// //           </div>
// //         )}

// //         {/* Quick facts row (optional but nice) */}
// //         {tmdb && (
// //           <div className="bg-white/70 dark:bg-gray-700/60 rounded-lg p-2 text-sm">
// //             <div className="font-semibold">
// //               {tmdb.title}
// //               {tmdb.release_date ? ` (${tmdb.release_date})` : ""}
// //             </div>
// //             {tmdb.cast?.length ? (
// //               <div>
// //                 <span className="opacity-80">Cast:</span> {tmdb.cast.join(", ")}
// //               </div>
// //             ) : null}
// //             {tmdb.overview ? (
// //               <div className="opacity-90 mt-1">{tmdb.overview}</div>
// //             ) : null}
// //           </div>
// //         )}

// //         {/* LLM text */}
// //         <div className="prose prose-sm max-w-none dark:prose-invert">
// //           <ReactMarkdown>{msg.message}</ReactMarkdown>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <>
// //       <Button
// //         onClick={handleClickOpen}
// //         variant="contained"
// //         color="primary"
// //         style={{ position: "fixed", bottom: 20, right: 20 }}
// //       >
// //         Open Chat
// //       </Button>

// //       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
// //         <DialogTitle className="bg-gray-100 dark:bg-gray-700 text-xl leading-6 font-medium text-gray-900 dark:text-gray-100">
// //           How Can I Assist?
// //           <IconButton
// //             aria-label="close"
// //             onClick={handleClose}
// //             style={{ position: "absolute", right: 8, top: 8 }}
// //           >
// //             <CloseIcon className="text-gray-900 dark:text-gray-100" />
// //           </IconButton>
// //         </DialogTitle>

// //         <DialogContent className="p-4 bg-white dark:bg-gray-800">
// //           <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
// //             {responses.map((res, index) => (
// //               <div
// //                 key={index}
// //                 className={`p-2 rounded-lg m-2 ${
// //                   res.from === "user"
// //                     ? "bg-blue-400 ml-auto"
// //                     : "bg-gray-100 dark:bg-gray-600 mr-auto"
// //                 }`}
// //               >
// //                 <div className="text-black dark:text-gray-100">
// //                   {res.from === "user" ? (
// //                     res.message
// //                   ) : (
// //                     <BotBlock msg={res} />
// //                   )}
// //                 </div>
// //               </div>
// //             ))}
// //             <div ref={messageEndRef} />
// //             {isTyping && <p className="italic text-left m-2">Typing...</p>}
// //           </div>

// //           <TextField
// //             fullWidth
// //             variant="outlined"
// //             placeholder="Ask about any Marvel movie or show..."
// //             value={userInput}
// //             onChange={(e) => setUserInput(e.target.value)}
// //             onKeyDown={(e) => e.key === "Enter" && handleSendMessages()}
// //             margin="normal"
// //             className="bg-white dark:bg-gray-700"
// //           />
// //           <Button
// //             onClick={handleSendMessages}
// //             endIcon={<SendIcon />}
// //             color="primary"
// //             variant="contained"
// //             className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg mt-2"
// //           >
// //             Send
// //           </Button>
// //         </DialogContent>
// //       </Dialog>
// //     </>
// //   );
// // };

// // export default Chatbot;



// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Button,
//   Tooltip,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import YouTube from "react-youtube";

// const Chatbot = () => {
//   const [userInput, setUserInput] = useState("");
//   const [responses, setResponses] = useState([]); // { from:"user"|"bot", message:string, tmdb?:object }
//   const [isTyping, setIsTyping] = useState(false);
//   const [open, setOpen] = useState(false);
//   const messageEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [responses, isTyping]);

//   const handleClickOpen = () => setOpen(true);
//   const handleClose = () => {
//     setOpen(false);
//     setResponses([]);
//   };

//   const handleSendMessages = async () => {
//     if (!userInput.trim()) return;

//     const newMessage = { message: userInput, from: "user" };
//     setResponses((prev) => [...prev, newMessage]);
//     setUserInput("");
//     setIsTyping(true);

//     try {
//       const { data } = await axios.post("/api/chatbot", {
//         messages: responses.concat(newMessage),
//       });

//       // Optional: inspect trailer data during dev
//       // console.log("tmdb:", data.tmdb);

//       setResponses((prev) => [
//         ...prev,
//         {
//           message: data.response,
//           from: "bot",
//           tmdb: data.tmdb || null,
//         },
//       ]);
//     } catch (error) {
//       console.error("Error occurred during fetching data", error);
//       setResponses((prev) => [
//         ...prev,
//         { message: "Failed to fetch response", from: "bot" },
//       ]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   // Enter to send (shift+enter for newline)
//   const onKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault?.();
//       handleSendMessages();
//     }
//   };

//   // ---- Subcomponents ----
//   const BotBlock = ({ msg }) => {
//     const tmdb = msg.tmdb;

//     return (
//       <div className="space-y-3">
//         {/* Trailer / Poster */}
//         {tmdb && (tmdb.trailerKey || tmdb.posterUrl) && (
//           <div className="w-full overflow-hidden rounded-2xl shadow-md border border-white/10">
//             {tmdb.trailerKey ? (
//               <YouTube
//                 videoId={tmdb.trailerKey}
//                 className="w-full"
//                 opts={{ width: "100%", height: "260" }} // explicit height so it's visible
//               />
//             ) : (
//               <img
//                 src={tmdb.posterUrl}
//                 alt={`${tmdb.title || "Poster"}`}
//                 className="w-full max-h-[320px] object-cover"
//               />
//             )}
//           </div>
//         )}

//         {/* Quick facts card */}
//         {tmdb && (
//           <div className="rounded-2xl bg-white/80 dark:bg-gray-700/70 backdrop-blur p-3 text-sm border border-white/20">
//             <div className="flex flex-wrap items-center gap-2">
//               <span className="font-semibold">{tmdb.title}</span>
//               {tmdb.release_date && (
//                 <span className="px-2 py-0.5 text-xs rounded-full bg-black/5 dark:bg-white/10">
//                   {tmdb.release_date}
//                 </span>
//               )}
//             </div>
//             {tmdb.cast?.length ? (
//               <div className="mt-1">
//                 <span className="opacity-80">Cast:</span> {tmdb.cast.join(", ")}
//               </div>
//             ) : null}
//             {tmdb.overview ? (
//               <p className="mt-2 leading-relaxed">{tmdb.overview}</p>
//             ) : null}
//           </div>
//         )}

//         {/* Main LLM text */}
//         <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed">
//           <ReactMarkdown>{msg.message}</ReactMarkdown>
//         </div>
//       </div>
//     );
//   };

//   const MessageBubble = ({ res }) => {
//     const isUser = res.from === "user";
//     return (
//       <div
//         className={`flex items-end gap-2 ${
//           isUser ? "justify-end" : "justify-start"
//         }`}
//       >
//         {!isUser && (
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 shadow-md flex items-center justify-center text-white text-xs font-bold">
//             M
//           </div>
//         )}

//         <div
//           className={`max-w-[75%] rounded-2xl p-3 shadow-md ${
//             isUser
//               ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
//               : "bg-white/80 dark:bg-gray-700/70 backdrop-blur border border-white/20 text-gray-900 dark:text-gray-100"
//           }`}
//         >
//           {isUser ? (
//             <div className="whitespace-pre-wrap">{res.message}</div>
//           ) : (
//             <BotBlock msg={res} />
//           )}
//         </div>

//         {isUser && (
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex items-center justify-center text-white text-xs font-bold">
//             U
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* Floating action button */}
//       <Button
//         onClick={handleClickOpen}
//         variant="contained"
//         className="!fixed !bottom-5 !right-5 !rounded-full !px-5 !py-3 !shadow-xl !bg-gradient-to-r !from-indigo-600 !to-fuchsia-600 hover:!opacity-90"
//         endIcon={<SendIcon />}
//       >
//         Chat
//       </Button>

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         fullWidth
//         maxWidth="sm"
//         PaperProps={{
//           className:
//             "rounded-3xl overflow-hidden bg-gradient-to-b from-white to-white/80 dark:from-gray-900 dark:to-gray-900/80",
//           elevation: 0,
//         }}
//       >
//         {/* Header */}
//         <DialogTitle className="relative p-0">
//           <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
//             <div className="font-semibold text-lg">Marvel Assistant</div>
//             <IconButton
//               aria-label="close"
//               onClick={handleClose}
//               className="!text-white/90 hover:!text-white"
//             >
//               <CloseIcon />
//             </IconButton>
//           </div>
//         </DialogTitle>

//         {/* Body */}
//         <DialogContent className="p-0">
//           {/* Subtle decorative background */}
//           <div className="relative">
//             <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[radial-gradient(circle_at_20%_20%,#6366f1_0,transparent_40%),radial-gradient(circle_at_80%_0%,#d946ef_0,transparent_35%),radial-gradient(circle_at_0%_100%,#22d3ee_0,transparent_35%)]" />
//           </div>

//           {/* Messages */}
//           <div className="relative px-4 pt-4 pb-28 min-h-[380px] max-h-[70vh] overflow-y-auto">
//             {responses.length === 0 && (
//               <div className="rounded-2xl border border-dashed border-white/30 dark:border-white/20 bg-white/60 dark:bg-gray-800/60 backdrop-blur p-6 text-center text-sm text-gray-600 dark:text-gray-300">
//                 Ask about any Marvel movie or show — release dates, cast, plot, or trailers.
//               </div>
//             )}

//             <div className="space-y-3">
//               {responses.map((res, idx) => (
//                 <MessageBubble key={idx} res={res} />
//               ))}

//               {isTyping && (
//                 <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 shadow-md flex items-center justify-center text-white text-xs font-bold">
//                     M
//                   </div>
//                   <div className="rounded-2xl px-3 py-2 bg-white/70 dark:bg-gray-700/70 backdrop-blur border border-white/20">
//                     <span className="inline-flex gap-1">
//                       <span className="animate-pulse">●</span>
//                       <span className="animate-pulse delay-150">●</span>
//                       <span className="animate-pulse delay-300">●</span>
//                     </span>
//                   </div>
//                 </div>
//               )}

//               <div ref={messageEndRef} />
//             </div>
//           </div>

//           {/* Input (sticky) */}
//           <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
//             <div className="rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-black/10 dark:border-white/10 shadow-lg flex items-center gap-2 px-3 py-2">
//               <textarea
//                 rows={1}
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 onKeyDown={onKeyDown}
//                 placeholder="Ask about Thunderbolts, Deadpool & Wolverine, Loki S2…"
//                 className="flex-1 bg-transparent outline-none resize-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 py-1"
//               />
//               <Tooltip title="Send">
//                 <span>
//                   <IconButton
//                     onClick={handleSendMessages}
//                     disabled={!userInput.trim()}
//                     className="!text-white !bg-gradient-to-r !from-indigo-600 !to-fuchsia-600 hover:!opacity-90 !w-9 !h-9"
//                   >
//                     <SendIcon fontSize="small" />
//                   </IconButton>
//                 </span>
//               </Tooltip>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Chatbot;






"use client";
import React, { useState, useEffect, useRef, useMemo, memo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import YouTube from "react-youtube";

/** ---------- Stable helpers ---------- */

// Stable YouTube opts so the iframe isn't re-created every render
const YT_OPTS = { width: "100%", height: "260", playerVars: { modestbranding: 1, rel: 0 } };

// Shallow compare for messages to avoid rerenders on typing
const areMsgEqual = (prev, next) =>
  prev.res.from === next.res.from &&
  prev.res.message === next.res.message &&
  JSON.stringify(prev.res.tmdb || {}) === JSON.stringify(next.res.tmdb || {});

// Shallow compare for list props
const areListEqual = (prev, next) => prev.items === next.items && prev.isTyping === next.isTyping;

/** ---------- Memoized subcomponents ---------- */

const BotBlock = memo(function BotBlock({ msg }) {
  const tmdb = msg.tmdb;
  return (
    <div className="space-y-3">
      {/* Trailer / Poster */}
      {tmdb && (tmdb.trailerKey || tmdb.posterUrl) && (
        <div className="w-full overflow-hidden rounded-2xl shadow-md border border-white/10">
          {tmdb.trailerKey ? (
            // Key on trailerKey only, so it doesn't remount unless key changes
            <YouTube key={tmdb.trailerKey} videoId={tmdb.trailerKey} className="w-full" opts={YT_OPTS} />
          ) : (
            <img
              src={tmdb.posterUrl}
              alt={`${tmdb.title || "Poster"}`}
              className="w-full max-h-[320px] object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
      )}

      {/* Quick facts card */}
      {tmdb && (
        <div className="rounded-2xl bg-white/80 dark:bg-gray-700/70 backdrop-blur p-3 text-sm border border-white/20">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{tmdb.title}</span>
            {tmdb.release_date && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-black/5 dark:bg-white/10">
                {tmdb.release_date}
              </span>
            )}
          </div>
          {tmdb.cast?.length ? (
            <div className="mt-1">
              <span className="opacity-80">Cast:</span> {tmdb.cast.join(", ")}
            </div>
          ) : null}
          {tmdb.overview ? <p className="mt-2 leading-relaxed">{tmdb.overview}</p> : null}
        </div>
      )}

      {/* Main LLM text */}
      <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed">
        <ReactMarkdown>{msg.message}</ReactMarkdown>
      </div>
    </div>
  );
}, (prev, next) =>
  prev.msg.message === next.msg.message &&
  JSON.stringify(prev.msg.tmdb || {}) === JSON.stringify(next.msg.tmdb || {})
);

const MessageBubble = memo(function MessageBubble({ res }) {
  const isUser = res.from === "user";
  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 shadow-md flex items-center justify-center text-white text-xs font-bold">
          M
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl p-3 shadow-md ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
            : "bg-white/80 dark:bg-gray-700/70 backdrop-blur border border-white/20 text-gray-900 dark:text-gray-100"
        }`}
      >
        {isUser ? <div className="whitespace-pre-wrap">{res.message}</div> : <BotBlock msg={res} />}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex items-center justify-center text-white text-xs font-bold">
          U
        </div>
      )}
    </div>
  );
}, areMsgEqual);

const MessagesPane = memo(function MessagesPane({ items, isTyping, endRef }) {
  return (
    <div className="space-y-3">
      {items.map((res) => (
        // Use a stable key: prefer a server-provided id; fallback to a hash of content
        <MessageBubble key={res.id ?? `${res.from}:${res.message.slice(0, 60)}:${res.tmdb?.trailerKey || ""}`} res={res} />
      ))}
      {isTyping && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 shadow-md flex items-center justify-center text-white text-xs font-bold">
            M
          </div>
          <div className="rounded-2xl px-3 py-2 bg-white/70 dark:bg-gray-700/70 backdrop-blur border border-white/20">
            <span className="inline-flex gap-1">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-150">●</span>
              <span className="animate-pulse delay-300">●</span>
            </span>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}, areListEqual);

/** ---------- Main component ---------- */

export default function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]); // { id?, from, message, tmdb? }
  const [isTyping, setIsTyping] = useState(false);
  const [open, setOpen] = useState(false);
  const endRef = useRef(null);

  // Scroll only when responses/isTyping actually change (not on every keystroke)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [responses, isTyping]);

  const handleClickOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => {
    setOpen(false);
    setResponses([]);
  }, []);

  // Wrap setter to keep array reference stable unless it truly changes
  const pushMessage = useCallback((msg) => {
    setResponses((prev) => [...prev, msg]);
  }, []);

  const handleSendMessages = useCallback(async () => {
    const text = userInput.trim();
    if (!text) return;

    const userMsg = { from: "user", message: text };
    pushMessage(userMsg);
    setUserInput("");
    setIsTyping(true);

    try {
      const { data } = await axios.post("/api/chatbot", {
        messages: responses.concat(userMsg),
      });

      const botMsg = {
        from: "bot",
        message: data.response,
        tmdb: data.tmdb || null,
      };
      pushMessage(botMsg);
    } catch (error) {
      console.error("chatbot error", error);
      pushMessage({ from: "bot", message: "Failed to fetch response" });
    } finally {
      setIsTyping(false);
    }
  }, [userInput, responses, pushMessage]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault?.();
        handleSendMessages();
      }
    },
    [handleSendMessages]
  );

  return (
    <>
      {/* Floating action button */}
      <Button
        onClick={handleClickOpen}
        variant="contained"
        className="!fixed !bottom-5 !right-5 !rounded-full !px-5 !py-3 !shadow-xl !bg-gradient-to-r !from-indigo-600 !to-fuchsia-600 hover:!opacity-90"
        endIcon={<SendIcon />}
      >
        Chat
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          className:
            "rounded-3xl overflow-hidden bg-gradient-to-b from-white to-white/80 dark:from-gray-900 dark:to-gray-900/80",
          elevation: 0,
        }}
      >
        {/* Header */}
        <DialogTitle className="relative p-0">
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white">
            <div className="font-semibold text-lg">Marvel Assistant</div>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              className="!text-white/90 hover:!text-white"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent className="p-0">
          {/* Decorative bg */}
          <div className="relative">
            <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[radial-gradient(circle_at_20%_20%,#6366f1_0,transparent_40%),radial-gradient(circle_at_80%_0%,#d946ef_0,transparent_35%),radial-gradient(circle_at_0%_100%,#22d3ee_0,transparent_35%)]" />
          </div>

          {/* Messages area */}
          <div className="relative px-4 pt-4 pb-28 min-h-[380px] max-h-[70vh] overflow-y-auto">
            {responses.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/30 dark:border-white/20 bg-white/60 dark:bg-gray-800/60 backdrop-blur p-6 text-center text-sm text-gray-600 dark:text-gray-300">
                Ask about any Marvel movie or show — release dates, cast, plot, or trailers.
              </div>
            )}

            {/* Memoized messages list prevents rerender on each keystroke */}
            <MessagesPane items={responses} isTyping={isTyping} endRef={endRef} />
          </div>

          {/* Sticky input */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
            <div className="rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-black/10 dark:border-white/10 shadow-lg flex items-center gap-2 px-3 py-2">
              <textarea
                rows={1}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about Thunderbolts, Deadpool & Wolverine, Loki S2…"
                className="flex-1 bg-transparent outline-none resize-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 py-1"
              />
              <Tooltip title="Send">
                <span>
                  <IconButton
                    onClick={handleSendMessages}
                    disabled={!userInput.trim()}
                    className="!text-white !bg-gradient-to-r !from-indigo-600 !to-fuchsia-600 hover:!opacity-90 !w-9 !h-9"
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
