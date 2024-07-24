interface Answer {
  answer_id: number;
  question_id: number;
  answer_text: string;
}

interface Question {
  question_id: number;
  question_text: string;
  correct_answer: string;
  answers: Answer[];
}
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';


const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

const QuestionScreen = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [name, setName] = useState('');
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/questions');
        const data: Question[] = response.data;
        data.forEach(question => {
          question.answers = shuffleArray(question.answers);
        });
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerPress = (questionId: number, answerText: string, isCorrect: boolean) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerText });
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    } else {
      // Decrease score if the previous selected answer was correct
      if (selectedAnswers[questionId] && selectedAnswers[questionId] === questions.find(q => q.question_id === questionId)?.correct_answer) {
        setScore((prevScore) => prevScore - 1);
      }
    }
  };

  const handleSubmit = async () => {
    if (name.trim() === '') {
      setErrorMessage('Please enter your name');
      return;
    }

    if (Object.keys(selectedAnswers).length !== questions.length) {
      setErrorMessage('Please answer all questions before submitting');
      return;
    }

    try {
      await axios.post('http://localhost:3000/save-score', { username: name, score });
      setErrorMessage('Score submitted successfully');
    } catch (error) {
      console.error('Error submitting score:', error);
      setErrorMessage('Failed to submit score');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
    
      {questions.map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.question}>{`ข้อ ${index + 1}. : ${question.question_text}`}</Text>
          <View style={styles.answersContainer}>
            {question.answers.map((answer, i) => (
              <View key={i} style={styles.answerWrapper}>
                <TouchableOpacity
                  style={[
                    styles.answerButton,
                    selectedAnswers[question.question_id] === answer.answer_text && styles.selectedAnswerButton,
                  ]}
                  onPress={() => handleAnswerPress(question.question_id, answer.answer_text, answer.answer_text === question.correct_answer)}
                >
                  <Text style={styles.answerText}>{answer.answer_text}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ))}
        <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
       {errorMessage && (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Score</Text>
      </TouchableOpacity>
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  questionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  answersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  answerWrapper: {
    width: '48%', // Adjust width to fit 2 columns
    marginBottom: 10,
  },
  answerButton: {
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  selectedAnswerButton: {
    backgroundColor: '#0056',
    borderColor: '#fff',
    borderWidth: 2,
  },
  answerText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  errorMessageContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 8,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
  },
});

export default QuestionScreen;
