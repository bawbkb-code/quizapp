interface Score {
  username: string;
  score: number;
  taken_at: string;
}

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const LeaderBoardScreen = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get('http://localhost:3000/scores');
        setScores(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scores:', error);
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const getTrophyIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Icon name="trophy" size={24} color="#ffd700" />; // Gold
      case 1:
        return <Icon name="trophy" size={24} color="#c0c0c0" />; // Silver
      case 2:
        return <Icon name="trophy" size={24} color="#cd7f32" />; // Bronze
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {scores.map((score, index) => (
            <View key={index} style={styles.scoreContainer}>
              <View style={styles.rank}>
                {getTrophyIcon(index)}
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.username}>{`Username : `}{score.username}</Text>
                <Text style={styles.score}>{`Score : `}{score.score}</Text>
              </View>
              <Text style={styles.date}>{new Date(score.taken_at).toLocaleDateString()}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  rank: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginLeft: 5,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    color: '#333',
  },
  score: {
    fontSize: 18,
    color: '#28a745',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
});

export default LeaderBoardScreen;
