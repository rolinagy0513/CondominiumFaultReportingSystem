import {BrowserRouter as Router} from 'react-router-dom';
import {FeedBackProvider} from "./context/general/FeedbackContext.jsx";
import {AdminRoutes, AuthRoutes, MainRoutes} from "./routes/RoutesConfig.jsx";
import {AuthProvider} from "./context/auth/AuthContext.jsx";
import {UserProvider} from "./context/general/UserContext.jsx";
import {AddBuildingProvider} from "./context/admin/AddBuildingContext.jsx";
import {AdminPanelProvider} from "./context/admin/AdminPanelContext.jsx";
import {PaginationProvider} from "./context/general/PaginationContext.jsx";
import {AdminModalProvider} from "./context/admin/AdminModalContext.jsx";
import {AdminUserProvider} from "./context/admin/AdminUserContext.jsx";
import {BuildingProvider} from "./context/admin/BuildingContext.jsx";
import {ApartmentProvider} from "./context/admin/ApartmentContext.jsx";
import {NotificationProvider} from "./context/admin/NotificationContext.jsx";
import {CompanyProvider} from "./context/admin/CompanyContext.jsx";
import {RoleSelectionProvider} from "./context/role-selection/RoleSelectionContext.jsx";

function App() {

  return (
    <Router>
      <FeedBackProvider>
          <AuthProvider>
              <UserProvider>
                  <AddBuildingProvider>
                      <AdminPanelProvider>
                          <PaginationProvider>
                              <AdminModalProvider>
                                  <AdminUserProvider>
                                      <BuildingProvider>
                                          <ApartmentProvider>
                                              <NotificationProvider>
                                                   <CompanyProvider>
                                                       <RoleSelectionProvider>
                                                           <AuthRoutes/>
                                                           <MainRoutes/>
                                                           <AdminRoutes/>
                                                       </RoleSelectionProvider>
                                                   </CompanyProvider>
                                              </NotificationProvider>
                                          </ApartmentProvider>
                                      </BuildingProvider>
                                  </AdminUserProvider>
                              </AdminModalProvider>
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
