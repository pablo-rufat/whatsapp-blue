import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import ContactListItem from '../components/ContactListItem';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { listUsers } from '../src/graphql/queries';

export default function ContactsScreen() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await API.graphql(
          graphqlOperation(
            listUsers
          )
        )

        const currentUser = await Auth.currentAuthenticatedUser();
        const userList = userData.data.listUsers.items.filter(item => item.id !== currentUser.attributes.sub );

        setUsers(userList);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={ users }
        renderItem={ ({ item }) => <ContactListItem user={item}/> }
        keyExtractor={ (item) => item.id }
        style={{ width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  }
});
