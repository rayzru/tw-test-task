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

const requestBaseURL = "https://api.maas2.apollorion.com";

// для наглядности можем увеличить количество до 25, приостановка будет видна на глаз
const solsCount = 5;
const results = {};

// Корневая логика
//  -> Запрос
//  -> поместили значение в глобальные результаты
//  -> триггернули вывод
const getForecastData = (sol = undefined) =>
  fetch(`${requestBaseURL}${sol ? "/" + sol : "/"}`)
    .then((res) => res.json())
    .then(collect)
    .then(distribute);

// вывод
const logData = (data) =>
  console.log(`Sol #${data.sol}: ${data.min}..${data.max} C`);

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
    logData(item);
    delete results[item.sol];
  }

  // для внешнего чейна
  return data;
};

const Process = async () => {
  const latest = await getForecastData();
  const queue = [
    ...Array.from({ length: solsCount - 1 }, (v, k) => latest.sol - k - 1),
  ];
  const promises = queue.map((queueSol) => {
    const p = getForecastData(queueSol);
    results[queueSol] = { sol: queueSol, queue: true };
    return p;
  });
  Promise.all(promises);
};

Process();
