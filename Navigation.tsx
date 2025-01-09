import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import RoleSelectionScreen from './RoleSelectionScreen';
import Login from './Login';
import Registration from './Registration';
import CustomDrawerContent from './screens/CustomDrawerContent';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import DashboardScreen from './screens/DashboardScreen';
import ServiceRequestsScreen from './screens/ServiceRequestsScreen';
import ServiceHistoryScreen from './screens/ServiceHistoryScreen';
import EarningsScreen from './screens/EarningsScreen';
import ChatScreen from './screens/ChatScreen';
import AvailabilityScreen from './screens/AvailabilityScreen';
import SupportScreen from './screens/SupportScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import AddUserServiceScreen from './screens/AddUserServiceScreen';
import EditServiceScreen from './screens/EditServiceScreen';
import CustomerDashboardScreen from './customerscreens/CustomerDashboardScreen';
import CustomerProfileScreen from './customerscreens/CustomerProfileScreen';
import CustomerChatScreen from './customerscreens/CustomerChatScreen';
import CustomerSettingsScreen from './customerscreens/CustomerSettingsScreen';
import CustomerSupportScreen from './customerscreens/CustomerSupportScreen';
import CustomDrawerCustomerContent from './customerscreens/CustomDrawerCustomerContent';
import CustomerEditProfileScreen from './customerscreens/CustomerEditProfileScreen';
import ServicesScreen from './customerscreens/ServicesScreen';
import CustomerBookingHistoryScreen from './customerscreens/CustomerBookingHistoryScreen';
import CustomerPaymentSummaryScreen from './customerscreens/CustomerPaymentSummaryScreen';
import CustomerReviewScreen from './customerscreens/CustomerReviewScreen';

// Define a mapping object for all your screen names and their corresponding labels.
const screenLabelMapping :  { [key: string]: string }= {
  Dashboard: 'Home',
  Profile: 'Profile',
  ServiceRequests: 'Requests',
  ServiceHistory: 'History',
  Earnings: 'Earnings',
  Chat: 'Messages',
  Availability: 'Availability',
  Settings: 'Settings',
  Support: 'Help & Support',
  CustomerDashboard: 'Home',
  CustomerProfile: 'Profile',
  CustomerServiceRequests: 'All Services',
  CustomerServiceHistory: 'Booking History',
  CustomerChat: 'Messages',
  CustomerSettings: 'Settings',
  CustomerSupport: 'Help & Support'
};

// Screens Configuration to reduce duplication
const screens = [
  { name: 'RoleSelection', component: RoleSelectionScreen },
  { name: 'Registration', component: Registration },
  { name: 'Login', component: Login },
  { name: 'EditProfile', component: EditProfileScreen },
  { name: 'AddUserService', component: AddUserServiceScreen },
  { name: 'EditService', component: EditServiceScreen },
  { name: 'CustomerEditProfile', component: CustomerEditProfileScreen },
  { name: 'CustomerPaymentSummary', component: CustomerPaymentSummaryScreen },
  { name: "CustomerReviewScreen", component: CustomerReviewScreen }
];

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


// Reusable function to create Drawer Navigators
const createDrawer = (
  screens: { name: string; component: React.FC<any> }[],
  CustomDrawerContent: React.FC<any>,
  initialRouteName: string,
  routeParams?: any
) => (
  <Drawer.Navigator
    initialRouteName={initialRouteName}
    drawerContent={(props: any) => (
      <CustomDrawerContent {...props} {...routeParams} />
    )}>
    {screens.map(({ name, component }) => (
      <Drawer.Screen key={name} name={name} component={component} 
      initialParams={{ userId : routeParams.userId, userDetails : routeParams.userDetails }} 
      options={{ 
        title: screenLabelMapping[name] || name,
        drawerLabel: screenLabelMapping[name] || name 
        }}  
/>
    ))}
  </Drawer.Navigator>
);


const mainScreens = [
  { name: 'Dashboard', component: DashboardScreen },
  { name: 'Profile', component: ProfileScreen },
  { name: 'ServiceRequests', component: ServiceRequestsScreen },
  { name: 'ServiceHistory', component: ServiceHistoryScreen },
  { name: 'Earnings', component: EarningsScreen },
  { name: 'Chat', component: ChatScreen },
  { name: 'Availability', component: AvailabilityScreen },
  { name: 'Settings', component: SettingsScreen },
  { name: 'Support', component: SupportScreen },
];


// Main Drawer Navigator (for regular users)
const MainDrawerNavigator: React.FC<any> = ({ route }) => {
  const { userId, userDetails } = route.params;

  return createDrawer(mainScreens, CustomDrawerContent, 'Dashboard', {
    userId,
    userDetails,
  });
};


const customerScreens = [
  { name: 'CustomerDashboard', component: CustomerDashboardScreen },
  { name: 'CustomerProfile', component: CustomerProfileScreen },
  { name: 'CustomerServiceRequests', component: ServicesScreen },
  { name: 'CustomerBookingHistory', component: CustomerBookingHistoryScreen },
  { name: 'CustomerChat', component: CustomerChatScreen },
  { name: 'CustomerSettings', component: CustomerSettingsScreen },
  { name: 'CustomerSupport', component: CustomerSupportScreen }
];

// Customer Drawer Navigator
const CustomerDrawerNavigator: React.FC<any> = ({ route }) => {
  const { userId, userDetails } = route.params;

  return createDrawer(customerScreens, CustomDrawerCustomerContent,'CustomerDashboard',{
     userId,
     userDetails,
    });
};


// Main Stack Navigator
const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="RoleSelection">
      {screens.map(({ name, component }) => (
        <Stack.Screen
          key={name}
          name={name}
          component={component}
          options={headerStyle}
        />
      ))}

      <Stack.Screen
        name="DrawerNavigator"
        component={MainDrawerNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CustomerDrawerNavigator"
        component={CustomerDrawerNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Header style extracted into a constant
const headerStyle = {
  title: 'ServiceHub',
  headerStyle: {
    backgroundColor: '#2874f0',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 22,
  },
};

export default AppNavigator;
