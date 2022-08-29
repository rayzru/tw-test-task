/**
 * Самый первый способ, который напрашивается для решения задачи:
 * Закручиваем логику вокруг очереди по данным из results.
 * Основываем очередь на результатах первого запроса,
 * для получения последнего sol, и за ним сразу в асинхронном порядке запускаем
 * еще 4 запроса на предыдущие значение sol-1, sol-2, sol-3, sol-4. / Promise.all()
 *
 * За всем этим получениям теперь нам требуется наблюдать "дистрибьютору"
 * который данные будет передавать в консоль если следующее значение не в очереди.
 *
 */

import fetch from "node-fetch";

const baseUrl = "https://api.maas2.apollorion.com";
const results = {};
const log = ({ sol, min, max }) => console.log(`Sol #${sol}: ${min}..${max} C`);

//  -> Запрос
//  -> поместили значение в глобальные результаты
//  -> триггернули вывод
const fetchData = (sol = undefined) =>
  fetch(`${baseUrl}${sol ? "/" + sol : "/"}`)
    .then((res) => res.json())
    .then(collect)
    .then(distribute);

// сохранение данных
const collect = (data) => {
  results[data.sol] = {
    sol: data.sol,
    min: data.min_temp,
    max: data.max_temp,
  };
  return data;
};

// проверяем, есть ли в данных что вывести из очереди,
// и если вывели, подчистили
const distribute = (data) => {
  // по порядку
  const items = Object.values(results).sort((a, b) => b.sol - a.sol);

  for (const item of items) {
    // если очередь - досвидания.
    if (item.queue) break;

    // не очередь? Вывели, почтистили.
    log(item);
    delete results[item.sol];
  }

  return data;
};

export const Process = async () => {
  const latest = await fetchData();

  const queue = [...Array.from({ length: 4 }, (v, k) => latest.sol - k - 1)];
  const promises = queue.map((sol) => {
    const p = fetchData(sol);
    results[sol] = { sol, queue: true };
    return p;
  });
  Promise.all(promises);
};

Process();

export default Process;
