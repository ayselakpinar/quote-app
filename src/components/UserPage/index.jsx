import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../UserContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

export const UserPage = () => {
  const { user } = useContext(UserContext);
  const [likedCount, setLikedCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); 
      return;
    }
    const fetchLikedCount = async () => {
      try {
        const q = query(collection(db, "likedQuotes"), where("userId", "==", user.id));
        const querySnapshot = await getDocs(q);
        setLikedCount(querySnapshot.size);
      } catch (err) {
        console.error("Error fetching liked count:", err);
      } finally {
        setLoading(false); 
      }
    };

    fetchLikedCount();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-2xl text-primary-dark">Loading...</div>
      </div>
    ); 
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-primary-dark mb-6">
          Welcome, {user?.name || "User"}!
        </h2>
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            <span className="font-medium">Email:</span> {user?.email}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-medium">Liked Quotes:</span> {likedCount}
          </p>
          <button 
            onClick={() => navigate("/user/quotes")}
            className="mt-6 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            View Liked Quotes
          </button>
        </div>
      </div>
    </div>
  );
};