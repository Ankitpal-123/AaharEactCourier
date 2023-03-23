import { useRef, useMemo, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import OrderItem from "../../../components/OrderItem/Index,";
import orders from "../../../../assets/data/orders.json";
import MapView, { Marker } from "react-native-maps";
import { Entypo } from "@expo/vector-icons";
import { DataStore } from "aws-amplify";
import { Order } from "../../../models";

const OrderScreen = () => {
  // const [orders, setOrders] = useState([]);
  const snapPoints = useMemo(() => ["12%", "90%"], []);
  const { width, height } = useWindowDimensions();
  const bottomSheetRef = useRef(null);

  // useEffect(() => {
  //   DataStore.query(Order, (order) =>
  //     order.status("eq", "READY_FOR-PICKUP")
  //   ).then(setOrders);
  // }, []);

  return (
    <View style={{ backgroundColor: "lightblue", flex: 1 }}>
      <MapView style={{ height, width }} showsUserLocation followsUserLocation>
        {orders.map((order) => (
          <Marker
            key={order.id}
            title={order.Restaurant.name}
            description={order.Restaurant.address}
            coordinate={{
              latitude: order.Restaurant.lat,
              longitude: order.Restaurant.lng,
            }}
          >
            <View
              style={{ backgroundColor: "red", padding: 5, borderRadius: 50 }}
            >
              <Entypo name="shop" size={20} color="white" />
            </View>
          </Marker>
        ))}
      </MapView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: "grey" }}
      >
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "600",
              letterSpacing: 0.5,
              paddingBottom: 5,
            }}
          >
            You're Online
          </Text>
          <Text>Availabe Orders : {orders.length}</Text>
        </View>
        <BottomSheetFlatList
          data={orders}
          renderItem={({ item }) => <OrderItem order={item} />}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </BottomSheet>
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({});
