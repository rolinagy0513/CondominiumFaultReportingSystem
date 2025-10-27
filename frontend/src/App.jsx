import {BrowserRouter as Router} from 'react-router-dom';
import {FeedBackProvider} from "./context/FeedbackContext.jsx";
import {AdminRoutes, AuthRoutes, MainRoutes} from "./routes/RoutesConfig.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import {UserProvider} from "./context/UserContext.jsx";

function App() {

  return (
    <Router>
      <FeedBackProvider>
          <AuthProvider>
              <UserProvider>
                  <AuthRoutes/>
                  <MainRoutes/>
                  <AdminRoutes/>
              </UserProvider>
          </AuthProvider>
      </FeedBackProvider>
    </Router>
  )
}

export default App
