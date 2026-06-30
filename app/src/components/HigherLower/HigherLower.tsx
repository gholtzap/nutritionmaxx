import { useMemo, useState } from 'react';
import { ArrowRight, Check, Trophy, X } from '@phosphor-icons/react';
import type { NutrientFruit, NutrientKey } from '../../types';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import { useEffectiveDailyValues } from '../../utils/use-effective-daily-values';
import { useScoreFunction } from '../../utils/use-nutrient-density-score';
import { getItemDisplayValue } from '../../utils/format';
import { NUTRIENT_META } from '../../utils/nutrition-meta';
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

type Highlight = {
  key: NutrientKey;
  label: string;
  percent: number;
};

const HIGHLIGHT_KEYS = new Set<NutrientKey>(
  NUTRIENT_META
    .filter((meta) => !['calories_kcal', 'fat_g', 'carbs_g', 'sugars_g', 'water_g', 'sodium_mg'].includes(meta.key))
    .map((meta) => meta.key)
);

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

function getHighlights(
  item: NutrientFruit,
  dvMap: Map<NutrientKey, number | null>
): Highlight[] {
  return NUTRIENT_META
    .filter((meta) => HIGHLIGHT_KEYS.has(meta.key))
    .map((meta) => {
      const value = getItemDisplayValue(item, meta.key, false);
      const dv = dvMap.get(meta.key);
      if (value === null || dv === null || dv === undefined || dv === 0) return null;
      return {
        key: meta.key,
        label: meta.label,
        percent: (value / dv) * 100,
      };
    })
    .filter((item): item is Highlight => item !== null)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 6);
}

function FoodCard({
  item,
  score,
  revealed,
  outcome,
  highlights,
  disabled,
  onPick,
}: {
  item: NutrientFruit;
  score: number;
  revealed: boolean;
  outcome: 'correct' | 'wrong' | null;
  highlights?: Highlight[];
  disabled: boolean;
  onPick: () => void;
}) {
  const className = [
    styles.card,
    outcome === 'correct' ? styles.cardCorrect : '',
    outcome === 'wrong' ? styles.cardWrong : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={className} onClick={onPick} disabled={disabled}>
      {outcome && (
        <span className={styles.feedbackMark} aria-hidden="true">
          {outcome === 'correct' ? <Check size={30} weight="bold" /> : <X size={30} weight="bold" />}
        </span>
      )}
      <span className={styles.cardType}>{item.type.replace('_', ' ')}</span>
      <span className={styles.cardName}>{item.name}</span>
      <span className={styles.cardCategory}>
        <Badge category={item.category} />
      </span>
      <span className={styles.scoreLabel}>Nutrition score</span>
      <span className={revealed ? styles.scoreValue : styles.scoreHidden}>
        {revealed ? score.toFixed(1) : '?'}
      </span>
      {revealed && highlights && highlights.length > 0 && (
        <div className={styles.highlights}>
          <span className={styles.highlightsTitle}>High in</span>
          <div className={styles.highlightList}>
            {highlights.map((highlight) => (
              <span key={highlight.key} className={styles.highlightPill}>
                <span>{highlight.label}</span>
                <span>{Math.round(highlight.percent)}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </button>
  );
}

export default function HigherLower() {
  const foods = useDietaryFruits();
  const scoreFood = useScoreFunction();
  const dvMap = useEffectiveDailyValues();
  const [savedRound, setSavedRound] = useState<Round | null>(null);
  const [selectedFoodName, setSelectedFoodName] = useState<string | null>(null);
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

  const answered = selectedFoodName !== null;
  const selectedFood = round && selectedFoodName
    ? [round.anchor, round.challenger].find((item) => item.food.name === selectedFoodName) ?? null
    : null;
  const correctFood = round
    ? round.anchor.score > round.challenger.score
      ? round.anchor
      : round.challenger
    : null;
  const isCorrect = selectedFood && correctFood
    ? selectedFood.food.name === correctFood.food.name
    : null;
  const anchorHighlights = useMemo(
    () => (round ? getHighlights(round.anchor.food, dvMap) : []),
    [round, dvMap]
  );
  const challengerHighlights = useMemo(
    () => (round ? getHighlights(round.challenger.food, dvMap) : []),
    [round, dvMap]
  );

  function pickHigherFood(picked: ScoredFood) {
    if (!correctFood || answered) return;
    const correct = picked.food.name === correctFood.food.name;
    const nextStreak = correct ? streak + 1 : 0;

    setSelectedFoodName(picked.food.name);
    setStreak(nextStreak);

    if (nextStreak > best) {
      localStorage.setItem('higherLowerBest', String(nextStreak));
      setBest(nextStreak);
    }
  }

  function nextRound() {
    if (!round) {
      setSavedRound(pickRound(scoredFoods));
      setSelectedFoodName(null);
      return;
    }

    const updatedAnchor = scoredFoods.find((item) => item.food.name === round.challenger.food.name);
    setSavedRound(pickRound(scoredFoods, updatedAnchor));
    setSelectedFoodName(null);
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
          outcome={
            !answered
              ? null
              : selectedFoodName === round.anchor.food.name
                ? isCorrect ? 'correct' : 'wrong'
                : isCorrect === false ? 'correct' : null
          }
          highlights={answered ? anchorHighlights : undefined}
          disabled={answered}
          onPick={() => pickHigherFood(round.anchor)}
        />

        <div className={styles.versus}>
          <span className={styles.versusText}>vs</span>
        </div>

        <FoodCard
          item={round.challenger.food}
          score={round.challenger.score}
          revealed={answered}
          outcome={
            !answered
              ? null
              : selectedFoodName === round.challenger.food.name
                ? isCorrect ? 'correct' : 'wrong'
                : isCorrect === false ? 'correct' : null
          }
          highlights={challengerHighlights}
          disabled={answered}
          onPick={() => pickHigherFood(round.challenger)}
        />
      </div>

      <div className={styles.controls}>
        {answered && (
          <>
            <div className={`${styles.result} ${isCorrect ? styles.resultCorrect : styles.resultWrong}`}>
              {isCorrect ? <Trophy size={16} weight="bold" /> : null}
              <span>
                {isCorrect ? 'Correct' : 'Missed'}: {correctFood?.food.name} scores {correctFood?.score.toFixed(1)}.
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
