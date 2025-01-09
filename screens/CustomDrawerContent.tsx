import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

const CustomDrawerContent = ({ navigation, userId, userDetails }: DrawerContentComponentProps) => {
  const { fullName, role, imageUri } = userDetails;
  
  // Accessing the navigation state to get the current active route
  const currentRoute = navigation.getState().routes[navigation.getState().index].name;

  return (
    <View style={styles.container}>
      {/* Drawer Header Section */}
      <View style={styles.header}>
        <Image source={{ uri: imageUri }} style={styles.avatar} />
        <Text style={styles.username}>{fullName}</Text>
        <Text style={styles.userRole}>{role}</Text>
      </View>

      {/* Navigation Items */}
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')}
          style={[styles.menuItem, currentRoute === 'Dashboard' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'Dashboard' && styles.activeMenuText]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile', { userId })}
          style={[styles.menuItem, currentRoute === 'Profile' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'Profile' && styles.activeMenuText]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('ServiceRequests', { userId })}
          style={[styles.menuItem, currentRoute === 'ServiceRequests' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'ServiceRequests' && styles.activeMenuText]}>
            Service Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('ServiceHistory', { userId })}
          style={[styles.menuItem, currentRoute === 'ServiceHistory' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'ServiceHistory' && styles.activeMenuText]}>
            Service History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Earnings', { userId })}
          style={[styles.menuItem, currentRoute === 'Earnings' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'Earnings' && styles.activeMenuText]}>
            Earnings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat', { role })}
          style={[styles.menuItem, currentRoute === 'Chat' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'Chat' && styles.activeMenuText]}>
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Availability', { userId })}
          style={[styles.menuItem, currentRoute === 'Availability' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'Availability' && styles.activeMenuText]}>
            Availability
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings', { userId })}
          style={[styles.menuItem, currentRoute === 'Settings' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'Settings' && styles.activeMenuText]}>
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Support')}
          style={[styles.menuItem, currentRoute === 'Support' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'Support' && styles.activeMenuText]}>
            Support
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout Section */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Login', { role })} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// StyleSheet to style the drawer content
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#007bff',
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 15,
    color: '#f8f8f8',
  },
  menu: {
    flex: 1,
    paddingHorizontal: 8,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 15,
  },
  activeMenuItem: {
    backgroundColor: '#808080',
  },
  activeMenuText: {
    color: '#ffffff', 
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopColor: '#ddd',
  },
  logoutButton: {
    paddingVertical: 12,
    backgroundColor: '#f44336',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
