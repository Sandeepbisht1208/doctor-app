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
    ActivityIndicator,
    Modal
} from 'react-native';
import { theme } from '../theme';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
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

    // OTP Modal State
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');

    const handleSubmit = () => {
        if (!formData.address || !formData.problem) {
            Alert.alert('Missing Info', 'Please provide address and problem details');
            return;
        }
        setShowOTP(true);
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 4) {
            setOtpError('Please enter a valid 4-digit OTP');
            return;
        }

        setOtpError('');
        setShowOTP(false);
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
            setOtp('');
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
                                <CheckCircle size={20} color="#FFF" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={showOTP} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Verification Required</Text>
                        <Text style={styles.modalSubtitle}>Please enter the 4-digit OTP sent to your number</Text>

                        <TextInput
                            style={styles.otpInput}
                            placeholder="0000"
                            keyboardType="number-pad"
                            maxLength={4}
                            value={otp}
                            onChangeText={(val) => {
                                setOtp(val);
                                setOtpError('');
                            }}
                            autoFocus
                        />
                        {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalCancelBtn]}
                                onPress={() => { setShowOTP(false); setOtp(''); }}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalVerifyBtn]}
                                onPress={handleVerifyOTP}
                            >
                                <Text style={styles.modalVerifyText}>Verify & Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    submitBtnText: { color: theme.colors.white, fontSize: 18, fontWeight: '700', marginRight: theme.spacing.sm },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 24, width: '100%', alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8, color: '#111827' },
    modalSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
    otpInput: { backgroundColor: '#F3F4F6', fontSize: 32, letterSpacing: 8, textAlign: 'center', padding: 16, borderRadius: 12, width: '80%', marginBottom: 16 },
    errorText: { color: '#EF4444', marginBottom: 16, fontSize: 14 },
    modalActions: { flexDirection: 'row', gap: 12, width: '100%' },
    modalBtn: { flex: 1, height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    modalCancelBtn: { backgroundColor: '#F3F4F6' },
    modalVerifyBtn: { backgroundColor: '#10B981' },
    modalCancelText: { color: '#4B5563', fontWeight: '600' },
    modalVerifyText: { color: '#FFF', fontWeight: '700' }
});
