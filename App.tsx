import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { getUser } from './src/graphql/queries';
import { createUser } from './src/graphql/mutations';

import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const getRandomImage = () => {
    const id = Math.floor(Math.random() * 30);
    return `https://picsum.photos/id/${id}/200/200`;
  };

  // run this only the app is first mounted
  useEffect(() => {
    const fetchUser = async () => {
      // get authenticated user from auth
      const userInfo = await Auth.currentAuthenticatedUser({ bypassCache: true });

      if (userInfo) {
        // get the user from backend with user sub from auth
        const userData = await API.graphql(
          graphqlOperation(
            getUser,
            { 
              id: userInfo.attributes.sub 
            }
          )
        );

        if (userData.data.getUser) {
          console.log('user already registered.');
          return;
        }

        // if !user in db, create one
        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          imageUri: getRandomImage(),
          status: 'Hey! I am using Whatsapp blue!'
        };

        API.graphql(
          graphqlOperation(
            createUser,
            {
              input: newUser
            }
          )
        );
      }
    };

    fetchUser();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App);