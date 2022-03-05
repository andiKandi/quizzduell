import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { RoundHolder } from './RoundHolder';
import { Round } from '../GameList/GameList';
import { Button } from '../../../components/Input/Button';
import styled from 'styled-components';

interface IGamePageProps {
  creatorId: string;
  opponentId: string;
  round: Round;
  close(): any;
}

const StyledButton = styled(Button)`
  max-width: 50%;
  align-self: center;
  margin: 2em 0.75em;
  background-color: ${() => 'cornflowerblue'};
`;

export const GameModal: FC<IGamePageProps> = ({ round, close, creatorId, opponentId }) => {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [data, setData] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [chosenCategory, setChosenCategory] = useState<string>('');
  const [isSecond, setIsSecond] = useState(false);

  const determineIsSecond = (round: Round) => {
    (round.roundNumber % 2 === 1 && round.creatorIsPlaying) || (round.roundNumber % 2 === 0 && !round.creatorIsPlaying)
      ? setIsSecond(false)
      : setIsSecond(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      determineIsSecond(round);
      setError(false);
      setLoading(true);

      try {
        const response = await axios.get('/api/game/categories');

        setData(response.data);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuestions = async (e: any) => {
    setChosenCategory(e.target.value);
    setShowQuestions(true);

    return;
  };

  const renderCategories = () => (
    <>
      <h1 style={{ textAlign: 'center' }}>Select a Category</h1>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {data.slice(0, 2).map((category: string) => {
            return (
              <StyledButton value={category} key={category} onClick={fetchQuestions}>
                {JSON.stringify(category, null, 2)}
              </StyledButton>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {data.slice(2, 4).map((category: string) => {
            return (
              <StyledButton value={category} key={category} onClick={fetchQuestions}>
                {JSON.stringify(category, null, 2)}
              </StyledButton>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div>
      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : !showQuestions && !isSecond ? (
        renderCategories()
      ) : (
        <RoundHolder
          category={chosenCategory}
          isSecond={isSecond}
          roundId={round.id}
          creatorId={creatorId}
          opponentId={opponentId}
          close={close}
        />
      )}
    </div>
  );
};
