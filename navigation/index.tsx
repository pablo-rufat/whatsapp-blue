import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, Image, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './MainTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import { Octicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import ContactsScreen from '../screens/ContactsScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: Colors.light.tint,
        shadowOpacity: 0,
        elevation: 0
      },
      headerTintColor: Colors.light.background,
      headerTitleAlign: 'left',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }}>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{
          title: 'Whatsapp Blue',
          headerRight: () => (
            <View style={{
              flexDirection: 'row',
              width: 60,
              justifyContent: 'space-between',
              marginRight: 10
            }}>
              <Octicons name='search' size={22} color={'white'} />
              <MaterialCommunityIcons name='dots-vertical'size={22} color={'white'} />
            </View>
          )
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options= {({ route }) => ({
          headerTitle: (props) => <LogoTitle name={route.params.name} imageUri={route.params.imageUri} />,
          headerBackTitleVisible: false,
          headerRight: () => (
            <View style={{
              flexDirection: 'row',
              width: 100,
              justifyContent: 'space-between',
              marginRight: 10
            }}>
              <FontAwesome5 name='video' size={22} color={'white'}/>
              <MaterialIcons name='call' size={22} color={'white'}/>
              <MaterialCommunityIcons name='dots-vertical' size={22} color={'white'}/>
            </View>
          ),
        })}
      />
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

function LogoTitle(props: any) {
  return (
    <View style={styles.containerTitle}>
      <Image
        style={styles.avatarTitle}
        source={{ uri: props.imageUri }}
      />
      <Text style={styles.title}>{props.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 30,
  },
  avatarTitle: {
    width: 40,
    height: 40,
    marginRight: 15,
    borderRadius: 20,
  },
  containerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  }
});