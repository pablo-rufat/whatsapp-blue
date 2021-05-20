import React, { useEffect, useState } from 'react';
import { Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { ChatRoom } from '../../types';
import styles from './styles';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import API from '@aws-amplify/api';

export type ChatListItemProps = {
    chatRoom: ChatRoom;
};

const ChatListItem = ( props: ChatListItemProps ) => {

    const navigation = useNavigation();

    const { chatRoom } = props;

    const [otherUser, setOtherUser] = useState(null);

    useEffect (() => {
        const getUsers = async () => {
            const currentUser = await API.Auth.currentAuthenticatedUser();
            chatRoom.users.map( user => {
                if (user.id !== currentUser.attributes.sub) {
                    setOtherUser(user);
                }
            });
        }

        getUsers();
    }, []);

    const onClick = () => {
        navigation.navigate('ChatRoom', { chatRoomID: chatRoom.id, name: otherUser.name, imageUri: otherUser.imageUri });
    };

    if(!otherUser) return null;

    console.log(chatRoom);

    return (
        <TouchableWithoutFeedback onPress={onClick}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <Image source={{ uri: otherUser.imageUri }} style={styles.avatar}/>
                    <View style={styles.midContainer}>
                        <Text style={styles.userName}>{otherUser.name}</Text>
                        <Text numberOfLines={1} style={styles.lastMessage}>{chatRoom.lastMessage ? `${chatRoom.lastMessage.user.name}: ${chatRoom.lastMessage.content}` : `Start a conversation with ${otherUser.name}`}</Text>
                    </View>
                </View>
                <Text style={styles.time}>{chatRoom.lastMessage ? parseDate(chatRoom.lastMessage.createdAt) : ''}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const parseDate = (date: string): string => {
    if (moment(date).isSame(moment(), 'day')) {
        return moment(date).format('hh:mm');
    } else if (moment(date).isSame(moment().subtract(1, 'day'), 'day')) {
        return 'Yesterday'
    } else {
        return moment(date).format('DD/MM/YYYY');
    }
};

export default ChatListItem;