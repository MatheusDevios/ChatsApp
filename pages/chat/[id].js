import {
  doc,
  getDoc,
  collection,
  orderBy,
  query,
  getDocs,
} from "firebase/firestore";
import Head from "next/head";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScrean from "../../components/ChatScrean";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import getRecipientEmail from "../../utils/getRecipientEmail";

const Chat = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScrean chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
};

export default Chat;

export async function getServerSideProps(context) {
  const ref = doc(db, "chats", context.query.id);

  //PREP the messages on the server side
  const messagesRes = query(collection(ref, "messages"), orderBy("timestamp"));
  const messagesDoc = await getDocs(messagesRes);

  const messages = messagesDoc?.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  // PREP the chats
  const chatsResponse = await getDoc(ref);

  const chat = {
    id: chatsResponse.id,
    ...chatsResponse.data(),
  };

  // console.log(chat, messages);
  return {
    props: {
      chat: chat,
      messages: JSON.stringify(messages),
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
`;
