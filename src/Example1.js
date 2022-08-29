import React from "react";

const Example1 = () => {
  const results = {};

  const baseUrl = "https://api.maas2.apollorion.com";
  const log = ({ sol, min, max }) =>
    console.log(`Sol #${sol}: ${min}..${max} C`);

  const fetchData = (sol = undefined) =>
    fetch(`${baseUrl}${sol ? "/" + sol : "/"}`)
      .then((res) => res.json())
      .then(collect)
      .then(distribute);

  const collect = (data) => {
    results[data.sol] = {
      sol: data.sol,
      min: data.min_temp,
      max: data.max_temp,
    };
    return data;
  };

  const distribute = (data) => {
    const items = Object.values(results).sort((a, b) => b.sol - a.sol);

    for (const item of items) {
      if (item.queue) break;
      log(item);
      delete results[item.sol];
    }

    return data;
  };

  const handleClick = async () => {
    console.clear();
    const latest = await fetchData();
    const queue = [...Array.from({ length: 4 }, (v, k) => latest.sol - k - 1)];
    const promises = queue.map((sol) => {
      const p = fetchData(sol);
      results[sol] = { sol, queue: true };
      return p;
    });
    Promise.all(promises);
  };

  return (
    <div>
      <a href="#" onClick={handleClick}>
        Первый пример (vanilla Promise.all() + queue)
      </a>
    </div>
  );
};

export default Example1;
