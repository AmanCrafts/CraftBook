import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import COLORS from "../../constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const STAGE_LABELS = [
    "Concept / Reference",
    "Rough Sketch",
    "Line Art",
    "Base Colors",
    "Shading & Details",
    "Final Piece",
];

/**
 * ProcessStagesViewer - Displays process stages as a horizontal carousel
 * with step indicators and labels.
 *
 * Props:
 *  - stages: Array of { imageUrl, label, description? }
 *  - mainImageUrl: The main post image (shown as final stage if not in stages)
 */
const ProcessStagesViewer = ({ stages = [], mainImageUrl }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    // Build the full stages list
    const allStages = stages.length > 0 ? stages : [];

    if (allStages.length === 0) return null;

    const handleStepPress = (index) => {
        setActiveIndex(index);
        flatListRef.current?.scrollToIndex({
            index,
            animated: true,
        });
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50,
    }).current;

    const renderStageImage = ({ item, index }) => (
        <View style={styles.stageSlide}>
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.stageImage}
                resizeMode="cover"
            />
            <View style={styles.stageOverlay}>
                <View style={styles.stageLabelBadge}>
                    <Text style={styles.stageNumber}>Stage {index + 1}</Text>
                    <Text style={styles.stageLabelText}>
                        {item.label || STAGE_LABELS[index] || `Stage ${index + 1}`}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="layers-outline" size={20} color={COLORS.accent} />
                <Text style={styles.headerTitle}>Process Stages</Text>
                <Text style={styles.headerCount}>
                    {activeIndex + 1} / {allStages.length}
                </Text>
            </View>

            {/* Image Carousel */}
            <FlatList
                ref={flatListRef}
                data={allStages}
                renderItem={renderStageImage}
                keyExtractor={(_, index) => `stage-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(_, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index,
                })}
            />

            {/* Step Indicators */}
            <View style={styles.stepsContainer}>
                {allStages.map((stage, index) => (
                    <TouchableOpacity
                        key={`step-${index}`}
                        style={styles.stepWrapper}
                        onPress={() => handleStepPress(index)}
                        activeOpacity={0.7}
                    >
                        {/* Connector line */}
                        {index > 0 && (
                            <View
                                style={[
                                    styles.connector,
                                    index <= activeIndex && styles.connectorActive,
                                ]}
                            />
                        )}
                        {/* Step dot */}
                        <View
                            style={[
                                styles.stepDot,
                                index === activeIndex && styles.stepDotActive,
                                index < activeIndex && styles.stepDotCompleted,
                            ]}
                        >
                            {index < activeIndex ? (
                                <Ionicons name="checkmark" size={12} color={COLORS.white} />
                            ) : (
                                <Text
                                    style={[
                                        styles.stepNumber,
                                        index === activeIndex && styles.stepNumberActive,
                                    ]}
                                >
                                    {index + 1}
                                </Text>
                            )}
                        </View>
                        {/* Step label */}
                        <Text
                            style={[
                                styles.stepLabel,
                                index === activeIndex && styles.stepLabelActive,
                            ]}
                            numberOfLines={1}
                        >
                            {stage.label || STAGE_LABELS[index] || `Stage ${index + 1}`}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Stage Description */}
            {allStages[activeIndex]?.description && (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>
                        {allStages[activeIndex].description}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        marginTop: 8,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.gray200,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray100,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text,
        flex: 1,
    },
    headerCount: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.accent,
        backgroundColor: COLORS.gray100,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    stageSlide: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.85,
        position: "relative",
    },
    stageImage: {
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.gray200,
    },
    stageOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: 12,
        paddingTop: 40,
        background: "transparent",
    },
    stageLabelBadge: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    stageNumber: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.accentLight,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        marginBottom: 2,
    },
    stageLabelText: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.white,
    },
    stepsContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 16,
    },
    stepWrapper: {
        flex: 1,
        alignItems: "center",
        position: "relative",
    },
    connector: {
        position: "absolute",
        top: 12,
        left: -10,
        right: "50%",
        height: 2,
        backgroundColor: COLORS.gray300,
        zIndex: -1,
        width: "50%",
    },
    connectorActive: {
        backgroundColor: COLORS.accent,
    },
    stepDot: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: COLORS.gray200,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: COLORS.gray300,
    },
    stepDotActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    stepDotCompleted: {
        backgroundColor: COLORS.secondary,
        borderColor: COLORS.secondary,
    },
    stepNumber: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.textSecondary,
    },
    stepNumberActive: {
        color: COLORS.white,
    },
    stepLabel: {
        fontSize: 10,
        color: COLORS.textTertiary,
        marginTop: 6,
        textAlign: "center",
        fontWeight: "500",
    },
    stepLabelActive: {
        color: COLORS.accent,
        fontWeight: "700",
    },
    descriptionContainer: {
        paddingHorizontal: 16,
        paddingBottom: 14,
    },
    descriptionText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
        fontStyle: "italic",
    },
});

export default ProcessStagesViewer;
