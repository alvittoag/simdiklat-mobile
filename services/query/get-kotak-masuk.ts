import { gql } from "@apollo/client";

export const getKotakMasuk = gql`
  query GetMessageInbox(
    $page: Int
    $limit: Int
    $search: String
    $isArchive: Boolean
  ) {
    messageInbox(
      page: $page
      limit: $limit
      search: $search
      isArchive: $isArchive
    ) {
      items {
        id
        from_
        subject
        message
        read_notify
        created_at
        sender {
          id
          full_name
        }
      }
      total
      hasMore
    }
  }
`;

export const getKontakKeluar = gql`
  query GetMessageOutbox($page: Int, $limit: Int, $search: String) {
    messageOutbox(page: $page, limit: $limit, search: $search) {
      items {
        id
        from_
        subject
        message
        read_notify
        created_at
        receiver {
          id
          full_name
        }
      }
      total
      hasMore
    }
  }
`;
