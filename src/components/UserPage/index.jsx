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
        console.error("Error fetching liked count:", err);} 
        finally {
          setLoading(false); 
        }
    };

    fetchLikedCount();
  }, [user , navigate]);
  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="user-page-container">
      <h2>Welcome, {user?.name || "User"}!</h2>
      <p>Email: {user?.email}</p>
      <p>You have liked {likedCount} quotes.</p>
      <button onClick={() => navigate("/user/quotes")}>View Liked Quotes</button>
    </div>
  );
};