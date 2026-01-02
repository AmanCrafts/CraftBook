import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ImageCropPicker from "../../components/common/ImageCropPicker";
import COLORS from "../../constants/colors";
import { useAuth } from "../../contexts/AuthContext";

const UploadScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [medium, setMedium] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const mediumOptions = [
    "Pencil",
    "Charcoal",
    "Watercolor",
    "Acrylic",
    "Oil Paint",
    "Digital",
    "Ink",
    "Mixed Media",
    "Other",
  ];

  const handleUpload = async () => {
    if (!image) {
      Alert.alert("Missing Image", "Please select an image to upload.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter a title for your artwork.");
      return;
    }

    if (!medium) {
      Alert.alert("Missing Medium", "Please select the medium used.");
      return;
    }

    setLoading(true);

    try {
      if (!user) {
        Alert.alert("Error", "You must be logged in to upload.");
        setLoading(false);
        return;
      }

      const API_URL = process.env.EXPO_PUBLIC_API_URL;

      // Upload image to Supabase via backend
      const formData = new FormData();

      // Get the filename from the URI
      const uriParts = image.split("/");
      const fileName = uriParts[uriParts.length - 1];

      // Create the file object for FormData
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: fileName,
      });

      const uploadResponse = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        Alert.alert("Error", uploadData.error || "Failed to upload image.");
        setLoading(false);
        return;
      }

      // Create post with the uploaded image URL
      const imageUrl = uploadData.image.url;

      const postData = {
        authorId: user.id,
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl,
        medium: medium,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .join(","),
      };

      const response = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Your artwork has been posted!", [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setImage(null);
              setTitle("");
              setDescription("");
              setMedium("");
              setTags("");
              navigation.navigate("Home");
            },
          },
        ]);
      } else {
        const errorMessage = data.details
          ? `${data.error}: ${data.details}`
          : data.error || "Failed to upload post.";
        Alert.alert("Error", errorMessage);
        console.error("Post creation error:", data);
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        "Error",
        `An error occurred while uploading: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Share Your Art</Text>
        <Text style={styles.headerSubtitle}>Upload your latest creation</Text>
      </View>

      <View style={styles.content}>
        {/* Image Picker with Crop */}
        <View style={styles.imageSection}>
          <ImageCropPicker onImageSelected={setImage} currentImage={image} />
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Give your artwork a title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about your artwork..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Medium *</Text>
          <View style={styles.mediumContainer}>
            {mediumOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.mediumChip,
                  medium === option && styles.mediumChipActive,
                ]}
                onPress={() => setMedium(option)}
              >
                <Text
                  style={[
                    styles.mediumChipText,
                    medium === option && styles.mediumChipTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Tags (comma separated)</Text>
          <TextInput
            style={styles.input}
            placeholder="portrait, sketch, realism"
            value={tags}
            onChangeText={setTags}
          />

          <TouchableOpacity
            style={[
              styles.uploadButton,
              loading && styles.uploadButtonDisabled,
            ]}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.uploadButtonText}>Post Artwork</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  imageSection: {
    marginBottom: 30,
  },
  imagePlaceholder: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderStyle: "dashed",
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.textTertiary,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  pickButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  pickButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  imagePreview: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  changeImageButton: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(244, 81, 30, 0.9)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  changeImageText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.gray100,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  mediumContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 5,
  },
  mediumChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  mediumChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  mediumChipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  mediumChipTextActive: {
    color: COLORS.white,
  },
  uploadButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UploadScreen;
