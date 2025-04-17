import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";

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

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={scheduleNotificationHandler}
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
