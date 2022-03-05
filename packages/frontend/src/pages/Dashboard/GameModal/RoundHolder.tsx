import axios from 'axios';
import React, { useState, useEffect, useContext, FC } from 'react';
import { authContext } from '../../../contexts/AuthenticationContext';
import QuestionComponent from './components/QuestionComponent';
import { IGameQuestion } from './interfaces/interfaces';

interface IQuestionPageProps {
  isSecond: boolean;
  category: string;
  roundId: string;
  creatorId: string;
  opponentId: string;
  close(): any;
}

export const RoundHolder: FC<IQuestionPageProps> = ({ isSecond, category, roundId, close, creatorId, opponentId }) => {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(true);
  const [data, setData] = useState<IGameQuestion[]>();
  const { token } = useContext(authContext);

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setLoading(true);
      let retries = 3;
      while (retries) {
        try {
          isSecond
            ? await axios
                .get(`/api/question/${roundId}`, {
                  headers: { Authorization: token },
                })
                .then((res) => {
                  setData(res.data.data);
                  retries = 0;
                })
            : await axios
                .post(`/api/question/`, {
                  headers: { Authorization: token },
                  body: {
                    category: category,
                    roundId: roundId,
                  },
                })
                .then((res) => {
                  setData(res.data.data);
                  // eslint-disable-next-line no-loop-func
                  retries = 0;
                });
        } catch (error) {
          if (!retries) setError(true);
          retries = retries - 1;
        }
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        data && (
          <QuestionComponent
            isSecond={isSecond}
            roundId={roundId}
            question={data.filter((e) => !e.isDone)[0]}
            IGameQuestion={data}
            setData={setData}
            close={close}
            creatorId={creatorId}
            opponentId={opponentId}
          />
        )
      )}
    </div>
  );
};
