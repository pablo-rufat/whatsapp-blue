

export const getUser = /* GraphQL */ `
query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    imageUri
    status
    chatRoomUser {
      items {
        id
        userID
        chatRoomID
        createdAt
        updatedAt
        chatRoom {
            id
            chatRoomUsers {
                items {
                    user {
                        id
                        name
                        imageUri
                        status
                    }
                }
            },
            lastMessage {
              id
              content
              createdAt
              user {
                id
                name
              }
            }
        }
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}
`;

export const listChatRoomUsersOnlyId = /* GraphQL */ `
  query ListChatRoomUsersOnlyId(
    $filter: ModelChatRoomUserFilterInput
  ) {
    listChatRoomUsers(filter: $filter) {
      items {
        id
        chatRoomID
      }
    }
  }
`;