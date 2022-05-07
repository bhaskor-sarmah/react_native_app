import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { LoginScreen, HomeScreen, FacingIssueScreen, OtpScreen } from './src/screens'
import {decode, encode} from 'base-64'
import { firebase, auth } from './src/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'

if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

export default function App() {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getDocumentById("users", user.uid)
          .then((userData) => {
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            console.log(error)
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);

  if (loading) {	
    return (	
      <></>	
    )	
  }else{
    return (
      <NavigationContainer>
        <Stack.Navigator>
          { user ? (
            <Stack.Screen name="Home">
              {props => <HomeScreen {...props} extraData={user} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="FacingIssueScreen" component={FacingIssueScreen} />
              <Stack.Screen name="OtpScreen" component={OtpScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}