/**
 *
 * @format
 * @flow
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { Root } from 'native-base';
import { Provider } from 'react-redux';
import configureStore from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import Home from './containers/Home';

const store = configureStore();

class App extends React.Component {

  render() {
    const persistor = persistStore(store);
    
    return (
      <Root>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Home />
          </PersistGate>
        </Provider>
      </Root>
    )
  }
}

export default App;
