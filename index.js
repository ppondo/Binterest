const {ApolloServer, gql} = require('apollo-server');
const lodash = require('lodash');
const uuid = require('uuid');
const axios = require('axios');
const redis = require('redis');
const bluebird = require('bluebird');
const client = redis.createClient();

// type ImagePost {
//     id: ID!
//     url: String!
//     posterName: String!
//     description: String
//     userPosted: Boolean!
//     binned: Boolean!
// }

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const typeDefs = gql`
    type Query {
        unsplashImages(pagenum: Int): [ImagePost]
        binnedImages: [ImagePost]
        userPostedImages: [ImagePost]
        ImagePost:[ImagePost]
    }

    type ImagePost {
        id: ID!
        url: String!
        posterName: String!
        description: String
        userPosted: Boolean!
        binned: Boolean!
    }

    type Mutation {
        uploadImage(url: String!, description: String, posterName: String): ImagePost
        updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean): ImagePost
        deleteImage(id: ID!): [ImagePost]
    }
`

const resolvers = {
    Query: {
        unsplashImages: async (_, args) => {
            let url = `https://api.unsplash.com/photos?page=${args.pagenum}`
            const response = await axios.get(url, {
                headers: {
                Authorization: 'Client-ID L8d1FcJ_rPJXjaEoP-404sfhlKzpYPnswebhUr9zyZE',
                },
            });
            let newImages = response.data.map((element) => {
              return {
                  id: element.id,
                  url: element.urls.small, 
                  posterName: element.user.name,
                  description: element.description, 
                  userPosted: false,
                  binned: false,
                }
            });
            let images = await client.getAsync('ImagePost');
            images = JSON.parse(images);
            let imageIds = images.posts.map((e) => e.id);
            result = newImages.filter((e) => !imageIds.includes(e.id));
            return result;
        },
        binnedImages: async () => {
            let images = await client.getAsync('ImagePost');
            images = JSON.parse(images);
            return images.posts.filter((e) => e.binned === true);
        },
        userPostedImages: async () => {
            let images = await client.getAsync('ImagePost');
            images = JSON.parse(images);
            return images.posts.filter((e) => e.userPosted === true)
        },
        ImagePost: async () => {
            let images = await client.getAsync('ImagePost');
            images = JSON.parse(images);
            return images.posts
        }
    },

    Mutation: {
        uploadImage: async (_,args) => {
            const newImage = {
                id: uuid.v4(),
                url: args.url, 
                posterName: args.posterName,
                description: args.description, 
                userPosted: true,
                binned: false,
            };
            // ImagePost.push(newImage);
            images = await client.getAsync('ImagePost');
            images = JSON.parse(images);
            images.posts.push(newImage);
            await client.setAsync('ImagePost', JSON.stringify(images));
        },
        deleteImage: async (_,args) => {
            images = await client.getAsync('ImagePost');
            images = JSON.parse(images);
            images.posts = images.posts.filter( (e) => e.id !== args.id);
            await client.setAsync('ImagePost', JSON.stringify(images));
            console.log(images.posts);
            return images.posts;
        },
        updateImage: async (_,args) => {
            images = await client.getAsync('ImagePost');
            images = JSON.parse(images);
            let exists = images.posts.filter((e) => e.id === args.id);
            if (exists.length > 0) {
                images.posts = images.posts.map((e) => {
                    if (e.id === args.id) {
                        if (args.binned !== null) {
                            e.binned = args.binned
                        }
                        return e; 
                    }
                    return e;
                });
            } else {
                let page;
                if(args.pagenum) page = args.pagenum;
                images.posts.push({
                    id: args.id,
                    url: args.url, 
                    posterName: args.posterName,
                    description: args.description, 
                    userPosted: args.userPosted,
                    binned: args.binned,
                    pagenum: page
                });
            }
            let result = images.posts.filter((e) => e.id === args.id);
            images.posts = images.posts.filter((e) => e.binned !== false || e.userPosted !== false)
            await client.setAsync('ImagePost', JSON.stringify(images));
            return result[0];   
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers});

const main = async () => {
    let ImagePost = {
        posts:[
            {
                id: uuid.v4(),
                url: "https://images.unsplash.com/photo-1627662055469-179b03a4a763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTQxMTZ8MXwxfGFsbHwxfHx8fHx8Mnx8MTYyOTE0NzgwMQ&ixlib=rb-1.2.1&q=80&w=400",
                posterName: 'Patrick',
                description: 'A nice plate of chicken nuggets',
                userPosted: true,
                binned: true
            },
        ]
    }   

    ImagePost = JSON.stringify(ImagePost)
    await client.setAsync('ImagePost', ImagePost)
}

server.listen().then( async ({ url }) => {
    await main();
    console.log(`server ready at ${url}`)
});
