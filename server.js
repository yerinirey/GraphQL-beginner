import { ApolloServer, gql } from "apollo-server"; 
import fetch from "node-fetch";
let tweets = [
    {
        id: "1",
        text:" first one",
        userId:"2"
    },
    {
        id: "2",
        text:" second one",
        userId:"1"
    },
    {
        id:"3",
        text: "third one",
        userId:"3"
    }
]
let users = [
  {
    id: "1",
    firstName: "User1",
    lastName: "one",
  },
  {
    id: "2",
    firstName: "User2",
    lastName: "two",
  },
];

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        firstName: String!
        lastName: String!
        """
        Is the sum of firstName + lastName as a String
        """
        fullName: String!
    }
    """
    Tweet object represents a resource for a Tweet
    """
    type Tweet {
        id: ID!
        text: String!
        author: User

    }
    type Query {
        allMovies: [Movie!]!
        movie(id:String!): Movie
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
    }
    type Mutation{
        postTweet(text: String!, userId: ID!): Tweet
        """
        Deletes a Tweet if found, else returns false
        """
        deleteTweet(id: ID!): Boolean!
    }
    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String]!
        summary: String
        description_full: String
        synopsis: String
        yt_trailer_code: String!
        language: String!
        mpa_rating: String
        background_image: String!
        background_image_original: String!
        small_cover_image: String!
        medium_cover_image: String!
        large_cover_image: String!
        state: String!
    }
`;
const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
        console.log("all Users Called");
        return users;
    },
    allMovies() {
        return fetch("https://yts.torrentbay.to/api/v2/list_movies.json").
        then((r) => r.json()).
        then((json) => json.data.movies);
    },
    movie(_, {id}) {
        return fetch(`https://yts.torrentbay.to/api/v2/movie_details.json?movie_id=${id}`)
      .then((r) => r.json())
      .then((json) => json.data.movie);
    }
  },
  Mutation: {
    postTweet(_, {text, userId}) {
        const newTweet={
            id: tweets.length + 1,
            text,
            userId,
        };
        tweets.push(newTweet);
        return newTweet;
    },
    deleteTweet(_, {id}) {
        const tweet = tweets.find(tweet => tweet.id === id);
        if(!tweet) return false;
        tweets = tweets.filter(tweet => tweet.id !== id);
        return true;
    },
  },
  User: {
    fullName({firstName, lastName}) {
        return `${firstName} ${lastName}`;
    }
  },
  Tweet:{
    author({userId}) {
        const result = users.find((user) => user.id === userId);
        if(!result) {
            console.log("No Tweets Exists.");
            return null;
        }
        return result;
    }
  }
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
});