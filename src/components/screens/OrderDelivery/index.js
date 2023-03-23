import { useMemo, useRef, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import orders from "../../../../assets/data/orders.json";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Order } from "../../../models";
import { DataStore } from "aws-amplify";

const order = orders[0];

const ORDER_STATUSES = {
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
};

const OrderScreen = () => {
  const [order, setOrder] = useState(null);
  const snapPoints = useMemo(() => ["12%", "90%"], []);
  const navigation = useNavigation();
  const route = useRoute();
  const id = route.params?.id;
  const mapRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const bottomSheetRef = useRef(null);

  const [driverLocation, setDriverLocation] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [totalKm, setTotalKm] = useState(0);
  const handleSheetChanges = (index) => {
    console.log("Sheet index changed to", index);
  };
  const [deliveryStatus, setDeliveryStatus] = useState(
    ORDER_STATUSES.READY_FOR_PICKUP
  );
  const [isDriverClose, setIsDriverClose] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    DataStore.query(Order.id).then(setOrder);
  }, [id]);
  useEffect(() => {
    async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (!status === "granted") {
        console.log("Nomono");
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setDriverLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 100,
      },
      (updatedLocation) => {
        setDriverLocation({
          latitude: updatedLocation.coords.latitude,
          longitude: updatedLocation.coords.longitude,
        });
      }
    );
    return foregroundSubscription;
  }, [id]);

  const restauratLocation = {
    latitude: order?.Restaurant?.lat,
    longitude: order?.Restaurant?.lng,
  };
  const deliveryLocation = {
    latitude: order?.User?.lat,
    longitude: order?.User?.lng,
  };

  if (!driverLocation) {
    return <ActivityIndicator size={"large"} />;
  }
  if (!order || driverLocation) {
    return <ActivityIndicator size={"large"} color="grey" />;
  }

  const onButtonpressed = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      bottomSheetRef.current?.collapse();
      mapRef.current.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setDeliveryStatus(ORDER_STATUSES.ACCEPTED);
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      bottomSheetRef.current?.collapse();
      setDeliveryStatus(ORDER_STATUSES.PICKED_UP);
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP) {
      bottomSheetRef.current?.collapse();
      navigation.goBack();
    }
  };

  const renderButtonTitle = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      return "Accept Order";
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      return "Pick-Up Order";
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP) {
      return "Complete Order";
    }
  };

  const isButtonDisabled = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      return false;
    }
    if (deliveryStatus === ORDER_STATUSES.ACCEPTED && isDriverClose) {
      return false;
    }
    if (deliveryStatus === ORDER_STATUSES.PICKED_UP && isDriverClose) {
      return false;
    }
  };

  if (!order || driverLocation) {
    return <ActivityIndicator size={"large"} color="grey" />;
  }
  return (
    <View style={{ backgroundColor: "lightblue", flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ height, width }}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.07,
          longitudeDelta: 0.07,
        }}
      >
        <MapViewDirections
          origin={driverLocation}
          destination={
            deliveryStatus === ORDER_STATUSES.ACCEPTED
              ? restauratLocation
              : deliveryLocation
          }
          strokeWidth={10}
          strokeColor="#3FC060"
          waypoints={
            deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP
              ? [restauratLocation]
              : []
          }
          apikey={"AIzaSyA40_jSaAHHq633o3HKJujVrMHv9gcSV3E"}
          onReady={(result) => {
            setIsDriverClose(result.distance <= 0.1);
            setTotalMinutes(result.duration);
            setTotalKm(result.distance);
          }}
        />
        <Marker
          coordinate={{
            latitude: order.Restaurant.lat,
            longitude: order.Restaurant.lng,
          }}
          title={order.Restaurant.name}
          description={order.Restaurant.address}
        >
          <View
            style={{ backgroundColor: "red", padding: 5, borderRadius: 50 }}
          >
            <Entypo name="shop" size={30} color="white" />
          </View>
        </Marker>
        <Marker
          coordinate={{
            latitude: order.User.lat,
            longitude: order.User.lng,
          }}
          title={order.User.name}
          description={order.User.address}
        >
          <View
            style={{ backgroundColor: "green", padding: 5, borderRadius: 50 }}
          >
            <MaterialIcons name="restaurant" size={30} color="black" />
          </View>
        </Marker>
      </MapView>
      <Ionicons
        onPress={() => navigation.goBack()}
        name="arrow-back-circle"
        size={45}
        color="black"
        style={{ top: 30, position: "absolute" }}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleIndicatorStyle={{ backgroundColor: "grey" }}
      >
        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 25, letterSpacing: 1 }}>
            {totalMinutes.toFixed(0)} Min
          </Text>
          <FontAwesome5
            name="shopping-bag"
            size={30}
            color="#3FC060"
            style={{ marginHorizontal: 10 }}
          />
          <Text style={{ fontSize: 25, letterSpacing: 1 }}>
            {totalKm.toFixed(2)}Km
          </Text>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 25, letterSpacing: 1, paddingVertical: 20 }}>
            {order.Restaurant.name}
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <Fontisto name="shopping-store" size={22} color="grey" />
            <Text
              style={{
                fontSize: 20,
                color: "grey",
                fontWeight: "500",
                letterSpacing: 0.5,
                marginLeft: 15,
                textAlign: "center",
              }}
            >
              {order.Restaurant.address}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <FontAwesome5 name="map-marker-alt" size={30} color="grey" />
            <Text
              style={{
                fontSize: 20,
                color: "grey",
                fontWeight: "500",
                letterSpacing: 0.5,
                marginLeft: 15,
                textAlign: "center",
              }}
            >
              {order.User.address}
            </Text>
          </View>
          <View
            style={{ borderTopWidth: 1, borderColor: "grey", paddingTop: 20 }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "grey",
                fontWeight: "500",
                letterSpacing: 0.5,
                marginBottom: 5,
              }}
            >
              Aalu sav
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: "grey",
                fontWeight: "500",
                letterSpacing: 0.5,
                marginBottom: 5,
              }}
            >
              Aalu sav
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: "grey",
                fontWeight: "500",
                letterSpacing: 0.5,
                marginBottom: 5,
              }}
            >
              Aalu sav
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: "grey",
                fontWeight: "500",
                letterSpacing: 0.5,
                marginBottom: 5,
              }}
            >
              Aalu sav
            </Text>
          </View>
        </View>
        {/* <Pressable
          style={{
            backgroundColor: "#3FC060",
            marginTop: "auto",
            marginVertical: 30,
            marginHorizontal: 10,
            borderRadius: 10,
            backgroundColor: isButtonDisabled() ? "grey" : "#3FC060",
          }}
          onPress={onButtonpressed}
          disabled={isButtonDisabled()}
        >
          <Text
            style={{
              color: "white",
              paddingVertical: 15,
              fontSize: 25,
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {renderButtonTitle()}
          </Text>
        </Pressable> */}
      </BottomSheet>
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
    padding: 16,
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
