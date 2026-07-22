# V2 Baseline 01 Findings

Full report: [`../../simulation/runs/v2-baseline-01-retry/GM-REPORT.md`](../../simulation/runs/v2-baseline-01-retry/GM-REPORT.md).

## Result

- R identity ballot: Progressive 14; Human Mantle 2; One Human 0; Synthetic Origin 0.
- Vale relationship: investigating R 13; insufficient evidence 2; mantle holder 1.
- Vale fate: insufficient evidence 16.
- Progressive finale eligibility: false because AI-caused death received 0 votes.
- Mean belief that an article existed fell from 23.8 to 14.1.

## Interpretation

The article and Vale-fate designs worked in this compressed run. The identity design did not. Progressive behaved as an ambiguity-absorbing “all of the above” answer rather than a difficult ordered reconstruction. Publicly naming its evidence categories and broadcasting Vale's three statements made the intended synthesis unusually salient, especially to agents sharing the same protocol prompt.

This is one isolated-agent run, not a balance verdict about live human play.

## Controlled revision for Baseline 02

Change only the mechanisms implicated by the result:

1. Remove player-facing progressive-key names from the action protocol and Kit's success language.
2. Replace the room-wide recitation of Vale's three statements with a prompt that recipients decide whether to compare confidences.
3. Require final ballots to cite identity and Vale evidence that the character actually knows.
4. Give commitments explicit propose, accept, reject, counter, fulfill, and breach states.
5. Preserve the article-rumor and Vale-fate evidence unchanged.

The next run should measure whether these changes reduce Progressive convergence before adding new evidence for One Human or Synthetic Origin. If they do not, evidence balance—not merely salience—is the dominant problem.
