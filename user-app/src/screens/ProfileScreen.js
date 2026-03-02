import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { ArrowLeft, LogOut } from 'lucide-react-native';

export default function ProfileScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Profile</Text>
            </View>
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => navigation.replace('Login')}
                >
                    <LogOut size={20} color={theme.colors.error} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
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
    },
    title: { ...theme.typography.h2, marginLeft: theme.spacing.md },
    content: { padding: theme.spacing.lg },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        padding: theme.spacing.md,
        backgroundColor: '#FF3B3010',
        borderRadius: theme.borderRadius.md
    },
    logoutText: { color: theme.colors.error, fontWeight: '600', marginLeft: theme.spacing.sm }
});
