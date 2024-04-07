import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native';

type Marker = 'X' | 'O' | null;

interface IBoardState {
  cells: Marker[];
  turnOfX: boolean;
  isGameFinished: boolean;
  gameWinner: Marker;
  alertShown: boolean; 
}

const TicTacToeBoard: React.FC = () => {
  const [boardState, setBoardState] = useState<IBoardState>({
    cells: Array(9).fill(null),
    turnOfX: true, 
    isGameFinished: false,
    gameWinner: null,
    alertShown: false,
  });

  const updateStatusMessage = (): string => {
    if (boardState.isGameFinished) {
      return 'Game over, press "Play Again" to restart';
    }
    return `Turn: ${boardState.turnOfX ? 'X' : 'O'}`;
  };

  const [statusMessage, setStatusMessage] = useState<string>(updateStatusMessage());

  const onCellSelection = (cellIdx: number): void => {
    if (boardState.cells[cellIdx] !== null || boardState.isGameFinished) return;

    const updatedCells = [...boardState.cells];
    updatedCells[cellIdx] = boardState.turnOfX ? 'X' : 'O';
    setBoardState({
      ...boardState,
      cells: updatedCells,
      turnOfX: !boardState.turnOfX,
    });
  };

  useEffect(() => {
    const checkForWinner = (): void => {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
      ];

      for (let line of lines) {
        const [a, b, c] = line;
        if (
          boardState.cells[a] &&
          boardState.cells[a] === boardState.cells[b] &&
          boardState.cells[a] === boardState.cells[c]
        ) {
          endGame(boardState.cells[a]);
          return;
        }
      }

      if (!boardState.cells.includes(null)) {
        endGame(null); 
      }
    };
    setStatusMessage(updateStatusMessage());
    checkForWinner();
  }, [boardState.cells, boardState.isGameFinished]);

  const endGame = (winner: Marker): void => {
    if (!boardState.alertShown) {
      setBoardState(prevState => ({
        ...prevState,
        isGameFinished: true,
        gameWinner: winner,
        alertShown: true, 
      }));
      Alert.alert("Game Over", winner ? `Winner: ${winner}` : "It's a tie!", [{ text: 'OK' }]);
    }
  };

  const resetGame = (): void => {
    setBoardState({
      cells: Array(9).fill(null),
      turnOfX: true,
      isGameFinished: false,
      gameWinner: null,
      alertShown: false, 
    });
  };

  return (
    <View style={gameStyles.gameContainer}>
      <View style={gameStyles.gameBoard}>
        {boardState.cells.map((cell, index) => (
          <Cell
            key={index}
            marker={cell}
            onPress={() => onCellSelection(index)}
            disabled={cell !== null || boardState.isGameFinished}
          />
        ))}
      </View>
      <GameStatus message={statusMessage} onPress={resetGame} isGameFinished={boardState.isGameFinished} />
    </View>
  );
};

const Cell: React.FC<{ marker: Marker; onPress: () => void; disabled: boolean }> = ({
  marker,
  onPress,
  disabled,
}) => (
  <TouchableOpacity style={gameStyles.cell} onPress={onPress} disabled={disabled}>
    {marker && (
      <Image
        style={gameStyles.cellImage}
        source={marker === 'X' ? require('./assets/X-removebg-preview.png') : require('./assets/O-removebg-preview.png')}
      />
    )}
  </TouchableOpacity>
);

const GameStatus: React.FC<{ message: string; onPress: () => void; isGameFinished: boolean }> = ({
  message,
  onPress,
  isGameFinished,
}) => (
  <View style={gameStyles.statusSection}>
    <AlertText message={message} />
    {isGameFinished && <ResetButton onPress={onPress} />}
  </View>
);

const AlertText: React.FC<{ message: string }> = ({ message }) => (
  <Text style={gameStyles.statusText}>{message}</Text>
);

const ResetButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity style={gameStyles.resetButton} onPress={onPress}>
    <Text style={gameStyles.resetButtonText}>Play Again</Text>
  </TouchableOpacity>
);

const gameStyles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cell: {
    width: 90,
    height: 90,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#123456',
  },
  cellImage: {
    width: 60,
    height: 60,
  },
  statusSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 20,
    color: 'blue',
    marginBottom: 15,
  },
  resetButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default TicTacToeBoard;
