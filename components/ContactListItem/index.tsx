import React from 'react';
import { Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { User } from '../../types';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import API, { graphqlOperation } from '@aws-amplify/api';
import { createChatRoom, createChatRoomUser } from '../../src/graphql/mutations';
import Auth from '@aws-amplify/auth';
import { listChatRoomUsersOnlyId } from '../../screens/queries';

export type ContactListItemProps = {
    user: User;
};

const ContactListItem = ( props: ContactListItemProps ) => {

    const navigation = useNavigation();

    const { user } = props;

    const onClick = async () => {
        try {
            const currentUser = await Auth.currentAuthenticatedUser();

            // check if a chatroom already exists
            const myChatRooms = await API.graphql(
                graphqlOperation(
                    listChatRoomUsersOnlyId,
                    {
                        filter: {userID: {eq: currentUser.attributes.sub}}
                    }
                )
            );
            const theirChatRooms = await API.graphql(
                graphqlOperation(
                    listChatRoomUsersOnlyId,
                    {
                        filter: {userID: {eq: user.id}}
                    }
                )
            );

            let chatRoomId = null;

            for (const room of myChatRooms.data.listChatRoomUsers.items) {
                for (const theirRoom of theirChatRooms.data.listChatRoomUsers.items) {
                    if ( room.chatRoomID === theirRoom.chatRoomID) {
                        chatRoomId = room.chatRoomID;
                    }
                }   
            }

            if (!chatRoomId) {

                // create new chatroom
                const newChatRoomData = await API.graphql(
                    graphqlOperation(
                        createChatRoom,
                        {input: {}}
                    )
                );

                if (!newChatRoomData.data) {
                    console.error("failed to create a chat room");
                    return;
                }

                const newChatRoom = newChatRoomData.data.createChatRoom;

                // add user to the chatroom
                await API.graphql(
                    graphqlOperation(
                        createChatRoomUser,
                        {
                            input: {
                                userID: user.id,
                                chatRoomID: newChatRoom.id
                            }
                        }
                    )
                );

                // add current user to the chatroom
                await API.graphql(
                    graphqlOperation(
                        createChatRoomUser,
                        {
                            input: {
                                userID: currentUser.attributes.sub,
                                chatRoomID: newChatRoom.id
                            }
                        }
                    )
                );

                chatRoomId = newChatRoom.id;
            }

            navigation.navigate('ChatRoom', {
                chatRoomID: chatRoomId,
                name: user.name,
                imageUri: user.imageUri,
            });

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={onClick}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <Image source={{ uri: user.imageUri }} style={styles.avatar}/>
                    <View style={styles.midContainer}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text numberOfLines={1} style={styles.status}>{user.status}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default ContactListItem;