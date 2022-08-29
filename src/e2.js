/**
 * RxJS is Magic:
 * concatMap() for the win!
 *
 * Для регуляции очередей, последовательностей, подписок событий придумали шикарную библиотеку,
 * которая в масштабах оперирования с каскадами данных в том числе асинхронных является красивым инструментом.
 */

import fetch from "node-fetch";
import { concatMap, of, switchMap, from } from "rxjs";

const baseUrl = "https://api.maas2.apollorion.com";
const log = ({ sol, min_temp: min, max_temp: max }) =>
  console.log(`Sol #${sol}: ${min}..${max} C`);

const Process = async () => {
  // Все в observable!
  from(fetch(baseUrl))
    .pipe(switchMap((res) => res.json()))
    // Первый результат
    .subscribe((firstRequest) => {
      // Сразу показываем
      log(firstRequest);

      // На его базе создаем массив Observable[]
      of(
        ...Array.from({ length: 4 }, (v, k) => firstRequest.sol - k - 1).map(
          (v) => from(fetch(`${baseUrl}/${v}`)).pipe(switchMap((r) => r.json()))
        )
      )
        // натравливаем Concat-Map на массив для
        // сохранения порядка эмиттера
        .pipe(concatMap((v) => v))

        // По ходу работы эмиттера, показываем
        .subscribe((v) => log(v));
    });
};

Process();
