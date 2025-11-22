import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useState, useCallback } from "react";
import {
  Button,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "@/constants/colors";

export default function Detection() {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  const takePhoto = useCallback(async () => {
    if (!cameraRef) return;

    try {
      const photo = await cameraRef.takePictureAsync();
      if (photo) {
        console.log("Photo taken:", photo.uri);
        // TODO: Implement photo upload or processing
        Alert.alert("Success", "Photo captured successfully!");

        // Example: Display photo temporarily
        // You can implement navigation to a review screen here
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to capture photo");
    }
  }, [cameraRef]);

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        console.log("Image selected:", result.assets[0].uri);
        // TODO: Implement image processing
        Alert.alert("Success", "Image selected successfully!");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  }, []);

  const toggleTorch = useCallback(() => {
    setTorch((prev) => !prev);
  }, []);

  if (!permission) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.message}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.permissionContainer}>
          <Text style={styles.message}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission} title="Grant permission" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        ref={setCameraRef}
        enableTorch={torch}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.pickImageButton}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <Ionicons name="image" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={takePhoto}
            activeOpacity={0.7}
          >
            <View style={styles.captureButton} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flashButton}
            onPress={toggleTorch}
            activeOpacity={0.7}
          >
            <Ionicons
              name={torch ? "flash" : "flash-off"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: colors.white,
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    padding: 16,
    width: "100%",
    height: "15%",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  pickImageButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
  },
  flashButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
});
