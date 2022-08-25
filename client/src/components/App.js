import React from 'react';
import './App.css';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom';
import CreatePost from './CreatePost';
import UnsplashList from './UnsplashList';
import ImageList from './ImageList';

const client = new ApolloClient({ 
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000/'
  })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className = 'App-header'>
            <h1 className='App-title'> <NavLink className='navlink-2' to='/'>Binterest</NavLink> </h1>
          </header>
          <nav className='nav'>
            <NavLink className='navlink' to='/my-bin'>my bin</NavLink>
            <NavLink className='navlink' to='/'>images</NavLink>
            <NavLink className='navlink' to='/my-posts'>my posts</NavLink>
          </nav>
          <Route exact path='/'>
            <UnsplashList/>
          </Route>
          <Route exact path='/my-bin'>
            <ImageList bin={true} posts={false}/>
          </Route>
          <Route exact path='/my-posts'>
            <ImageList bin={false} posts={true}/>
          </Route>
          <Route exact path='/new-post' component={CreatePost}/>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
