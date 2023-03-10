import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderDeliveryScreen from "../components/screens/OrderDelivery";
import OrderScreen from "../components/screens/OrderScreen/Index";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrderScreen" component={OrderScreen} />
      <Stack.Screen
        name="OrderDeliveryScreen"
        component={OrderDeliveryScreen}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
