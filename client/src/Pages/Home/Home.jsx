import { Link } from "react-router-dom";





const Home = () => {
    return (
        <>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg" className="max-w-sm rounded-lg shadow-2xl" />
                    <div>
                        <h1 className="text-5xl font-bold">Your To-Do List</h1>
                        <p className="py-6">Welcome to our amazing to-do list website! Manage your tasks efficiently and stay organized with our intuitive interface. Create, update, and complete tasks with ease. Never miss a deadline again!
                            Our goal is to provide you with a seamless experience, making task management a breeze. Join our community of productive users and start conquering your to-do list today.</p>
                        <Link to={'/addTask'}><button className="btn btn-primary">Add Task</button></Link>
                    </div>
                </div>
            </div>


        </>

    );
};

export default Home;