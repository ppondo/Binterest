import { gql } from '@apollo/client';

const GET_IMAGES = gql`
    query {
        ImagePost {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`

const UNSPLASH_IMAGES = gql`
    query($pagenum: Int) {
        unsplashImages(pagenum: $pagenum) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    } 
`;

const BINNED_IMAGES = gql`
    query {
        binnedImages {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`

const USER_POSTED_IMAGES = gql`
    query {
        userPostedImages {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`

const UPLOAD_IMAGE = gql`
mutation createImage($url: String!, $description: String, $posterName: String) {
    uploadImage(url: $url, description: $description, posterName: $posterName) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`

const UPDATE_IMAGE = gql`
mutation editImage($id: ID!, $url: String, $posterName: String, $description: String, $userPosted: Boolean, $binned: Boolean) {
    updateImage(id: $id, url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`

const DELETE_IMAGE = gql`
  mutation removeImage($id: ID!) {
    deleteImage(id: $id) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`

let exported = {
    GET_IMAGES,
    UNSPLASH_IMAGES,
    BINNED_IMAGES,
    USER_POSTED_IMAGES,
    UPLOAD_IMAGE,
    UPDATE_IMAGE,
    DELETE_IMAGE
  };
  
  export default exported;