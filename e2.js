/**
 * RxJS is Magic:
 * concatMap() for the win!
 *
 * Для регуляции очередей, последовательностей, подписок событий придумали шикарную библиотеку,
 * которая в масштабах оперирования с каскадами данных в том числе асинхронных является красивым инструментом.
 *
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
  // Все в observable!
  from(fetch(requestBaseURL))
    .pipe(switchMap((res) => res.json()))
    // Первый результат
    .subscribe((firstRequest) => {
      // Сразу показываем
      logData(firstRequest);

      // На его базе создаем массив Observable[]
      of(
        ...Array.from(
          { length: solsCount - 1 },
          (v, k) => firstRequest.sol - k - 1
        ).map((v) =>
          from(fetch(`${requestBaseURL}/${v}`)).pipe(switchMap((r) => r.json()))
        )
      )
        // натравливаем Concat-Map на массив для
        // сохранения порядка эмиттера
        .pipe(concatMap((v) => v))

        // По ходу работы эмиттера, показываем
        .subscribe((v) => logData(v));
    });
};

Process();
