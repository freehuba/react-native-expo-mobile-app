import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppWithDrawer from './Navigation'; // Import your main navigator

const App = () => {
  return (
    <NavigationContainer>
      <AppWithDrawer />
    </NavigationContainer>
  );
};

export default App;
