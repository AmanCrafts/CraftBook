import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';

const UploadScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [medium, setMedium] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = getAuth();

    const mediumOptions = [
        'Pencil', 'Charcoal', 'Watercolor', 'Acrylic',
        'Oil Paint', 'Digital', 'Ink', 'Mixed Media', 'Other'
    ];

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
            return;
        }

        // Pick image
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        if (!image) {
            Alert.alert('Missing Image', 'Please select an image to upload.');
            return;
        }

        if (!title.trim()) {
            Alert.alert('Missing Title', 'Please enter a title for your artwork.');
            return;
        }

        if (!medium) {
            Alert.alert('Missing Medium', 'Please select the medium used.');
            return;
        }

        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert('Error', 'You must be logged in to upload.');
                return;
            }

            // Get user from backend
            const API_URL = process.env.EXPO_PUBLIC_API_URL;
            const userResponse = await fetch(`${API_URL}/api/users/google/${user.uid}`);
            const userData = await userResponse.json();

            if (!userResponse.ok) {
                Alert.alert('Error', 'User not found. Please complete your profile.');
                return;
            }

            // For now, we'll use a placeholder image URL
            // In production, you'd upload to cloud storage (Firebase Storage, AWS S3, etc.)
            const imageUrl = image; // This would be replaced with actual cloud URL

            // Create post
            const postData = {
                userId: userData.id,
                title: title.trim(),
                description: description.trim(),
                imageUrl: imageUrl,
                medium: medium,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            };

            const response = await fetch(`${API_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Your artwork has been posted!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Reset form
                            setImage(null);
                            setTitle('');
                            setDescription('');
                            setMedium('');
                            setTags('');
                            // Navigate to Home to see the post
                            navigation.navigate('Home');
                        }
                    }
                ]);
            } else {
                Alert.alert('Error', data.error || 'Failed to upload post.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Error', 'An error occurred while uploading.');
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
                {/* Image Picker */}
                <View style={styles.imageSection}>
                    {image ? (
                        <TouchableOpacity onPress={pickImage} style={styles.imagePreview}>
                            <Image source={{ uri: image }} style={styles.image} />
                            <TouchableOpacity
                                style={styles.changeImageButton}
                                onPress={pickImage}
                            >
                                <Text style={styles.changeImageText}>Change Image</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>No image selected</Text>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={styles.pickButton}
                                    onPress={pickImage}
                                >
                                    <Text style={styles.pickButtonText}>Gallery</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.pickButton}
                                    onPress={takePhoto}
                                >
                                    <Text style={styles.pickButtonText}>Camera</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
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
                                    medium === option && styles.mediumChipActive
                                ]}
                                onPress={() => setMedium(option)}
                            >
                                <Text style={[
                                    styles.mediumChipText,
                                    medium === option && styles.mediumChipTextActive
                                ]}>
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
                        style={[styles.uploadButton, loading && styles.uploadButtonDisabled]}
                        onPress={handleUpload}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
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
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f4511e',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    content: {
        padding: 20,
    },
    imageSection: {
        marginBottom: 30,
    },
    imagePlaceholder: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 40,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 10,
    },
    pickButton: {
        backgroundColor: '#f4511e',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    pickButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    imagePreview: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 12,
    },
    changeImageButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: 'rgba(244, 81, 30, 0.9)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    changeImageText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    mediumContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 5,
    },
    mediumChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    mediumChipActive: {
        backgroundColor: '#f4511e',
        borderColor: '#f4511e',
    },
    mediumChipText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    mediumChipTextActive: {
        color: '#fff',
    },
    uploadButton: {
        backgroundColor: '#f4511e',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    uploadButtonDisabled: {
        opacity: 0.6,
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default UploadScreen;
