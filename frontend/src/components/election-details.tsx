import { Calendar, House, Link, MessageCircleQuestion } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./loader";

interface Option {
  id: number;
  text: string;
}

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  options: Option[];
}

interface ElectionData {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  questions: Question[];
  is_built: boolean;
}

const ElectionDetails = () => {
  const navigate = useNavigate();
  const { electionId } = useParams<{ electionId: string }>();
  //const [showLoginModal, setShowLoginModal] = useState(false);
  const [electionData, setElectionData] = useState<ElectionData | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchElectionDetails = async () => {
      if (!electionId) return;

      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication failed. Please login");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `https://votingapp-backend-8rrm.onrender.com/api/election?id=${electionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        //alert(data.message);
        setElectionData(data);
        setQuestionCount(data?.questions_count || 0);
      } catch (error) {
        console.error("Error fetching election details:", error);
        alert("Failed to load election details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchElectionDetails();
  }, [electionId, navigate]);

  const buildElection = async () => {
    if (!electionId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication failed. Please login");
      navigate("/login");
      return;
    }

    if (questionCount < 1) {
      alert("Add questions before building");
    } else {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://votingapp-backend-8rrm.onrender.com/api/build?electionId=${electionId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        //alert(data.message);
        // Update the local state to reflect the change
        setElectionData((prev) => (prev ? { ...prev, is_built: true } : null));
      } catch (error) {
        console.error("Error building election:", error);
        alert("Failed to build election. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  const previewClick = () => {
    if (electionId) {
      navigate(`/election/${electionId}/preview`);
    } else {
      console.error("Election ID not found");
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <>
        {electionData ? (
          <>
            <p className="font-bold px-2 py-3 bg-white">{electionData.title}</p>
            <div className="flex items-center justify-between bg-white border-y-2 px-3 py-2">
              <div className="flex gap-3">
                <House />
                <p className="font-bold">Overview</p>
              </div>
              <button
                onClick={buildElection}
                title="Build election"
                className={
                  electionData.is_built
                    ? "bg-green-500 text-white py-1 px-3"
                    : "bg-gray-400 py-1 px-3"
                }
                disabled={electionData.is_built}
              >
                {electionData.is_built ? "Active" : "Building"}
              </button>
            </div>

            <div className="text-sm mx-auto w-[94%] mt-6">
              <p>
                After setting up and adding questions, build to make it active
                for people to vote. After building, questions cannot be added or
                edited.
              </p>
            </div>

            <div className="mt-6 w-[94%] mx-auto border-2 border-black">
              <div className="border-2 border-b-black gap-3 flex items-center p-2">
                <Calendar size={15} />
                <p className="font-bold">Start Date</p>
              </div>
              <div className="p-2">
                <p>
                  {new Date(electionData.startDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

            <div className="mt-3 w-[94%] mx-auto border-2 border-black">
              <div className="border-2 border-b-black gap-3 flex items-center p-2">
                <Calendar size={15} />
                <p className="font-bold">End Date</p>
              </div>
              <div className="p-2">
                <p>
                  {new Date(electionData.endDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-3 w-[94%] mx-auto border-2 border-black">
              <div className="border-2 border-b-black gap-3 flex items-center p-2">
                <Link size={15} />
                <p className="font-bold">Election Url</p>
              </div>
              <div className="p-2 text-center">
                <button onClick={previewClick}>
                  Click here to see voting site
                </button>
              </div>
            </div>

            <div className="bg-pink-500 w-[93%] mx-auto flex justify-between items-center px-3 mt-10 py-2">
              <MessageCircleQuestion size={25} />
              <div className="flex flex-col font-bold items-center justify-center">
                <p>{questionCount}</p>
                <p>Questions</p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/election/${electionId}/multiple-type`)}
              disabled={electionData.is_built}
              className={
                electionData.is_built
                  ? "bg-gray-400 p-2 w-[93%] mx-auto flex justify-center mt-3 mb-5"
                  : "bg-green-400 p-2 w-[93%] mx-auto flex justify-center mt-3 mb-5"
              }
            >
              Add Question
            </button>
          </>
        ) : (
          <div></div>
        )}
      </>

      {/*showLoginModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white py-8 rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-green-400 flex flex-row justify-between items-center px-2 py-2">
              <p>Add Ballot Question</p>
              <button
                onClick={handleCloseModal}
                className="px-2 border-black border-2"
              >
                X
              </button>
            </div>
            <p className="px-2">
              What type of question would you like to add to the ballot?
            </p>
            <div className="flex flex-row bg-slate-100 justify-between items-center m-2 py-4 px-3">
              <p>Multiple Choice</p>
              <button
                onClick={() =>
                  navigate(`/election/${electionId}/multiple-type`)
                }
                className="bg-green-400 px-2 px-1 text-white"
              >
                Select
              </button>
            </div>

            <div className="flex flex-row bg-slate-100 justify-between items-center m-2 py-4 px-3">
              <p>Ranked Choice</p>
              <button
                onClick={() => navigate("/register")}
                className="bg-green-400 px-2 px-1 text-white"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )*/}
    </div>
  );
};

export default ElectionDetails;
