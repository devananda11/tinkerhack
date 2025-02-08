import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      setAccessToken(token);
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    setUser(null);
    setAccessToken(null);
    navigate("/");
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold text-green-500">
        Moodify
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Avatar>
              <AvatarImage src={user.images?.[0]?.url} alt={user.display_name} />
              <AvatarFallback>{user.display_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button onClick={handleLogout} variant="default">
              Logout
            </Button>
          </>
        ) : (
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
