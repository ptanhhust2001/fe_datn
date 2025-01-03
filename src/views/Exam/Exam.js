import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Radio, Button, Progress, message } from 'antd';
import './Exam.css';

const Exam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [examData, setExamData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(3600);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [incorrectAnswers, setIncorrectAnswers] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);

    const renderLatex = (text) => {
        return text.replace(/\s/g, '&nbsp;');
    };

    const processLatexData = (questions) => {
        return questions.map(question => ({
            ...question,
            question: renderLatex(question.question),
            firstAnswer: renderLatex(question.firstAnswer),
            secondAnswer: renderLatex(question.secondAnswer),
            thirdAnswer: renderLatex(question.thirdAnswer),
            fourthAnswer: renderLatex(question.fourthAnswer),
        }));
    };

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/books/exams/${examId}`);
                const processedQuestions = processLatexData(response.data.value.questions);
                setExamData({
                    ...response.data.value,
                    questions: processedQuestions
                });
                setUserAnswers(new Array(processedQuestions.length).fill(null));
            } catch (error) {
                console.error("Error fetching exam:", error);
            }
        };
        fetchExam();

        const timer = setInterval(() => {
            if (!isSubmitted) {
                setTimeLeft(prevTime => prevTime - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [examId, isSubmitted]);

    const handleAnswerChange = (questionIndex, answer) => {
        if (!isSubmitted) {
            const newAnswers = [...userAnswers];
            newAnswers[questionIndex] = answer;
            setUserAnswers(newAnswers);
        }
    };

    const handleNextQuestion = () => {

        setCurrentQuestion(prevQuestion => Math.min(prevQuestion + 1, examData.questions.length - 1));

    };

    const handlePrevQuestion = () => {

        setCurrentQuestion(prevQuestion => Math.max(prevQuestion - 1, 0));

    };

    const handleQuestionItemClick = (questionIndex) => {

        setCurrentQuestion(questionIndex);

    };

    const handleSubmit = async () => {
        try {
            const answers = userAnswers.map((answer, index) => {
                const answerMap = { 1: 'A', 2: 'B', 3: 'C', 4: 'D' };
                const question = questions[index];
                return {
                    id: question.id,
                    answer: answer ? answerMap[answer] : '0'
                };
            });

            const response = await axios.post('http://localhost:8080/books/exams/check-answer', { answers });

            if (response.status === 200) {
                const { value } = response.data;
                setIncorrectAnswers(value.answersInCorrect);
                setCorrectAnswers(value.answersCorrect);
                setIsSubmitted(true);
                message.success(`Tổng số câu hỏi: ${value.totalAns}, Số câu đúng: ${value.totalAnsCorrect}`);
            }
        } catch (error) {
            console.error("Error submitting answers:", error);
            message.error("Đã xảy ra lỗi khi gửi đáp án.");
        }
    };

    if (!examData) {
        return <div>Loading...</div>;
    }

    const { questions } = examData;
    const currentQuestionData = questions[currentQuestion];

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className="exam-container">
            <div className="exam-content">
                <h2>{examData.name}</h2>

                <ul className="question-list">
                    <li className="question-item">
                        <p className="question-number">Câu hỏi {currentQuestion + 1}:</p>
                        <p className="question-text" dangerouslySetInnerHTML={{ __html: currentQuestionData.question }}></p>

                        <Radio.Group
                            onChange={e => handleAnswerChange(currentQuestion, e.target.value)}
                            value={userAnswers[currentQuestion]}
                            className="radio-group"
                            disabled={isSubmitted}
                        >
                            <Radio
                                value={1}
                                className={`answer-option ${correctAnswers.includes(currentQuestionData.id) && userAnswers[currentQuestion] === 1 ? 'correct' : ''} 
                                ${incorrectAnswers.includes(currentQuestionData.id) && userAnswers[currentQuestion] === 1 ? 'incorrect' : ''}`}
                            >
                                <span dangerouslySetInnerHTML={{ __html: currentQuestionData.firstAnswer }} />
                            </Radio>
                            <Radio
                                value={2}
                                className={`answer-option ${correctAnswers.includes(currentQuestionData.id) && userAnswers[currentQuestion] === 2 ? 'correct' : ''} 
                                ${incorrectAnswers.includes(currentQuestionData.id) && userAnswers[currentQuestion] === 2 ? 'incorrect' : ''}`}
                            >
                                <span dangerouslySetInnerHTML={{ __html: currentQuestionData.secondAnswer }} />
                            </Radio>
                            <Radio
                                value={3}
                                className={`answer-option ${correctAnswers.includes(currentQuestionData.id) && userAnswers[currentQuestion] === 3 ? 'correct' : ''} 
                                ${incorrectAnswers.includes(currentQuestionData.id) && userAnswers[currentQuestion] === 3 ? 'incorrect' : ''}`}
                            >
                                <span dangerouslySetInnerHTML={{ __html: currentQuestionData.thirdAnswer }} />
                            </Radio>
                            <Radio
                                value={4}
                                className={`answer-option ${correctAnswers.includes(currentQuestionData.id) && userAnswers[currentQuestion] === 4 ? 'correct' : ''} 
                                ${incorrectAnswers.includes(currentQuestionData.id) && userAnswers[currentQuestion] === 4 ? 'incorrect' : ''}`}
                            >
                                <span dangerouslySetInnerHTML={{ __html: currentQuestionData.fourthAnswer }} />
                            </Radio>
                        </Radio.Group>
                    </li>
                </ul>

                {!isSubmitted && (
                    <div className="exam-controls">
                        <Button onClick={handlePrevQuestion} disabled={currentQuestion === 0}>Câu trước</Button>
                        <Button onClick={handleNextQuestion} disabled={currentQuestion === questions.length - 1}>Câu tiếp theo</Button>
                    </div>
                )}

            </div>

            <div className="exam-sidebar">
                <div className="question-nav">
                    {questions.map((_, index) => (
                        <div
                            key={index}
                            className={`question-nav-item ${userAnswers[index] !== null ? 'answered' : ''} 
                 ${index === currentQuestion ? 'active' : ''}
                 ${isSubmitted && correctAnswers.includes(questions[index].id) ? 'correct' : ''} 
                 ${isSubmitted && incorrectAnswers.includes(questions[index].id) ? 'incorrect' : ''}`}
                            onClick={() => handleQuestionItemClick(index)}
                        >
                            <span className={`question-nav-number ${userAnswers[index] !== null ? 'answered' : ''}`}>
                                {index + 1}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="exam-timer-and-completion">
                    <p className="exam-timer">Thời gian: {formattedTime}</p>
                    <Progress
                        percent={((3600 - timeLeft) / 3600) * 100}
                        status="active"
                        strokeColor="#4caf50"
                        showInfo={false}
                    />
                    {!isSubmitted && (
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            className="submit-btn"
                            disabled={timeLeft === 0}
                        >
                            Nộp bài
                        </Button>
                    )}
                    {isSubmitted && (
                        <p className="result-message">
                            Kết quả: {correctAnswers.length}/{questions.length}
                        </p>
                    )}
                    {isSubmitted && (
                        <div>
                            <Button type="primary" onClick={() => navigate('/home')}>
                                Về trang chủ
                            </Button>
                            <Button type="primary" onClick={() => window.location.reload()}>
                                Làm lại
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Exam;
