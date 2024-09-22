import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Option {
    id: number;
    text: string;
}

interface Question {
    id: number;
    text: string;
    options: Option[];
}

const ElectionDetails = () => {
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const getTitle = localStorage.getItem("title");
    const getstartDate = localStorage.getItem("startDate");
    const getendDate = localStorage.getItem("endDate");
    const electionId = localStorage.getItem("electionID");
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            text: "Question 1",
            options: [
                { id: 1, text: "Option A" },
                { id: 2, text: "Option B" },
            ],
        },
    ]);

    useEffect(() => {
        const storedQuestions = localStorage.getItem("questions");
        if (storedQuestions) {
            setQuestions(JSON.parse(storedQuestions));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("questions", JSON.stringify(questions));
    }, [questions]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (questions.length > 0) {
                event.returnValue =
                    "You have unsaved questions. Are you sure you want to leave?";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [questions]);

    const handleAddQuestion = () => {
        console.log("Add Question clicked");
        setShowLoginModal(true);
    };

    const handleCloseModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowLoginModal(false);
    };

    const previewClick = () => {
        const electionId = localStorage.getItem("electionID");
        if (electionId) {
            navigate(`/election/${electionId}/preview`);
        } else {
            // Handle the case where electionId is null
            console.error("Election ID not found");
        }
    };

    return (
        <div>
            <p className="font-bold px-2 py-3 bg-white">{getTitle}</p>
            <p className="text-xl text-center py-3">Overview</p>

            <div>
                <p>Start Date</p>
                <p>{getstartDate}</p>
            </div>

            <div>
                <p>End Date</p>
                <p>{getendDate}</p>
            </div>

            <button
                className="bg-green-400 px-2 py-2"
                onClick={handleAddQuestion}>
                Add Question
            </button>

            {showLoginModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={handleCloseModal}>
                    <div
                        className="bg-white py-8 rounded-sm"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="bg-green-400 flex flex-row justify-between items-center px-2 py-2">
                            <p>Add Ballot Question</p>
                            <button
                                onClick={handleCloseModal}
                                className="px-2 border-black border-2">
                                X
                            </button>
                        </div>
                        <p className="px-2">
                            What type of question would you like to add to the
                            ballot?
                        </p>
                        <div className="flex flex-row bg-slate-100 justify-between items-center m-2 py-4 px-3">
                            <p>Multiple Choice</p>
                            <button
                                onClick={() =>
                                    navigate(
                                        `/election/${electionId}/multiple-type`
                                    )
                                }
                                className="bg-green-400 px-2 px-1 text-white">
                                Select
                            </button>
                        </div>

                        <div className="flex flex-row bg-slate-100 justify-between items-center m-2 py-4 px-3">
                            <p>Ranked Choice</p>
                            <button
                                onClick={() => navigate("/register")}
                                className="bg-green-400 px-2 px-1 text-white">
                                Select
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <button
                    className="bg-green-400 px-4 py-2 m-2"
                    onClick={() => {
                        previewClick();
                    }}>
                    Preview
                </button>
            </div>
        </div>
    );
};

export default ElectionDetails;
