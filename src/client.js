import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from '@apollo/client';

const getToken = () => {
  return localStorage.getItem('token');
};

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = getToken();

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: 'http://localhost:8081',
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});

export default client;