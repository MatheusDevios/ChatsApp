import React from "react";
import styled from "styled-components";

const ChatScrean = () => {
  return <Container>ChatScrean</Container>;
};

export default ChatScrean;

const Container = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
