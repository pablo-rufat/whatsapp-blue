import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import ChatMessage from '../components/ChatMessage';
import BG from '../assets/images/BG.png';
import InputBox from '../components/InputBox';
import API, { graphqlOperation } from '@aws-amplify/api';
import { messagesByChatRoom } from '../src/graphql/queries';
import { onCreateMessage } from '../src/graphql/subscriptions';

export default function ChatRoomScreen() {

  const route = useRoute();
  const { chatRoomID } = route.params;

  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);

  const fetchMessages = async () => {
    const rawMessages = await API.graphql(
      graphqlOperation(
        messagesByChatRoom,
        {
          chatRoomID,
          sortDirection: "DESC",

        }
      )
    );

    setMessages(rawMessages.data.messagesByChatRoom.items);
  };

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(
        onCreateMessage
      )
    ).subscribe({
      next: (data) => {
        const newMessage = data.value.data.onCreateMessage
        if (newMessage.chatRoomID !== chatRoomID) {
          return;
        }
        
        fetchMessages();
        //setMessages([newMessage, ...messages]);
      }
    });

    return () => subscription.unsubscribe();

  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    const getMyId = async () => {
      const currentUser = await API.Auth.currentAuthenticatedUser();

      setMyId(currentUser.attributes.sub);
    };
    getMyId();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={{ width: '100%', height: '100%' }}
    >
      <ImageBackground style={{ width: '100%', height: '100%' }} source={BG}>
        <FlatList
          data={ messages }
          renderItem={({ item }) => <ChatMessage message={item} myId={myId}/>}
          inverted
        />
        <InputBox chatRoomID={chatRoomID}/>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}