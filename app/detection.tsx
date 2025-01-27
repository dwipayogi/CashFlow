import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "@/constants/colors";

export default function Detection() {
  const [torch, setTorch] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      if (photo) {
        console.log(photo);
        return (
          <View style={styles.container}>
            <Image
              source={{ uri: photo.uri }}
              style={{ width: 200, height: 200 }}
            />
          </View>
        );
        // const data = new FormData();
        // const response = await fetch(photo.uri);
        // const blob = await response.blob();
        // data.append("photo", blob, "photo.jpg");

        // try {
        //   const response = await fetch("http://localhost:8000/upload", {
        //     method: "POST",
        //     body: data,
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   });

        //   if (response.ok) {
        //     console.log("Image uploaded successfully");
        //   } else {
        //     console.log("Image upload failed");
        //   }
        // } catch (error) {
        //   console.error("Error uploading image:", error);
        // }
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result); // Handle the selected image as needed
    } else {
      alert("No image selected");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        ref={(ref) => setCameraRef(ref)}
        enableTorch={torch}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
            <Ionicons name="image" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <View style={styles.captureButton} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flashButton}
            onPress={() => setTorch(torch === false ? true : false)}
          >
            <Ionicons name="flash-sharp" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
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