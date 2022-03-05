export default interface IQuestionAndAnswers {
  id: number;
  question: string;
  description: string | undefined;
  answers: {
    answer_a: string | undefined;
    answer_b: string | undefined;
    answer_c: string | undefined;
    answer_d: string | undefined;
    answer_e: string | undefined;
    answer_f: string | undefined;
  };
  multiple_correct_answers: string;
  correct_answers: {
    answer_a_correct: string;
    answer_b_correct: string;
    answer_c_correct: string;
    answer_d_correct: string;
    answer_e_correct: string;
    answer_f_correct: string;
  };
  correct_answer: string;
  explanation: string | undefined;
  tip: string | undefined;
  tags: [
    {
      name: string | undefined;
    },
  ];
  category: string | undefined;
  difficulty: string | undefined;
}
