import { Entypo, FontAwesome5, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { createMessage, updateChatRoom } from '../../src/graphql/mutations';


export type InputBoxProps = {
    chatRoomID: string;
};

const InputBox = (props: InputBoxProps) => {

    const { chatRoomID } = props;

    const [message, setMessage] = useState('');
    const [myUserId, setMyUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await Auth.currentAuthenticatedUser();
            setMyUserId(currentUser.attributes.sub);
        };
        
        fetchUser();
    }, []);

    const onMicrophonePress = () => {
        console.warn('Microphone');
    };

    const updateChatRoomLastmessage = async (messageId: string) => {

        try {
            await API.graphql(
                graphqlOperation(
                    updateChatRoom,
                    {
                        input: {
                            id: chatRoomID,
                            lastMessageID: messageId
                        }
                    }
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const onSendPress = async () => {
  
        try {
            const newMessageData = await API.graphql(
                graphqlOperation(
                    createMessage,
                    {
                        input: {
                            content: message,
                            userID: myUserId,
                            chatRoomID,
                        }
                    }
                )
            );

            await updateChatRoomLastmessage(newMessageData.data.createMessage.id);
        } catch (error) {
            console.error(error);
        }

        setMessage('');
    };

    const onPress = () => {
        if (!message) {
            onMicrophonePress();
        } else {
            onSendPress();
        }
    }

  return (
    <View style={styles.container}>
        <View style={styles.mainContainer}>
            <FontAwesome5 name='laugh-beam' size={24} color='grey'/>
            <TextInput
            placeholder={'Type a message'}
                style={styles.textInput}
                multiline
                value={message}
                onChangeText={setMessage}
            />
            <Entypo name='attachment' size={24} color='grey' style={styles.icons}/>
            { !message && <Fontisto name='camera' size={24} color='grey' style={styles.icons}/> }
        </View>
        <TouchableOpacity onPress={onPress}>
            <View style={styles.buttonContainer}>
                {
                    !message
                        ? <MaterialCommunityIcons name='microphone' size={28} color='white'/>
                        : <MaterialIcons name='send' size={28} color='white'/>
                }
            </View>
        </TouchableOpacity>
    </View>
  );
}

export default InputBox;