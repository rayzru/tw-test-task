import React from "react";
import { concatMap, of, switchMap, from } from "rxjs";

const Example2 = () => {
  const baseUrl = "https://api.maas2.apollorion.com";
  const log = ({ sol, min_temp: min, max_temp: max }) =>
    console.log(`Sol #${sol}: ${min}..${max} C`);

  const handleClick = () => {
    console.clear();
    from(fetch(baseUrl))
      .pipe(switchMap((res) => res.json()))
      // Первый результат
      .subscribe((firstResponse) => {
        // Сразу показываем
        log(firstResponse);

        // На его базе создаем массив Observable[]
        of(
          ...Array.from({ length: 4 }, (v, k) => firstResponse.sol - k - 1).map(
            (v) =>
              from(fetch(`${baseUrl}/${v}`)).pipe(switchMap((r) => r.json()))
          )
        )
          // натравливаем Concat-Map на массив для
          // сохранения порядка эмиттера
          .pipe(concatMap((v) => v))

          // По ходу работы эмиттера, показываем
          .subscribe((v) => log(v));
      });
  };

  return (
    <div>
      <a href="#" onClick={handleClick}>
        Второй пример (vanilla RxJS + concatMap())
      </a>
    </div>
  );
};

export default Example2;
