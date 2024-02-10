/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';

const TaskForm = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskPriority, setTaskPriority] = useState('Low');
    const [taskDescription, setTaskDescription] = useState('');
    const [deadline, setDeadline] = useState(new Date());

    const priorityColors = {
        Low: 'bg-emerald-300',
        Medium: 'bg-yellow-300',
        High: 'bg-pink-300',
    };

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks && storedTasks.length > 0) {
            const [storedTask] = storedTasks;
            setTaskTitle((prev) => storedTask.taskTitle || prev);
            setTaskPriority((prev) => storedTask.taskPriority || 'Low');
            setTaskDescription((prev) => storedTask.taskDescription || prev);
            setDeadline((prev) => new Date(storedTask.deadline) || prev);
        }
    }, []);

    useEffect(() => {
        const tasksToStore = [
            {
                taskTitle,
                taskPriority,
                taskDescription,
                deadline,
            },
        ];
        localStorage.setItem('tasks', JSON.stringify(tasksToStore));
    }, [taskTitle, taskPriority, taskDescription, deadline]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            taskTitle,
            taskPriority,
            taskDescription,
            deadline,
            priorityColor: priorityColors[taskPriority],
        };

        try {
            const response = await fetch('https://server-sage-psi.vercel.app/api/addTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Task successfully added!');
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Task successfully added.',
                }).then(() => {
                    // Clear the form fields
                    setTaskTitle('');
                    setTaskPriority('Low');
                    setTaskDescription('');
                    setDeadline(new Date());
                    
                    
                });
            } else {
                console.error('Failed to add task.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to add task.',
                });
                
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred during task submission.',
            });
          
        }
    };

    return (
        <div className="container mx-auto mt-8 mb-10">
            <form onSubmit={handleSubmit} className={`max-w-md mx-auto border-2 shadow-2xl p-8 rounded  ${priorityColors[taskPriority]}`}>
                <h2 className="text-2xl text-center text-black  font-bold mb-4 font-mono">Task Form</h2>
                <div className="mb-4">
                    <label htmlFor="taskTitle" className="block text-gray-600 font-medium mb-2">Task Title</label>
                    <input
                        type="text"
                        id="taskTitle"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="taskPriority" className="block text-gray-600 font-medium mb-2">Task Priority</label>
                    <select
                        id="taskPriority"
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="taskDescription" className="block text-gray-600 font-medium mb-2">Task Description</label>
                    <textarea
                        id="taskDescription"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="deadline" className="block text-gray-600 font-medium mb-2">Deadline</label>
                    <DatePicker
                        selected={deadline}
                        onChange={(date) => setDeadline(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className='flex justify-center '>
                    <button type="submit" className="group bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;
