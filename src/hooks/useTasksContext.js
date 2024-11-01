import { useContext } from 'react'
import { TasksContext } from '../context/tasksContext'

export const useTasksContext = () => {
  const TasksContextValues = useContext(TasksContext)

  if (TasksContextValues === undefined) {
    throw new Error('UseTasksContext no puede usarse sin un Provider')
  }

  return TasksContextValues
}
