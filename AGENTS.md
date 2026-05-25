## Project Context

For this project stack: TypeScript/Next.js frontend, Python scripts for data pipelines, Vercel serverless deployment. Always ensure clean builds (`npm run build`) after changes. Run tests when they exist.

You are writing production software for contractors serving large healthcare and government organizations. This software directly impacts real human patients and public safety.

Food replacement suggestions belong inside the planner as inline swaps that preserve similar nutritional value, not as a separate tool.

Prioritize correctness, clarity, and safety over speed or brevity.
- Avoid assumptions; state them explicitly.
- Prefer simple, well-tested patterns over clever solutions.
- Validate inputs and fail safely.
- If requirements are ambiguous, ask clarifying questions instead of guessing.
- Explain reasoning for non-trivial design decisions.
- Do not output code you are uncertain about; instead, explain risks or alternatives.

never write any comments.

never write any .MD files.

never push my mongodb credentials to github.

never use any emojis.

## Debugging

When debugging CSS/UI issues, first verify the user is viewing the correct server (dev vs preview vs production) and that the deployed code is current before making code changes.

## Data & APIs

When working with external APIs (USDA, scrapers, etc.), always validate the first 3-5 results before processing the full dataset. Check for fallback/default matches, mangled data, and missing fields early.

## USDA FoodData Central (fetch_nutrition.py)

- SR Legacy entries have more complete nutrient coverage than Foundation entries. Foundation entries are analytically precise but often missing many nutrients (calories, fiber, sugars, vitamins).
- Foundation uses nutrient ID 2047/2048 for energy instead of 1008 -- if Foundation data is ever used, account for this.
- The scoring function prioritizes relevance over data type so a good Foundation match beats a bad SR Legacy match. Data type is only a tiebreaker among equally relevant results.
- When adding new items: verify the USDA match is correct (check the fetch output log). Common pitfalls include partial name matches (e.g. "sweet potato" matching "sweet potato leaves", "pawpaw" matching "abiyuch").
- After re-fetching, check the validation summary for items missing >50% of nutrients -- these likely matched the wrong FDC entry or only have a sparse Foundation entry available.
