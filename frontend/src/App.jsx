import {BrowserRouter as Router} from 'react-router-dom';
import {AdminRoutes, AuthRoutes, MainRoutes} from "./routes/RoutesConfig.jsx";

import {FeedBackProvider} from "./context/general/FeedbackContext.jsx";
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
import {ResidentRequestProvider} from "./context/role-selection/ResidentRequestContext.jsx";
import {CompanyRequestProvider} from "./context/role-selection/CompanyRequestContext.jsx";
import {ResidentPageProvider} from "./context/resident/ResidentPageContext.jsx";
import {ResidentApartmentProvider} from "./context/resident/ResidentApartmentContext.jsx";
import {ResidentBuildingProvider} from "./context/resident/ResidentBuildingContext.jsx";
import {ResidentCompanyProvider} from "./context/resident/ResidentCompanyContext.jsx";
import {ResidentReportProvider} from "./context/resident/ResidentReportContext.jsx";
import {ResidentUserProvider} from "./context/resident/ResidentUserContext.jsx";
import {InvoiceProvider} from "./context/invoice/InvoiceContext.jsx";
import {ResidentNotificationProvider} from "./context/resident/ResidentNotificationContext.jsx";

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
                                                           <ResidentRequestProvider>
                                                               <CompanyRequestProvider>
                                                                   <ResidentPageProvider>
                                                                       <ResidentApartmentProvider>
                                                                           <ResidentBuildingProvider>
                                                                               <ResidentCompanyProvider>
                                                                                   <ResidentReportProvider>
                                                                                       <ResidentUserProvider>
                                                                                           <InvoiceProvider>
                                                                                               <ResidentNotificationProvider>
                                                                                                   <AuthRoutes/>
                                                                                                   <MainRoutes/>
                                                                                                   <AdminRoutes/>
                                                                                               </ResidentNotificationProvider>
                                                                                           </InvoiceProvider>
                                                                                       </ResidentUserProvider>
                                                                                   </ResidentReportProvider>
                                                                               </ResidentCompanyProvider>
                                                                           </ResidentBuildingProvider>
                                                                       </ResidentApartmentProvider>
                                                                   </ResidentPageProvider>
                                                               </CompanyRequestProvider>
                                                           </ResidentRequestProvider>
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
