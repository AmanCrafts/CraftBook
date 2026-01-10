import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
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

// Settings Modal Component - Account management
const SettingsModal = ({
    visible,
    user,
    onClose,
    onChangeEmail,
    onChangePassword,
    onDeleteAccount,
}) => {
    const [activeSection, setActiveSection] = useState(null);

    // Email change state
    const [newEmail, setNewEmail] = useState("");
    const [emailPassword, setEmailPassword] = useState("");

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Loading states
    const [emailLoading, setEmailLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const resetForm = () => {
        setNewEmail("");
        setEmailPassword("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setActiveSection(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleChangeEmail = async () => {
        if (!newEmail.trim()) {
            Alert.alert("Error", "Please enter a new email address");
            return;
        }

        if (!emailPassword) {
            Alert.alert("Error", "Please enter your current password to confirm");
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        setEmailLoading(true);
        try {
            await onChangeEmail(newEmail, emailPassword);
            resetForm();
            Alert.alert("Success", "Email updated successfully");
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to update email");
        } finally {
            setEmailLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword) {
            Alert.alert("Error", "Please enter your current password");
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            Alert.alert("Error", "New password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setPasswordLoading(true);
        try {
            await onChangePassword(currentPassword, newPassword);
            resetForm();
            Alert.alert("Success", "Password updated successfully");
        } catch (error) {
            Alert.alert("Error", error.message || "Failed to update password");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This will permanently delete all your posts, comments, and likes. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        setDeleteLoading(true);
                        try {
                            await onDeleteAccount();
                        } catch (error) {
                            Alert.alert("Error", error.message || "Failed to delete account");
                        } finally {
                            setDeleteLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const renderMenuItem = (icon, title, subtitle, onPress, danger = false) => (
        <TouchableOpacity
            style={[styles.menuItem, danger && styles.menuItemDanger]}
            onPress={onPress}
        >
            <View
                style={[
                    styles.menuIconContainer,
                    danger && styles.menuIconContainerDanger,
                ]}
            >
                <Ionicons
                    name={icon}
                    size={22}
                    color={danger ? COLORS.error : COLORS.primary}
                />
            </View>
            <View style={styles.menuTextContainer}>
                <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>
                    {title}
                </Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray400} />
        </TouchableOpacity>
    );

    const renderEmailSection = () => (
        <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
                <TouchableOpacity onPress={() => setActiveSection(null)}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>Change Email</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.currentInfo}>
                <Text style={styles.currentLabel}>Current Email</Text>
                <Text style={styles.currentValue}>{user?.email}</Text>
            </View>

            <Input
                label="New Email"
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Enter new email address"
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail-outline"
            />

            <Input
                label="Current Password"
                value={emailPassword}
                onChangeText={setEmailPassword}
                placeholder="Enter password to confirm"
                secureTextEntry
                icon="lock-closed-outline"
            />

            <Button
                title="Update Email"
                onPress={handleChangeEmail}
                loading={emailLoading}
                disabled={emailLoading}
                fullWidth
                icon="checkmark-circle-outline"
            />
        </View>
    );

    const renderPasswordSection = () => (
        <View style={styles.sectionContent}>
            <View style={styles.sectionHeader}>
                <TouchableOpacity onPress={() => setActiveSection(null)}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>Change Password</Text>
                <View style={{ width: 24 }} />
            </View>

            <Input
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry
                icon="lock-closed-outline"
            />

            <Input
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password (min 6 characters)"
                secureTextEntry
                icon="key-outline"
            />

            <Input
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
                icon="key-outline"
            />

            <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <Text style={styles.requirementItem}>• At least 6 characters</Text>
                <Text style={styles.requirementItem}>
                    • Different from current password
                </Text>
            </View>

            <Button
                title="Update Password"
                onPress={handleChangePassword}
                loading={passwordLoading}
                disabled={passwordLoading}
                fullWidth
                icon="checkmark-circle-outline"
            />
        </View>
    );

    const renderMainMenu = () => (
        <View style={styles.menuContent}>
            <Text style={styles.menuSectionLabel}>Account Settings</Text>

            {renderMenuItem(
                "mail-outline",
                "Change Email",
                "Update your email address",
                () => setActiveSection("email")
            )}

            {renderMenuItem(
                "key-outline",
                "Change Password",
                "Update your password",
                () => setActiveSection("password")
            )}

            <View style={styles.divider} />

            <Text style={styles.menuSectionLabel}>Danger Zone</Text>

            {renderMenuItem(
                "trash-outline",
                "Delete Account",
                "Permanently delete your account and all data",
                handleDeleteAccount,
                true
            )}

            {deleteLoading && (
                <View style={styles.deleteLoadingOverlay}>
                    <Text style={styles.deleteLoadingText}>Deleting account...</Text>
                </View>
            )}
        </View>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Settings</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {activeSection === "email" && renderEmailSection()}
                    {activeSection === "password" && renderPasswordSection()}
                    {!activeSection && renderMainMenu()}
                </ScrollView>
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
        padding: 20,
    },
    menuContent: {
        gap: 8,
    },
    menuSectionLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textSecondary,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginTop: 16,
        marginBottom: 8,
        marginLeft: 4,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        gap: 14,
    },
    menuItemDanger: {
        backgroundColor: "#fef2f2",
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: `${COLORS.primaryLighter}30`,
        justifyContent: "center",
        alignItems: "center",
    },
    menuIconContainerDanger: {
        backgroundColor: `${COLORS.error}20`,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: 2,
    },
    menuTitleDanger: {
        color: COLORS.error,
    },
    menuSubtitle: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 16,
    },
    sectionContent: {
        gap: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.text,
    },
    currentInfo: {
        backgroundColor: COLORS.backgroundSecondary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    currentLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    currentValue: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: "500",
    },
    passwordRequirements: {
        backgroundColor: COLORS.backgroundSecondary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.text,
        marginBottom: 8,
    },
    requirementItem: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginVertical: 2,
    },
    deleteLoadingOverlay: {
        padding: 16,
        alignItems: "center",
    },
    deleteLoadingText: {
        fontSize: 14,
        color: COLORS.error,
        fontWeight: "500",
    },
});

export default SettingsModal;
