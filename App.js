import { StatusBar } from 'expo-status-bar';
import { Alert, Button, Platform, StyleSheet, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";
import Constants from 'expo-constants';

// This notification handler is used to configure how notifications are displayed
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

export default function App() {
  useEffect(() => {
    const configurePushNotifications = async () => {
      // Request permission to show notifications
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (finalStatus !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        finalStatus = newStatus;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          "Permission required",
          "You need to enable notifications in your settings to use this feature.",
          [{ text: "OK" }]
        );
        return;
      }

      const projectId = "9a1b6ebc-262f-4e7b-ac9f-7e9121ba25fb"; 
      const pushTokenData = await Notifications.getExpoPushTokenAsync({ projectId });
      const pushToken = pushTokenData.data;
      console.log("Push token:", pushToken);

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    };

    configurePushNotifications();
  }, []);

  useEffect(() => {
    // Reacting to incoming notifications
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const userName = notification.request.content.data.userName;
      console.log("User name:", userName);
    });

    // Reacting to user interaction with incoming notifications
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const userName = response.notification.request.content.data.userName;
      console.log("User name from response:", userName);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  const scheduleNotificationHandler = () => {
    // Schedule a local notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first local notification",
        body: "This is the body of the notification",
        data: {
          userName: "Rehan",
        },
      },
      trigger: {
        seconds: 5,
      },
    });
  };

  const sendPushNotificationHandler = async () => {
    // Send a push notification
    const message = {
      to: 'ExponentPushToken[sgWxMVKV5gqyNke1O6d4wl]',
      sound: 'default',
      title: 'Test Notification',
      body: 'This is a test notification',
      data: { userName: 'Rehan' },
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      const data = await response.json();
      console.log("Push notification response:", data);
    }
    catch (error) {
      console.error("Error sending push notification:", error);
      Alert.alert(
        "Error",
        "Failed to send push notification. Please try again later.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={scheduleNotificationHandler}
      />
      <Button
        title="Send Push Notification"
        onPress={sendPushNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
