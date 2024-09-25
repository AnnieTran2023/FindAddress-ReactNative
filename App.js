import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function App() {
  const apiKey = "66f417f0645dc911719898sqtb00271";

  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("No permission to get location");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      });
    })();
  }, []);

  const handleSearch = () => {
    fetch(`https://geocode.maps.co/search?q=${address}&api_key=${apiKey}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong! " + response.statusText);
        }
        return response.json();
      })
      .then((responseData) =>
        setRegion({
          ...region,
          latitude: responseData[0].lat,
          longitude: responseData[0].lon,
        })
      );
  };
  return (
    <>
      <MapView style={{ width: "100%", height: "85%" }} region={region}>
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title={address}
          description={address}
        />
      </MapView>
      <View style={styles.inputView}>
        <TextInput
          placeholder="Enter address"
          style={styles.input}
          onChangeText={(text) => setAddress(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    borderBottomWidth: 1,
    height: 30,
    width: 250,
    borderColor: "#dee2e6",
    borderRadius: 5,
    paddingHorizontal: 5,
    margin: 10,
  },
  button: {
    backgroundColor: "#023e8a",
    justifyContent: "center",
    height: 35,
    borderRadius: 3,
    margin: 7,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    padding: 8,
  },
});
