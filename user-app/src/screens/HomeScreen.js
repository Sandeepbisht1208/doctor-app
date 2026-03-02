import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { theme } from '../theme';
import {
    Stethoscope,
    Ambulance,
    Home,
    Activity,
    User,
    History,
    MapPin
} from 'lucide-react-native';

export default function HomeScreen({ navigation }) {
    const services = [
        {
            id: 'doctor',
            title: 'Doctor\nAppointment',
            icon: Stethoscope,
            color: '#4CD964',
            screen: 'RequestForm'
        },
        {
            id: 'ambulance',
            title: 'Emergency\nAmbulance',
            icon: Ambulance,
            color: '#FF3B30',
            screen: 'AmbulanceRequest'
        },
        {
            id: 'rehab',
            title: 'Rehab\nHome Visit',
            icon: Home,
            color: '#5856D6',
            screen: 'RequestForm'
        },
        {
            id: 'physio',
            title: 'Physio\nHome Visit',
            icon: Activity,
            color: '#FF9500',
            screen: 'RequestForm'
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, User</Text>
                        <Text style={styles.subtitle}>How can we help today?</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileBtn}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <User size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.grid}>
                    {services.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            style={styles.card}
                            onPress={() => navigation.navigate(service.screen, { type: service.id })}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: service.color + '20' }]}>
                                <service.icon size={32} color={service.color} />
                            </View>
                            <Text style={styles.cardTitle}>{service.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('MyRequests')}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.historyCard}
                    onPress={() => navigation.navigate('MyRequests')}
                >
                    <History size={20} color={theme.colors.textSecondary} />
                    <View style={styles.historyInfo}>
                        <Text style={styles.historyText}>View your request history</Text>
                        <Text style={styles.historySub}>Track status of your visits</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scroll: {
        padding: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        marginTop: theme.spacing.md,
    },
    greeting: {
        ...theme.typography.h1,
        color: theme.colors.text,
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    },
    profileBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '47%',
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    cardTitle: {
        ...theme.typography.body,
        fontWeight: '600',
        fontSize: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    seeAll: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    historyInfo: {
        marginLeft: theme.spacing.md,
    },
    historyText: {
        fontWeight: '600',
        color: theme.colors.text,
    },
    historySub: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
});
