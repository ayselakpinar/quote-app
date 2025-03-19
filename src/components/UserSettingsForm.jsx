
import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";  
import { getFirestore, doc, updateDoc } from "firebase/firestore";  

const UserSettingsForm = () => {
  const auth = getAuth();  
  const db = getFirestore();  
  const user = auth.currentUser; 

  const [name, setName] = useState(user?.displayName || "");  
  const [email, setEmail] = useState(user?.email || ""); 
  const [favoriteCategories, setFavoriteCategories] = useState([]); 

 
  const categories = ["Inspirational", "Funny", "Life", "Love", "Wisdom"];

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (name !== user.displayName) {
      await updateProfile(user, {
        displayName: name,
      });
    }

    
    const userRef = doc(db, "users", user.uid);  
    await updateDoc(userRef, {
      favoriteCategories: favoriteCategories,  
    });

    console.log("User settings updated!");
  };

  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>User Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Favorite Categories</label>
        <select
          multiple
          value={favoriteCategories}
          onChange={(e) =>
            setFavoriteCategories(Array.from(e.target.selectedOptions, (option) => option.value))
          }
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Update Settings</button>
    </form>
  );
};

export default UserSettingsForm;
