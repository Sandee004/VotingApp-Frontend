import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./navbar";

interface Election {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
}

const Dashboard = () => {
    const [elections, setElections] = useState<Election[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchElections = async () => {
            try {
                const token = localStorage.getItem("token");
                //console.log(token);

                if (!token) {
                    console.log("No token. Sign in");
                }

                const url = "https://votingapp-backend-8rrm.onrender.com/api/election";
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    //body: JSON.stringify(data),
                };

                const response = await fetch(url, options);

                if (response.status === 500) {
                    throw new Error("Failed to fetch elections, send help!!");
                }
                if (response.status === 401) {
                    //throw new Error("Authorizaion shii error");
                    alert("You gats sign in chief then try again");
                    navigate("/");
                }

                const data = await response.json();
                console.log(data);
                setElections(data);
            } catch (error) {
                console.error("Error fetching elections:", error);
            }
        };
        fetchElections();
    });

    const handleElectionClick = (electionId: string) => {
        navigate(`/election/${electionId}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-row justify-between items-center px-3 py-3 bg-white">
                <p className="text-xl font-bold">Dashboard</p>
                <button className="px-2 py-1 bg-green-400">
                    <Link to="/create-election">New Election</Link>
                </button>
            </div>

            {elections.length > 0 ? (
                <div className="election-list my-2 w-[96%] mx-auto">
                    {elections.map((election) => (
                        <div
                            key={election.id}
                            className="bg-white my-2 px-1"
                            onClick={() => {
                                handleElectionClick(election.id);
                            }}>
                            <p className="font-bold">{election.title}</p>
                            <div className="text-sm flex flex-row justify-between mx-3 text-sm">
                                <div className="flex flex-col">
                                    <p>Start Date: </p>
                                    <p>{formatDate(election.startDate)}</p>
                                </div>
                                <div>
                                    <p>End Date:</p>
                                    <p>{formatDate(election.endDate)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You haven't created any elections yet.</p>
            )}
        </>
    );
};

export default Dashboard;
