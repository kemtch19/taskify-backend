module.exports = {
  createTask: require("./create"),
  updateTask: require("./update"),
  archiveTask: require("./archive"),
  restoreTask: require("./restore"),
  moveTaskToAnotherList: require("./move"),
  searchTasks: require("./search").searchTasks,
  getTasksByDateRange: require("./search").getTasksByDateRange,

  // destructuring desde get.js
  getTasksByList: require("./get").getTasksByList,
  getTaskById: require("./get").getTaskById,

  // destructuring desde trash.js
  getDeletedTasks: require("./trash").getDeletedTasks,
  deleteTaskPermanently: require("./trash").deleteTaskPermanently,
  emptyTrash: require("./trash").emptyTrash,
  toggleTaskCompletion: require("./toggle"),
};
