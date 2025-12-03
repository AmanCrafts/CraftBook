import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";
import Button from "../common/Button";
import Input from "../common/Input";

// Edit Profile Modal Component
const EditProfileModal = ({ visible, user, onClose, onSave }) => {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [medium, setMedium] = useState(user?.medium || "");
  const [loading, setLoading] = useState(false);

  // Sync form state when user prop changes or modal opens
  useEffect(() => {
    if (visible && user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setMedium(user.medium || "");
    }
  }, [visible, user]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        bio: bio.trim(),
        medium: medium.trim(),
      });
      onClose();
    } catch {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            icon="person-outline"
          />

          <Input
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself and your art"
            multiline
            numberOfLines={4}
            icon="create-outline"
          />

          <Input
            label="Favorite Medium"
            value={medium}
            onChangeText={setMedium}
            placeholder="e.g., Digital Art, Oil Painting"
            icon="color-palette-outline"
          />

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={COLORS.info} />
            <Text style={styles.infoText}>
              Your email and profile pictures can be changed separately
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            fullWidth
            icon="checkmark-circle-outline"
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: COLORS.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default EditProfileModal;
