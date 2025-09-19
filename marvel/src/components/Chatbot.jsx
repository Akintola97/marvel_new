
// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   TextField,
//   Button,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";

// const Chatbot = () => {
//   const [userInput, setUserInput] = useState("");
//   const [responses, setResponses] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const messageEndRef = useRef(null);
//   const [open, setOpen] = useState(false);

//   const scrollToBottom = () => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [responses]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setResponses([]);
//   };

//   const handleSendMessages = async () => {
//     if (userInput.trim() !== "") {
//       const newMessage = {
//         message: userInput,
//         from: "user",
//       };
//       setResponses((oldResponses) => [...oldResponses, newMessage]);
//       setUserInput("");
//       setIsTyping(true);

//       try {
//         const { data } = await axios.post("/api/chatbot", {
//           messages: responses.concat(newMessage),
//         });
//         setTimeout(() => {
//           setResponses((oldResponses) => [
//             ...oldResponses,
//             {
//               message: data.response,
//               from: "bot",
//             },
//           ]);
//           setIsTyping(false);
//         }, 500);
//       } catch (error) {
//         console.error("Error occurred during fetching data", error);
//         setResponses((oldResponses) => [
//           ...oldResponses,
//           { message: "Failed to fetch response", from: "bot" },
//         ]);
//       }
//     }
//   };

//   return (
//     <>
//       <Button
//         onClick={handleClickOpen}
//         variant="contained"
//         color="primary"
//         style={{ position: "fixed", bottom: 20, right: 20 }}
//       >
//         Open Chat
//       </Button>
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle className="bg-gray-100 text-xl leading-6 font-medium text-gray-900">
//           How Can I Assist?
//           <IconButton aria-label="close" onClick={handleClose} style={{
//             position: "absolute", right: 8, top: 8
//           }}>
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent className="p-4">
//           <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
//             {responses.map((res, index) => (
//               <div key={index} className={`p-2 rounded-lg m-2 ${res.from === 'user' ? "bg-blue-400 ml-auto" : "bg-white mr-auto"}`}>
//                 <p className="text-black">
//                   {res.from === 'user' ? res.message : <ReactMarkdown>{res.message}</ReactMarkdown>}
//                 </p>
//               </div>
//             ))}
//             <div ref={messageEndRef} />
//             {isTyping && <p className="italic text-left m-2">Typing...</p>}
//           </div>
//           <TextField
//             fullWidth
//             variant='outlined'
//             placeholder="Comic recommendations, Character info..."
//             value={userInput}
//             onChange={(e) => setUserInput(e.target.value)}
//             onKeyPress={(e) => (e.key === "Enter" ? handleSendMessages() : null)}
//             margin='normal'
//             className="bg-white"
//           />
//           <Button
//             onClick={handleSendMessages}
//             endIcon={<SendIcon />}
//             color="primary"
//             variant="contained"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg mt-2"
//           >
//             Send
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Chatbot;



// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   TextField,
//   Button,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";

// const Chatbot = () => {
//   const [userInput, setUserInput] = useState("");
//   const [responses, setResponses] = useState([]);
//   const [isTyping, setIsTyping] = useState(false);
//   const messageEndRef = useRef(null);
//   const [open, setOpen] = useState(false);

//   const scrollToBottom = () => {
//     messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [responses]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setResponses([]);
//   };

//   const handleSendMessages = async () => {
//     if (userInput.trim() !== "") {
//       const newMessage = {
//         message: userInput,
//         from: "user",
//       };
//       setResponses((oldResponses) => [...oldResponses, newMessage]);
//       setUserInput("");
//       setIsTyping(true);

//       try {
//         const { data } = await axios.post("/api/chatbot", {
//           messages: responses.concat(newMessage),
//         });
//         setTimeout(() => {
//           setResponses((oldResponses) => [
//             ...oldResponses,
//             {
//               message: data.response,
//               from: "bot",
//             },
//           ]);
//           setIsTyping(false);
//         }, 500);
//       } catch (error) {
//         console.error("Error occurred during fetching data", error);
//         setResponses((oldResponses) => [
//           ...oldResponses,
//           { message: "Failed to fetch response", from: "bot" },
//         ]);
//       }
//     }
//   };

