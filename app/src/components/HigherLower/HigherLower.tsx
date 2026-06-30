import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Trophy } from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { NutrientFruit } from '../../types';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import { useScoreFunction } from '../../utils/use-nutrient-density-score';
import Badge from '../shared/Badge';
import styles from './HigherLower.module.css';

type ScoredFood = {
  food: NutrientFruit;
  score: number;
};

type Round = {
  anchor: ScoredFood;
  challenger: ScoredFood;
};

type Guess = 'higher' | 'lower';

function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

function pickRound(items: ScoredFood[], anchor?: ScoredFood): Round | null {
  if (items.length < 2) return null;

  const first = anchor ?? items[randomIndex(items.length)];
  const candidates = items.filter((item) => item.food.name !== first.food.name && item.score !== first.score);
  if (candidates.length === 0) return null;

  return {
    anchor: first,
    challenger: candidates[randomIndex(candidates.length)],
  };
}

function isGameCandidate(item: NutrientFruit): boolean {
  return item.cost_index !== null && item.cost_index <= 5;
}

function FoodCard({
  item,
  score,
  revealed,
  onSelect,
}: {
  item: NutrientFruit;
  score: number;
  revealed: boolean;
  onSelect: () => void;
}) {
  return (
    <button type="button" className={styles.card} onClick={onSelect}>
      <span className={styles.cardType}>{item.type.replace('_', ' ')}</span>
      <span className={styles.cardName}>{item.name}</span>
      <span className={styles.cardCategory}>
        <Badge category={item.category} />
      </span>
      <span className={styles.scoreLabel}>Nutrition score</span>
      <span className={revealed ? styles.scoreValue : styles.scoreHidden}>
        {revealed ? score.toFixed(1) : '?'}
      </span>
    </button>
  );
}

export default function HigherLower() {
  const foods = useDietaryFruits();
  const scoreFood = useScoreFunction();
  const setSelectedFruit = useStore((s) => s.setSelectedFruit);
  const [savedRound, setSavedRound] = useState<Round | null>(null);
  const [selectedGuess, setSelectedGuess] = useState<Guess | null>(null);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(() => {
    const stored = localStorage.getItem('higherLowerBest');
    const value = stored ? parseInt(stored, 10) : 0;
    return Number.isFinite(value) ? value : 0;
  });

  const scoredFoods = useMemo(
    () =>
      foods
        .filter(isGameCandidate)
        .map((food) => {
          const score = scoreFood(food);
          return score === null ? null : { food, score };
        })
        .filter((item): item is ScoredFood => item !== null),
    [foods, scoreFood]
  );

  const round = useMemo(() => {
    if (!savedRound) return pickRound(scoredFoods);

    const anchor = scoredFoods.find((item) => item.food.name === savedRound.anchor.food.name);
    const challenger = scoredFoods.find((item) => item.food.name === savedRound.challenger.food.name);
    if (!anchor || !challenger || anchor.score === challenger.score) return pickRound(scoredFoods);

    return { anchor, challenger };
  }, [scoredFoods, savedRound]);

  const answered = selectedGuess !== null;
  const isCorrect = round && selectedGuess
    ? selectedGuess === 'higher'
      ? round.challenger.score > round.anchor.score
      : round.challenger.score < round.anchor.score
    : null;

  function answer(guess: Guess) {
    if (!round || answered) return;

    const correct = guess === 'higher'
      ? round.challenger.score > round.anchor.score
      : round.challenger.score < round.anchor.score;
    const nextStreak = correct ? streak + 1 : 0;

    setSelectedGuess(guess);
    setStreak(nextStreak);

    if (nextStreak > best) {
      localStorage.setItem('higherLowerBest', String(nextStreak));
      setBest(nextStreak);
    }
  }

  function nextRound() {
    if (!round) {
      setSavedRound(pickRound(scoredFoods));
      setSelectedGuess(null);
      return;
    }

    const updatedAnchor = scoredFoods.find((item) => item.food.name === round.challenger.food.name);
    setSavedRound(pickRound(scoredFoods, updatedAnchor));
    setSelectedGuess(null);
  }

  if (scoredFoods.length < 2 || !round) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Higher or Lower</h2>
          <p className={styles.subtitle}>Not enough foods have valid nutrition scores for a game round.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Higher or Lower</h2>
          <p className={styles.subtitle}>Guess whether the next food has a higher or lower dashboard nutrition score.</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Streak</span>
            <span className={styles.statValue}>{streak}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Best</span>
            <span className={styles.statValue}>{best}</span>
          </div>
        </div>
      </div>

      <div className={styles.game}>
        <FoodCard
          item={round.anchor.food}
          score={round.anchor.score}
          revealed
          onSelect={() => setSelectedFruit(round.anchor.food)}
        />

        <div className={styles.versus}>
          <span className={styles.versusText}>vs</span>
        </div>

        <FoodCard
          item={round.challenger.food}
          score={round.challenger.score}
          revealed={answered}
          onSelect={() => setSelectedFruit(round.challenger.food)}
        />
      </div>

      <div className={styles.controls}>
        {!answered ? (
          <>
            <button type="button" className={styles.choiceButton} onClick={() => answer('higher')}>
              <ArrowUp size={16} weight="bold" />
              Higher
            </button>
            <button type="button" className={styles.choiceButton} onClick={() => answer('lower')}>
              <ArrowDown size={16} weight="bold" />
              Lower
            </button>
          </>
        ) : (
          <>
            <div className={`${styles.result} ${isCorrect ? styles.resultCorrect : styles.resultWrong}`}>
              {isCorrect ? <Trophy size={16} weight="bold" /> : null}
              <span>
                {isCorrect ? 'Correct' : 'Missed'}: {round.challenger.food.name} scores {round.challenger.score.toFixed(1)}.
              </span>
            </div>
            <button type="button" className={styles.nextButton} onClick={nextRound}>
              Next
              <ArrowRight size={16} weight="bold" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
