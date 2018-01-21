import '../fonts/fonts';
import './index.scss';

import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

import AppRouter from '../routes/routes';

const httpLink = new HttpLink({ uri: 'http://localhost:3000/graphql' });
const inMemoryCache = new InMemoryCache();
const client = new ApolloClient({
  link: httpLink,
  cache: inMemoryCache
});

let app = document.getElementById('app');

render(
  <ApolloProvider client={client}>
    <AppRouter />
  </ApolloProvider>,
  app
);
