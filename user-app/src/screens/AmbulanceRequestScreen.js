import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, MapPin, Phone, AlertCircle } from 'lucide-react-native';
import * as Location from 'expo-location';
import { userService } from '../services/api';

export default function AmbulanceRequestScreen({ navigation }) {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        emergency_type: '',
        patient_age: '',
        contact_number: ''
    });

    // OTP Modal State
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'We need location to dispatch ambulance');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
        })();
    }, []);

    const handleSubmit = () => {
        if (!formData.emergency_type || !formData.contact_number) {
            Alert.alert('Error', 'Please fill in mandatory fields');
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
                service_type: 'ambulance',
                details: formData,
                location: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
                }
            });
            Alert.alert('Emergency Dispatched', 'Ambulance is being assigned. Stay calm.', [
                { text: 'OK', onPress: () => navigation.navigate('Home') }
            ]);
        } catch (error) {
            Alert.alert('Dispatch Error', 'Failed to send request. Please call emergency services directly.');
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
                <Text style={styles.title}>Emergency Ambulance</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.mapContainer}>
                    <View style={styles.mapInner}>
                        <MapPin size={48} color={theme.colors.error} />
                        <Text style={styles.mapLabel}>
                            {location ? 'Current Location Locked' : 'Fetching GPS location...'}
                        </Text>
                        {location && (
                            <Text style={styles.coords}>
                                {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.warningBox}>
                    <AlertCircle size={20} color={theme.colors.error} />
                    <Text style={styles.warningText}>High priority - Emergency Response</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Emergency Type</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Chest Pain, Accident"
                            value={formData.emergency_type}
                            onChangeText={(val) => setFormData({ ...formData, emergency_type: val })}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Alternative Contact</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone number"
                            keyboardType="phone-pad"
                            value={formData.contact_number}
                            onChangeText={(val) => setFormData({ ...formData, contact_number: val })}
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.dispatchBtn, { opacity: (location && !loading) ? 1 : 0.6 }]}
                        onPress={handleSubmit}
                        disabled={!location || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Phone size={24} color={theme.colors.white} />
                                <Text style={styles.dispatchText}>DISPATCH AMBULANCE</Text>
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
                                <Text style={styles.modalVerifyText}>Verify & Dispatch</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.white,
    },
    title: { ...theme.typography.h2, marginLeft: theme.spacing.md, color: theme.colors.error },
    content: { padding: theme.spacing.lg },
    mapContainer: {
        height: 180,
        backgroundColor: '#F2F2F7',
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    mapInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    mapLabel: { marginTop: theme.spacing.sm, fontWeight: '600', color: theme.colors.textSecondary },
    coords: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF3B3015',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.xl,
    },
    warningText: { color: theme.colors.error, fontWeight: '700', marginLeft: theme.spacing.sm },
    form: { flex: 1 },
    fieldGroup: { marginBottom: theme.spacing.lg },
    label: { ...theme.typography.caption, color: theme.colors.textSecondary, marginBottom: theme.spacing.xs },
    input: {
        height: 55,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.sm,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        fontSize: 16,
    },
    dispatchBtn: {
        flexDirection: 'row',
        height: 65,
        backgroundColor: theme.colors.error,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xxl,
    },
    dispatchText: { color: theme.colors.white, fontWeight: '900', fontSize: 18, marginLeft: theme.spacing.sm },
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
