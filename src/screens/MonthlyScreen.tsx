import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { useTheme } from '../hooks/useTheme';
import { getSelectedCity } from '../utils/storage';

const API_URL = 'https://api.aladhan.com/v1/calendarByCity';
const COUNTRY = 'Turkey';
const METHOD = 13;

const vakitKeys = [
	{ key: 'Imsak', label: 'İmsak' },
	{ key: 'Sunrise', label: 'Güneş' },
	{ key: 'Dhuhr', label: 'Öğle' },
	{ key: 'Asr', label: 'İkindi' },
	{ key: 'Maghrib', label: 'Akşam' },
	{ key: 'Isha', label: 'Yatsı' },
];

const MonthlyScreen = () => {
	const [city, setCity] = useState<string>('İstanbul');
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const theme = useTheme();

	useEffect(() => {
		getSelectedCity().then((c) => {
			if (c) setCity(c);
		});
	}, []);

	useEffect(() => {
		const today = new Date();
		setLoading(true);
		setError(null);
		axios
			.get(API_URL, {
				params: {
					city,
					country: COUNTRY,
					method: METHOD,
					month: today.getMonth() + 1,
					year: today.getFullYear(),
				},
			})
			.then((res) => setData(res.data.data))
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [city]);

	const todayStr = new Date().toISOString().slice(0, 10);

	if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;
	if (error) return <Text style={{ color: 'red', margin: 16 }}>{error}</Text>;

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.background },
			]}>
			<FlatList
				data={data}
				keyExtractor={(item) => item.date.readable}
				renderItem={({ item }) => {
					const isToday =
						item.date.gregorian.date === todayStr;
					return (
						<Card
							style={[
								styles.card,
								isToday && styles.today,
								{ backgroundColor: theme.card },
							]}>
							<Card.Content>
								<View style={styles.row}>
									<Text
										style={[
											styles.date,
											isToday && styles.todayText,
										]}>
										{item.date.readable}
									</Text>
									{vakitKeys.map(({ key, label }) => (
										<View
											key={key}
											style={styles.vakitBox}>
											<Text style={styles.vakitLabel}>
												{label}
											</Text>
											<Text style={styles.vakitValue}>
												{item.timings[key]}
											</Text>
										</View>
									))}
								</View>
							</Card.Content>
						</Card>
					);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, padding: 8 },
	card: { marginVertical: 6, borderRadius: 8, elevation: 2 },
	today: { borderWidth: 2, borderColor: '#2196f3' },
	todayText: { color: '#2196f3', fontWeight: 'bold' },
	row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
	date: { width: 90, fontSize: 14 },
	vakitBox: { alignItems: 'center', marginHorizontal: 6 },
	vakitLabel: { fontSize: 12, color: '#888' },
	vakitValue: { fontSize: 14, fontWeight: 'bold' },
});

export default MonthlyScreen;
