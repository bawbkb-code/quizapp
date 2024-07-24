const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 3000;

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.get('/questions', async (req, res) => {
  try {
    const questionsResult = await pool.query('SELECT * FROM questions');
    let questions = questionsResult.rows;

    for (const question of questions) {
      const answersResult = await pool.query('SELECT * FROM answers WHERE question_id = $1', [question.question_id]);
      question.answers = answersResult.rows;
    }

    questions = shuffleArray(questions).slice(0, 20);

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving questions');
  }
});

app.post('/save-score', async (req, res) => {
  const { username, score } = req.body;

  try {

    let userResult = await pool.query('SELECT user_id FROM users WHERE username = $1', [username]);
    let userId;
    if (userResult.rows.length === 0) {
      userResult = await pool.query('INSERT INTO users (username) VALUES ($1) RETURNING user_id', [username]);
      userId = userResult.rows[0].user_id;
    } else {
      userId = userResult.rows[0].user_id;
      let scoreResult = await pool.query('SELECT * FROM scores WHERE user_id = $1', [userId]);
      if (scoreResult.rows.length > 0) {
        return res.status(400).send('User has already submitted a score');
      }
    }

    await pool.query('INSERT INTO scores (user_id, score) VALUES ($1, $2)', [userId, score]);
    res.send('Score saved');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving score');
  }
});


app.get('/scores', async (req, res) => {
  try {
    const scoresResult = await pool.query(`
      SELECT users.username, scores.score, scores.taken_at
      FROM scores
      JOIN users ON scores.user_id = users.user_id
      ORDER BY scores.score DESC, scores.taken_at ASC
    `);
    res.json(scoresResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving scores');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
