import {BrowserRouter as Router} from 'react-router-dom';
import {FeedBackProvider} from "./context/general/FeedbackContext.jsx";
import {AdminRoutes, AuthRoutes, MainRoutes} from "./routes/RoutesConfig.jsx";
import {AuthProvider} from "./context/auth/AuthContext.jsx";
import {UserProvider} from "./context/general/UserContext.jsx";
import {AddBuildingProvider} from "./context/admin/AddBuildingContext.jsx";
import {AdminPanelProvider} from "./context/admin/AdminPanelContext.jsx";
import {PaginationProvider} from "./context/general/PaginationContext.jsx";

function App() {

  return (
    <Router>
      <FeedBackProvider>
          <AuthProvider>
              <UserProvider>
                  <AddBuildingProvider>
                      <AdminPanelProvider>
                          <PaginationProvider>
                              <AuthRoutes/>
                              <MainRoutes/>
                              <AdminRoutes/>
                          </PaginationProvider>
                      </AdminPanelProvider>
                  </AddBuildingProvider>
              </UserProvider>
          </AuthProvider>
      </FeedBackProvider>
    </Router>
  )
}

export default App
