import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ChatListItem from '../components/ChatListItem';
import ChatRooms from '../constants/data/ChatRooms';
import { View } from '../components/Themed';
import NewMessageButton from '../components/NewMessageButton';
import API, { graphqlOperation } from '@aws-amplify/api';
import { getUser } from './queries';
import Auth from '@aws-amplify/auth';

export default function ChatScreen() {

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        
        const currentUser = await Auth.currentAuthenticatedUser();

        const userData = await API.graphql(
          graphqlOperation(
            getUser,
            {
              id: currentUser.attributes.sub
            }
          )
        );

        if (!userData.data.getUser.chatRoomUser || userData.data.getUser.chatRoomUser.items.lenght === 0) {
          setRooms([]);
        } else {

          const parsedRooms = userData.data.getUser.chatRoomUser.items.map(item => {

            return {
              id: item.chatRoomID,
              lastMessage: item.chatRoom.lastMessage ? {
                id: item.chatRoom.lastMessage.id,
                content: item.chatRoom.lastMessage.content,
                createdAt: item.chatRoom.lastMessage.createdAt,
                user: item.chatRoom.lastMessage.user,
              } : null,
              users: item.chatRoom.chatRoomUsers.items.map(user => user.user),
            };
          });

          setRooms(parsedRooms);
        }

      } catch (error) {
        console.error(error);
      }
    }

    fetchChatRooms();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={ rooms }
        renderItem={ ({ item }) => <ChatListItem chatRoom={item}/> }
        keyExtractor={ (item) => item.id }
        style={{ width: '100%' }}
      />
      <NewMessageButton/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});
