import React, { useEffect, useState } from "react";

const Quiz = () => {
  const [category, setCategory] = useState(null);
  const [question, setQuestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [quizEnded, setQuizEnded] = useState(false);
  const [scoreHistory, setScoreHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to play the quiz");
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (category) {
      setLoading(true);
      fetch(`http://localhost:5000/api/quiz?category=${category}`)
        .then((res) => res.json())
        .then((data) => {
          const shuffled = data.sort(() => 0.5 - Math.random());
          setQuestion(shuffled.slice(0, 7));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching quiz data:", error);
          setLoading(false);
        });
    }
  }, [category]);

  useEffect(() => {
    if (quizEnded) {
      const token = localStorage.getItem("token");

      fetch("http://localhost:5000/api/quiz/save-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category,
          correct: score.correct,
          wrong: score.wrong,
        }),
      })
        .then((res) => res.json())
        .then(() =>
          fetch("http://localhost:5000/api/quiz/scores", {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
        .then((res) => res.json())
        .then((data) => setScoreHistory(data))
        .catch((err) => {
          console.error("Error saving or fetching scores", err);
        });
    }
  }, [quizEnded]);

  const styles = {
    page: {
      backgroundColor: "#121212",
      color: "#fff",
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "sans-serif",
    },
    centered: {
      maxWidth: "700px",
      margin: "0 auto",
      textAlign: "center",
      backgroundColor: "#1e1e1e",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
    },
    button: {
      padding: "10px 16px",
      margin: "10px",
      borderRadius: "6px",
      backgroundColor: "#444",
      color: "#fff",
      border: "1px solid #666",
      cursor: "pointer",
      fontWeight: "bold",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "15px",
      backgroundColor: "#222",
      color: "#fff",
    },
    difficulty: (level) => ({
      fontWeight: "bold",
      color:
        level === "easy" ? "green" :
        level === "medium" ? "orange" : "red",
    }),
  };

  const currentQuestion =
    question.length > 0 && currentIndex < question.length
      ? question[currentIndex]
      : null;

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);

    if (option === currentQuestion.answer) {
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < question.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setQuizEnded(true);
    }
  };

  return (
    <div style={styles.page}>
      {!category ? (
        <div style={styles.centered}>
          <h2>Select a Quiz Category:</h2>
          {["HTML", "CSS", "JS", "React"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={styles.button}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : loading ? (
        <p style={{ textAlign: "center" }}>Loading questions...</p>
      ) : quizEnded ? (
        <div style={styles.centered}>
          <h2>🎉 Quiz Completed!</h2>
          <p>Total Questions: {question.length}</p>
          <p>✅ Correct: {score.correct}</p>
          <p>❌ Wrong: {score.wrong}</p>

          <button
            onClick={() => setShowHistory((prev) => !prev)}
            style={styles.button}
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>

          {showHistory && (
            <>
              <h3>📊 Your Last 3 Scores</h3>
              {scoreHistory.length === 0 ? (
                <p>No previous scores found.</p>
              ) : (
                <table border="1" cellPadding="8" style={styles.table}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category</th>
                      <th>Correct</th>
                      <th>Wrong</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreHistory.map((s, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{s.category}</td>
                        <td>{s.correct}</td>
                        <td>{s.wrong}</td>
                        <td>{new Date(s.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          <button
            onClick={() => window.location.reload()}
            style={{ ...styles.button, marginTop: "20px" }}
          >
            Play Again
          </button>
        </div>
      ) : (
        <div style={styles.centered}>
          {currentQuestion ? (
            <>
              <h2>
                Question {currentIndex + 1}{" "}
                <span style={styles.difficulty(currentQuestion.difficulty)}>
                  ({currentQuestion.difficulty?.toUpperCase()})
                </span>
              </h2>
              <p><strong>{currentQuestion.question}</strong></p>

              {currentQuestion.array.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedOption !== null}
                  style={{
                    ...styles.button,
                    backgroundColor:
                      showAnswer && option === currentQuestion.answer
                        ? "#28a745"
                        : selectedOption === option
                        ? "#dc3545"
                        : "#444",
                  }}
                >
                  {option}
                </button>
              ))}

              {showAnswer && (
                <div style={{ marginTop: "15px" }}>
                  <button onClick={handleNext} style={styles.button}>
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No questions available for {category}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
