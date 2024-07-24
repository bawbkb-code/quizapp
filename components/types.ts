// types.ts

export interface Answer {
    answer_id: number;
    question_id: number;
    answer_text: string;
  }
  
  export interface Question {
    question_id: number;
    question_text: string;
    correct_answer: string;
    answers: Answer[];
  }
  