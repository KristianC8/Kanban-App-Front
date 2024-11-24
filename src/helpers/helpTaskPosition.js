export const helpTaskPosition = (columns, id) => {
  const taskColumn = Object.keys(columns).find((column) =>
    columns[column].some((item) => item.id === id)
  )

  //Validar si se encuentra la tarea
  if (!taskColumn) {
    console.error('No se encontró la tarea con el id:', id)
    return
  }

  const taskIndex = columns[taskColumn].findIndex((item) => item.id === id)
  if (taskIndex === -1) {
    console.error(
      'No se encontró el índice de la tarea en la columna:',
      taskColumn
    )
    return
  }

  const task = columns[taskColumn].find((item) => item.id === id)
  if (!task) {
    console.error('No se pudo encontrar la tarea en la columna:', taskColumn)
    return
  }

  return { taskColumn, taskIndex, task }
}
