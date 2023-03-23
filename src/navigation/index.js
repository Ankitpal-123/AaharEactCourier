import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderDeliveryScreen from "../components/screens/OrderDelivery";
import OrderScreen from "../components/screens/OrderScreen/Index";
import { useAuthContext } from "../context/AuthContex";
import Profile from "../components/screens/ProfileScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { dbCourier } = useAuthContext();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {dbCourier ? (
        <>
          <Stack.Screen name="OrderScreen" component={OrderScreen} />
          <Stack.Screen
            name="OrderDeliveryScreen"
            component={OrderDeliveryScreen}
          />
        </>
      ) : (
        <Stack.Screen name="Profile" component={Profile} />
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
