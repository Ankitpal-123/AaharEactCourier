import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

const OrderItem = ({ order }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate("OrderDeliveryScreen", { id: order.id })
      }
    >
      <View style={styles.order}>
        <Image
          source={{ uri: order.Restaurant.image }}
          style={styles.img}
          // style={{ width: 50, height: 50 }}
        />
        <View style={styles.details}>
          <Text style={styles.name}>{order.Restaurant.name}</Text>
          <Text style={{ color: "grey" }}>{order.Restaurant.address}</Text>

          <Text style={{ marginTop: 10 }}>Delivery Details:</Text>
          <Text style={{ color: "grey" }}>{order.User.name}</Text>
          <Text style={{ color: "grey" }}>{order.User.address}</Text>
        </View>
        <View style={styles.entypo}>
          <Entypo
            name="check"
            size={30}
            color="white"
            style={{ alignItems: "center", justifyContent: "center" }}
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </Pressable>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  order: {
    flexDirection: "row",
    borderColor: "#3FC060",
    borderWidth: 3,
    borderRadius: 12,
    margin: 10,
  },
  img: {
    height: "100%",
    width: "25%",
    borderBottomLeftRadius: 10,
    borderBottomLeftRadius: 10,
    padding: 5,
  },
  details: {
    margin: 10,
    flex: 1,
    paddingVertical: 5,
  },
  name: {
    fontSize: 18,
    marginTop: -10,
    fontWeight: "bold",
  },
  entypo: {
    marginLeft: "auto",
    backgroundColor: "#3FC060",
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
