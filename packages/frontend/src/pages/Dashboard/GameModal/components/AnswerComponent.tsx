import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../../../../components/Input/Button';

const AnswerBox = styled(Button)`
  text-align: center;
  margin: 2rem;
  font-size: 1.3em;
  background-color: ${() => 'cornflowerblue'};
`;

const CorrectAnswer = styled(AnswerBox)`
  background-color: ${(styledProps) => styledProps.theme.colors.primary};
`;

const WrongAnswer = styled(AnswerBox)`
  background-color: ${(styledProps) => styledProps.theme.colors.danger};
`;

interface IAnswersProps {
  answer: string;
  isCorrect: boolean;
  submitAnswer: (text: string) => void;
  reveal: boolean;
}

const AnswerComponent: FC<IAnswersProps> = ({ answer, isCorrect, reveal, submitAnswer }) => {
  const renderAnswer = () => {
    if (reveal) {
      if (isCorrect) return <CorrectAnswer disabled={reveal}>{answer}</CorrectAnswer>;
      return <WrongAnswer disabled={reveal}>{answer}</WrongAnswer>;
    }
    return (
      <AnswerBox
        onClick={() => {
          submitAnswer(answer);
        }}
      >
        {answer}
      </AnswerBox>
    );
  };

  return renderAnswer();
};

export default AnswerComponent;
