import React, { useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface User {
  id: number;
  login: string;
}

interface Repository {
  id: number;
  name: string;
  stargazers_count: number;
  description: string;
}

function App(): JSX.Element {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${username}`
      );
      setUsers(response.data.items.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserClick = async (user: User) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.github.com/users/${user.login}/repos`
      );
      setRepositories(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(true);
      console.error(error);
    }
  };

  return (
    <div>
      <div className="container bg-primary">
        <div className="w-100 d-flex row">
          <div className="col-lg-9">
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="col-lg-3 bg-danger ">
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>

        {users.map((user) => (
          <Accordion key={user.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={() => handleUserClick(user)}
            >
              <Typography>{user.login}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {isLoading ? (
                <div>Loading</div>
              ) : (
                <ul>
                  {repositories.length >= 1 ? (
                    repositories.map((repo) => (
                      <li key={repo.id}>
                        <Typography variant="h6">{repo.name}</Typography>
                        <Typography variant="subtitle1">
                          {repo.stargazers_count} stars
                        </Typography>
                        <Typography variant="body1">
                          {repo.description}
                        </Typography>
                      </li>
                    ))
                  ) : (
                    <h1>user does not own repository</h1>
                  )}
                </ul>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default App;
