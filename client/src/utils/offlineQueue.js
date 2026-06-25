export const getQueue = () => {
  return JSON.parse(
    localStorage.getItem("offlineQueue") || "[]"
  );
};

export const saveQueue = (queue) => {
  localStorage.setItem(
    "offlineQueue",
    JSON.stringify(queue)
  );
};

export const addToQueue = (action) => {
  const queue = getQueue();

  queue.push(action);

  saveQueue(queue);
};

export const clearQueue = () => {
  localStorage.removeItem("offlineQueue");
};