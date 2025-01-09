import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

const CustomDrawerCustomerContent = ({ navigation, userId, userDetails }: DrawerContentComponentProps) => {
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
          onPress={() => navigation.navigate('CustomerDashboard', { userId })}
          style={[styles.menuItem, currentRoute === 'CustomerDashboard' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'CustomerDashboard' && styles.activeMenuText]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CustomerProfile', { userId })}
          style={[styles.menuItem, currentRoute === 'CustomerProfile' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'CustomerProfile' && styles.activeMenuText]}>
            Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CustomerServiceRequests', { userId })}
          style={[styles.menuItem, currentRoute === 'CustomerServiceRequests' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'CustomerServiceRequests' && styles.activeMenuText]}>
            Service Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CustomerBookingHistory', { userId })}
          style={[styles.menuItem, currentRoute === 'CustomerBookingHistory' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'CustomerBookingHistory' && styles.activeMenuText]}>
            Service History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CustomerChat', { role })}
          style={[styles.menuItem, currentRoute === 'CustomerChat' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'CustomerChat' && styles.activeMenuText]}>
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CustomerSettings', { userId })}
          style={[styles.menuItem, currentRoute === 'CustomerSettings' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'CustomerSettings' && styles.activeMenuText]}>
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CustomerSupport')}
          style={[styles.menuItem, currentRoute === 'CustomerSupport' && styles.activeMenuItem]}
        >
          <Text style={[styles.menuText, currentRoute === 'CustomerSupport' && styles.activeMenuText]}>
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

export default CustomDrawerCustomerContent;
