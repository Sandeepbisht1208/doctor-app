import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { theme } from '../theme';
import { userService } from '../services/api';
import { Clock, MapPin, CheckCircle } from 'lucide-react-native';

export default function MyRequestsScreen() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadRequests = async () => {
        try {
            const res = await userService.getMyRequests();
            setRequests(res.data.data);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadRequests();
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.serviceType}>{item.service_type.toUpperCase()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'completed' ? '#10B98120' : '#F59E0B20' }]}>
                    <Text style={[styles.statusText, { color: item.status === 'completed' ? '#10B981' : '#F59E0B' }]}>
                        {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <Clock size={16} color={theme.colors.textSecondary} />
                <Text style={styles.infoText}>{new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>

            <View style={styles.infoRow}>
                <MapPin size={16} color={theme.colors.textSecondary} />
                <Text style={styles.infoText} numberOfLines={1}>{item.details?.address || 'GPS Location'}</Text>
            </View>

            {item.status === 'assigned' && (
                <View style={styles.assignmentBox}>
                    <CheckCircle size={16} color={theme.colors.primary} />
                    <Text style={styles.assignmentText}>Staff Assigned. They are on their way.</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Requests</Text>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={requests}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>You haven't made any requests yet.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: theme.spacing.lg, backgroundColor: theme.colors.white },
    title: { ...theme.typography.h1 },
    list: { padding: theme.spacing.lg },
    card: {
        backgroundColor: theme.colors.white,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.small
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.md },
    serviceType: { fontWeight: '800', fontSize: 14, color: theme.colors.textSecondary },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    statusText: { fontSize: 10, fontWeight: '700' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs },
    infoText: { marginLeft: theme.spacing.xs, color: theme.colors.textSecondary, fontSize: 14 },
    assignmentBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.spacing.md,
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border
    },
    assignmentText: { marginLeft: theme.spacing.xs, color: theme.colors.primary, fontWeight: '600', fontSize: 13 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { marginTop: 100, alignItems: 'center' },
    emptyText: { color: theme.colors.textSecondary }
});
