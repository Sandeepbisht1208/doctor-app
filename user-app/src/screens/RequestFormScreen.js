import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { theme } from '../theme';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { userService } from '../services/api';

export default function RequestFormScreen({ route, navigation }) {
    const { type, label } = route.params;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        problem: ''
    });

    const handleSubmit = async () => {
        if (!formData.address || !formData.problem) {
            Alert.alert('Missing Info', 'Please provide address and problem details');
            return;
        }

        setLoading(true);
        try {
            await userService.createRequest({
                service_type: type,
                details: formData
            });
            Alert.alert('Request Sent', 'Our team will contact you shortly.', [
                { text: 'OK', onPress: () => navigation.navigate('Home') }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{label} Request</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.formCard}>
                    <Text style={styles.label}>Patient Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Name of patient"
                        value={formData.name}
                        onChangeText={(val) => setFormData({ ...formData, name: val })}
                    />

                    <Text style={styles.label}>Contact Phone</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone number"
                        keyboardType="phone-pad"
                        value={formData.phone}
                        onChangeText={(val) => setFormData({ ...formData, phone: val })}
                    />

                    <Text style={styles.label}>Full Address</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Door No, Street, Landmark..."
                        multiline
                        numberOfLines={3}
                        value={formData.address}
                        onChangeText={(val) => setFormData({ ...formData, address: val })}
                    />

                    <Text style={styles.label}>Brief Description of Problem</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="e.g. Fever for 3 days, back pain..."
                        multiline
                        numberOfLines={4}
                        value={formData.problem}
                        onChangeText={(val) => setFormData({ ...formData, problem: val })}
                    />

                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Text style={styles.submitBtnText}>Submit Request</Text>
                                <CheckCircle2 size={20} color="#FFF" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.white,
        ...theme.shadows.small
    },
    title: { ...theme.typography.h2, marginLeft: theme.spacing.md },
    content: { padding: theme.spacing.lg },
    formCard: {
        backgroundColor: theme.colors.white,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.medium
    },
    label: { ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs, marginTop: theme.spacing.md },
    input: {
        backgroundColor: '#F9FAFB',
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        fontSize: 16,
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    submitBtn: {
        backgroundColor: theme.colors.primary,
        height: 55,
        borderRadius: theme.borderRadius.md,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.md
    },
    submitBtnText: { color: theme.colors.white, fontSize: 18, fontWeight: '700', marginRight: theme.spacing.sm }
});