//   return (
//     <>
//       <Button
//         onClick={handleClickOpen}
//         variant="contained"
//         color="primary"
//         style={{ position: "fixed", bottom: 20, right: 20 }}
//       >
//         Open Chat
//       </Button>
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
//         <DialogTitle className="bg-gray-100 dark:bg-gray-700 text-xl leading-6 font-medium text-gray-900 dark:text-gray-100">
//           How Can I Assist?
//           <IconButton
//             aria-label="close"
//             onClick={handleClose}
//             style={{ position: "absolute", right: 8, top: 8 }}
//           >
//             <CloseIcon className="text-gray-900 dark:text-gray-100" />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent className="p-4 bg-white dark:bg-gray-800">
//           <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
//             {responses.map((res, index) => (
//               <div
//                 key={index}
//                 className={`p-2 rounded-lg m-2 ${
//                   res.from === "user"
//                     ? "bg-blue-400 ml-auto"
//                     : "bg-gray-100 dark:bg-gray-600 mr-auto"
//                 }`}
//               >
//                 <p className="text-black dark:text-gray-100">
//                   {res.from === "user" ? (
//                     res.message
//                   ) : (
//                     <ReactMarkdown>{res.message}</ReactMarkdown>
//                   )}
//                 </p>
//               </div>
//             ))}
//             <div ref={messageEndRef} />
//             {isTyping && <p className="italic text-left m-2">Typing...</p>}
//           </div>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Comic recommendations, Character info..."
//             value={userInput}
//             onChange={(e) => setUserInput(e.target.value)}
//             onKeyPress={(e) => (e.key === "Enter" ? handleSendMessages() : null)}
//             margin="normal"
//             className="bg-white dark:bg-gray-700"
//           />
//           <Button
//             onClick={handleSendMessages}
//             endIcon={<SendIcon />}
//             color="primary"
//             variant="contained"
//             className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg mt-2"
//           >
//             Send
//           </Button>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Chatbot;


"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef(null);
  const [open, setOpen] = useState(false);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [responses]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setResponses([]);
  };

  const handleSendMessages = async () => {
    if (userInput.trim() !== "") {
      const newMessage = {
        message: userInput,
        from: "user",
      };
      setResponses((oldResponses) => [...oldResponses, newMessage]);
      setUserInput("");
      setIsTyping(true);

      try {
        const { data } = await axios.post("/api/chatbot", {
          messages: responses.concat(newMessage),
        });
        setTimeout(() => {
          setResponses((oldResponses) => [
            ...oldResponses,
            {
              message: data.response,
              from: "bot",
            },
          ]);
          setIsTyping(false);
        }, 500);
      } catch (error) {
        console.error("Error occurred during fetching data", error);
        setResponses((oldResponses) => [
          ...oldResponses,
          { message: "Failed to fetch response", from: "bot" },
        ]);
      }
    }
  };

  // 🔎 Helper to render bot messages differently
  const renderBotMessage = (message) => {
    // YouTube video embed
    if (message.includes("youtube.com") || message.includes("youtu.be")) {
      const videoId = message.split("v=")[1]?.split("&")[0];
      return videoId ? (
        <iframe
          width="100%"
          height="200"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-md"
        ></iframe>
      ) : (
        <ReactMarkdown>{message}</ReactMarkdown>
      );
    }

    // Image rendering
    if (message.match(/\.(jpeg|jpg|png|gif)$/i)) {
      return (
        <img
          src={message}
          alt="poster"
          className="max-w-full rounded-lg shadow-md"
        />
      );
    }

    // Default → Markdown
    return <ReactMarkdown>{message}</ReactMarkdown>;
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        color="primary"
        style={{ position: "fixed", bottom: 20, right: 20 }}
      >
        Open Chat
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle className="bg-gray-100 dark:bg-gray-700 text-xl leading-6 font-medium text-gray-900 dark:text-gray-100">
          How Can I Assist?
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon className="text-gray-900 dark:text-gray-100" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="p-4 bg-white dark:bg-gray-800">
          <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
            {responses.map((res, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg m-2 ${
                  res.from === "user"
                    ? "bg-blue-400 ml-auto"
                    : "bg-gray-100 dark:bg-gray-600 mr-auto"
                }`}
              >
                <div className="text-black dark:text-gray-100">
                  {res.from === "user" ? res.message : renderBotMessage(res.message)}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
            {isTyping && <p className="italic text-left m-2">Typing...</p>}
          </div>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Comic recommendations, Character info..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => (e.key === "Enter" ? handleSendMessages() : null)}
            margin="normal"
            className="bg-white dark:bg-gray-700"
          />
          <Button
            onClick={handleSendMessages}
            endIcon={<SendIcon />}
            color="primary"
            variant="contained"
            className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-lg mt-2"
          >
            Send
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Chatbot;