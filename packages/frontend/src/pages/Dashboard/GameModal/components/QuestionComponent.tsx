import axios from 'axios';
import React, { FC, useContext, useState } from 'react';
import styled from 'styled-components';
import { authContext } from '../../../../contexts/AuthenticationContext';
import { IAnswer, IGameQuestion } from '../interfaces/interfaces';
import AnswerComponent from './AnswerComponent';

interface IQuestionProps {
  roundId: string;
  isSecond: boolean;
  question: IGameQuestion;
  creatorId: string;
  opponentId: string;
  IGameQuestion: IGameQuestion[];
  setData: React.Dispatch<React.SetStateAction<IGameQuestion[] | undefined>>;
  close(): any;
}

const StyledBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const QuestionComponent: FC<IQuestionProps> = ({
  isSecond,
  roundId,
  question,
  IGameQuestion,
  creatorId,
  opponentId,
  setData,
  close,
}) => {
  const { token, actions } = useContext(authContext);

  const [reveal, setReveal] = useState(false);

  const submitAnswer = (text: string) => {
    setTimeout(async () => {
      const array = IGameQuestion.map((e) => {
        e.answers = (e.answers as IAnswer[]).map((a) => {
          if (a.text === text) {
            a.playerClickedAnswer = true;
            e.isDone = true;
          }
          return a;
        });
        return e;
      });
      if (array[3].isDone) {
        close();
        try {
          await axios
            .post(`/api/game/gameanswer`, {
              headers: { Authorization: token },
              body: {
                gameQuestion: array,
                roundId: roundId,
                isSecond: isSecond,
              },
            })
            .then(() => {
              console.log('OK');
              actions.getSocket()!.emit('gameEvent', { creatorId: creatorId, opponentId: opponentId });
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        setData(array);
        setReveal(false);
      }
    }, 3000);
    setReveal(true);
  };

  const createAnswerDivs = (answers: IAnswer[]) => {
    return (
      <>
        {answers.map((answer, index) => {
          if (answers.length % 2 !== 0 && index === answers.length - 1) {
            return (
              <div key={`${index}`} style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <AnswerComponent
                  answer={answer.text}
                  isCorrect={answer.isCorrect}
                  submitAnswer={submitAnswer}
                  reveal={reveal}
                />
              </div>
            );
          }
          if (index % 2 === 0) {
            return (
              <div key={`${index}`} style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                <AnswerComponent
                  answer={answer.text}
                  isCorrect={answer.isCorrect}
                  submitAnswer={submitAnswer}
                  reveal={reveal}
                />

                <AnswerComponent
                  answer={(answers[index + 1] as IAnswer).text}
                  isCorrect={(answers[index + 1] as IAnswer).isCorrect}
                  submitAnswer={submitAnswer}
                  reveal={reveal}
                />
              </div>
            );
          }
        })}
      </>
    );
  };
  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>{question.text}</h3>
      <StyledBox>{createAnswerDivs(question.answers)}</StyledBox>
    </div>
  );
};
export default QuestionComponent;
