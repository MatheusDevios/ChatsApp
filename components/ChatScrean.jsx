import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase/firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import Message from "./Message";
import TimeAgo from "timeago-react";
let content;

const ChatScrean = ({ chat, messages }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const endOfMessagesRef = useRef(null);
  const recipientUser = getRecipientEmail(chat.users, user);
  const [input, setInput] = useState("");
  const ref = doc(db, "chats", router.query.id);

  //PREP the messages on the server side
  const messagesRes = query(collection(ref, "messages"), orderBy("timestamp"));
  const [messagesSnapshot] = useCollection(messagesRes);
  const q = query(collection(db, "users"), where("email", "==", recipientUser));
  const [recipientSnapshot] = useCollection(q);

  useEffect(() => {
    scrollToBottom();
  }, []);

  if (messagesSnapshot) {
    content = messagesSnapshot.docs.map((message) => {
      return (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      );
    });
  } else {
    content = JSON.parse(messages).map((message) => {
      return <Message key={message.id} user={message.user} message={message} />;
    });
  }

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    //update the lastSeen
    setDoc(
      doc(db, "users", user.uid),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    addDoc(
      collection(doc(db, "chats", router.query.id), "messages"),
      {
        timestamp: serverTimestamp(),
        message: input,
        user: user.email,
        profilePicture: user.photoURL,
      },
      { merge: true }
    );

    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.profilePicture} />
        ) : (
          <Avatar src={recipientUser[0]} />
        )}

        <HeaderInformation>
          <h3>{recipientUser}</h3>
          {recipientSnapshot ? (
            <p>
              Last Active:{" "}
              {recipient?.lastSeen ? (
                <TimeAgo datetime={recipient?.lastSeen} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading last active...</p>
          )}
        </HeaderInformation>

        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {content}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
};

export default ChatScrean;

const Container = styled.div`
  flex: 1;
  height: 100vh;
  overflow: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: -4px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: 0;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 15px;
  margin: 0 15px;
`;

const MessageContainer = styled.div`
  padding: 25px;
  background-color: #e5ded8;
  min-height: 90vh;
  z-index: 0;
`;

const EndOfMessage = styled.div`
  padding-bottom: 40px;
`;

const HeaderIcons = styled.div``;
