/**
 * RXJS Macic:
 * concatMap() for the win!
 *
 */

import fetch from "node-fetch";
import { concatMap, of, switchMap, from } from "rxjs";

const requestBaseURL = "https://api.maas2.apollorion.com";
const solsCount = 5;

// вывод
const logData = (data) =>
  console.log(`Sol #${data.sol}: ${data.min_temp}..${data.max_temp} C`);

const Process = async () => {
  // go full RXJS-style
  from(fetch(requestBaseURL))
    .pipe(switchMap((res) => res.json()))
    .subscribe((firstRequest) => {
      // first result
      logData(firstRequest);

      // Create array of observables
      of(
        ...Array.from(
          { length: solsCount - 1 },
          (v, k) => firstRequest.sol - k - 1
        ).map((v) =>
          from(fetch(`${requestBaseURL}/${v}`)).pipe(switchMap((r) => r.json()))
        )
      )
        // Concat-Map observable array to keep emit order
        .pipe(concatMap((v) => v))

        // Get the results
        .subscribe((v) => logData(v));
    });
};

Process();
