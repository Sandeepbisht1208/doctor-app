import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';
import { theme } from '../theme';
import { Phone, Lock, ArrowRight } from 'lucide-react-native';
import { userService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (phone.length < 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
            return;
        }
        setLoading(true);
        try {
            await userService.sendOTP(phone);
            setIsOtpSent(true);
            Alert.alert('OTP Sent', 'Use 123456 for testing');
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length < 6) {
            Alert.alert('Invalid OTP', 'Please enter the 6-digit code');
            return;
        }
        setLoading(true);
        try {
            const res = await userService.verifyOTP(phone, otp);
            if (res.data.success) {
                await AsyncStorage.setItem('user_token', res.data.token);
                navigation.replace('Home');
            }
        } catch (error) {
            Alert.alert('Verification Failed', 'Incorrect OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inner}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Welcome to DoctorApp</Text>
                    <Text style={styles.subtitle}>
                        {isOtpSent ? 'Enter the code sent to your mobile' : 'Login with your mobile number to get started'}
                    </Text>
                </View>

                <View style={styles.form}>
                    {!isOtpSent ? (
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <Phone size={20} color={theme.colors.primary} />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Mobile Number"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                                maxLength={10}
                            />
                        </View>
                    ) : (
                        <View style={styles.inputContainer}>
                            <View style={styles.iconWrapper}>
                                <Lock size={20} color={theme.colors.primary} />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="6-Digit OTP"
                                keyboardType="number-pad"
                                value={otp}
                                onChangeText={setOtp}
                                maxLength={6}
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={isOtpSent ? handleVerifyOTP : handleSendOTP}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>{isOtpSent ? 'Verify & Login' : 'Send OTP'}</Text>
                                <ArrowRight size={20} color="#FFF" />
                            </>
                        )}
                    </TouchableOpacity>

                    {isOtpSent && (
                        <TouchableOpacity onPress={() => setIsOtpSent(false)} style={styles.resendBtn}>
                            <Text style={styles.resendText}>Change Phone Number</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    inner: { flex: 1, padding: theme.spacing.xl, justifyContent: 'center' },
    header: { marginBottom: theme.spacing.xxl },
    title: { ...theme.typography.h1, color: theme.colors.text },
    subtitle: { ...theme.typography.body, color: theme.colors.textSecondary, marginTop: theme.spacing.sm },
    form: { marginTop: theme.spacing.xl },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    iconWrapper: { paddingRight: theme.spacing.sm },
    input: { flex: 1, height: 55, fontSize: 16, color: theme.colors.text },
    button: {
        backgroundColor: theme.colors.primary,
        height: 55,
        borderRadius: theme.borderRadius.md,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        ...theme.shadows.medium,
    },
    buttonText: { color: theme.colors.white, fontSize: 18, fontWeight: '700', marginRight: theme.spacing.xs },
    resendBtn: { marginTop: theme.spacing.xl, alignSelf: 'center' },
    resendText: { color: theme.colors.primary, fontWeight: '600' }
});
