exports.prioritizeTasks = (tasks) => {
  return tasks.sort((a, b) => {
    const deadlineScore = new Date(a.deadline) - new Date(b.deadline);
    return deadlineScore + (b.priority - a.priority);
  });
};