import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const TaskCollect = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState(() => {
        const storedCompletedTasks = localStorage.getItem('completedTasks');
        return storedCompletedTasks ? JSON.parse(storedCompletedTasks) : [];
    });

    const [totalTasks, setTotalTasks] = useState(0);
    const [completedTaskCount, setCompletedTaskCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://server-sage-psi.vercel.app/api/addTask');
                if (response.ok) {
                    const data = await response.json();
                    setTasks(data);
                    setTotalTasks(data.length);
                    setCompletedTaskCount(data.filter(task => completedTasks.includes(task._id)).length);
                } else {
                    console.error('Failed to fetch tasks.');
                }
            } catch (error) {
                console.error('Error during fetch:', error);
            }
        };

        fetchData();
    }, [completedTasks]);

    const handleCompleteTask = (taskId) => {
        setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, taskId]);
    };

    useEffect(() => {
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }, [completedTasks]);

    const getPriorityColorClass = (priority) => {
        switch (priority) {
            case "High":
                return "bg-red-500";
            case "Medium":
                return "bg-yellow-300";
            case "Low":
                return "bg-green-300";
            default:
                return ""; // default color or empty string
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'bg-red-500',
                cancelButtonColor: 'bg-gray-500',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                const response = await fetch(`https://server-sage-psi.vercel.app/api/addTask/${taskId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
                    setTotalTasks((prevTotalTasks) => prevTotalTasks - 1);
                    setCompletedTaskCount((prevCompletedTaskCount) =>
                        completedTasks.includes(taskId) ? prevCompletedTaskCount - 1 : prevCompletedTaskCount
                    );
                    Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
                } else {
                    console.error('Failed to delete task.');
                    Swal.fire('Error', 'Failed to delete task.', 'error');
                }
            }
        } catch (error) {
            console.error('Error during task deletion:', error);
            Swal.fire('Error', 'An error occurred during task deletion.', 'error');
        }
    };

    const handleUpdateTask = async (taskId, updatedTask) => {
        try {
            const response = await fetch(`https://server-sage-psi.vercel.app/api/addTask/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });

            if (response.ok) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
                );
                Swal.fire('Updated!', 'Your task has been updated.', 'success');
            } else {
                console.error('Failed to update task.');
                Swal.fire('Error', 'Failed to update task.', 'error');
            }
        } catch (error) {
            console.error('Error during task update:', error);
            Swal.fire('Error', 'An error occurred during task update.', 'error');
        }
    };

    const handleEditChange = (field, value, taskId) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, [field]: value } : task
            )
        );
    };

    return (
        <div className="container mx-auto my-10">
            <div className="text-center mb-8">
                <h2 className="text-2xl text-green-600 font-bold mb-4 font-mono">
                    Total Tasks: {totalTasks}
                </h2>
                <h2 className="text-2xl text-green-600 font-bold mb-4 font-mono">
                    Completed Tasks: {completedTaskCount}
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                    <div
                        key={task._id}
                        className={`max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg p-6 mb-6 relative ${getPriorityColorClass(task.taskPriority)}`}
                    >
                        {completedTasks.includes(task._id) && (
                            <div className="top-0 left-0 right-0 bg-green-500 text-white text-center py-2">
                                Task Completed
                            </div>
                        )}
                        <h2 className="text-2xl text-center text-black font-bold mb-4 font-mono">
                            {completedTasks.includes(task._id) ? 'Completed Task' : 'Incomplete Task'}
                        </h2>
                        <div className="border-b-2 text-black pb-2">
                            {task.editing ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        task.editing = false;
                                        handleUpdateTask(task._id, task);
                                    }}
                                >
                                    <label className="block mb-3">
                                        Task Title:
                                        <input
                                            className="form-input mt-1 block w-full bg-gray-100"
                                            type="text"
                                            value={task.taskTitle}
                                            onChange={(e) => handleEditChange("taskTitle", e.target.value, task._id)}
                                        />
                                    </label>
                                    <label className="block mb-3">
                                        Priority:
                                        <select
                                            className="form-select mt-1 block w-full bg-gray-100"
                                            value={task.taskPriority}
                                            onChange={(e) => handleEditChange("taskPriority", e.target.value, task._id)}
                                        >
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </label>
                                    <label className="block mb-3">
                                        Description:
                                        <textarea
                                            className="form-textarea mt-1 block w-full bg-gray-100"
                                            value={task.taskDescription}
                                            onChange={(e) => handleEditChange("taskDescription", e.target.value, task._id)}
                                        />
                                    </label>
                                    <label className="block mb-3">
                                        Deadline:
                                        <input
                                            className="form-input mt-1 block  bg-gray-600 w-full"
                                            type="datetime-local"
                                            value={task.deadline}
                                            onChange={(e) => handleEditChange("deadline", e.target.value, task._id)}
                                        />
                                    </label>
                                    <div className="flex justify-between">
                                        <button
                                            className="bg-blue-500 text-white py-2 px-4 rounded transition duration-300 ease-in-out"
                                            type="submit"
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white py-2 px-4 rounded transition duration-300 ease-in-out"
                                            type="button"
                                            onClick={() => {
                                                task.editing = false;
                                                setTasks([...tasks]);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold">{task.taskTitle}</h3>
                                    <p className="text-black font-mono font-extrabold">Priority: {task.taskPriority}</p>
                                </>
                            )}
                        </div>
                        <p className="mt-2 text-black font-mono font-extrabold">Description: {task.taskDescription}</p>
                        <p className="text-black font-mono font-extrabold">Deadline: {new Date(task.deadline).toLocaleString()}</p>
                        {!completedTasks.includes(task._id) && (
                            <button
                                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                onClick={() => handleCompleteTask(task._id)}
                            >
                                Complete
                            </button>
                        )}
                        <div className="flex justify-between mt-8">
                            <button
                                className="bg-pink-800 text-white py-2 px-4 rounded transition duration-300 ease-in-out"
                                onClick={() => {
                                    task.editing = true;
                                    setTasks([...tasks]);
                                }}
                            >
                                Update
                            </button>
                            <button
                                className="bg-pink-800 text-white py-2 px-4 rounded transition duration-300 ease-in-out"
                                onClick={() => handleDeleteTask(task._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskCollect;
