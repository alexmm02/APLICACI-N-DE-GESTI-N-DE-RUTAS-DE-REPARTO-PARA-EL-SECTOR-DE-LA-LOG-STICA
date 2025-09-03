import { Routes, Route, Outlet } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import { PackageProvider } from "./context/PackageContext";

import Navbar from "./components/navbar/Navbar";
import { Container } from "./components/ui";
import { ProtectedRoute } from "./components/ProtectedRoute";
import HomePage from "./pages/other_pages/HomePage";
import AboutPage from "./pages/other_pages/AboutPage";
import LoginPage from "./pages/login_register_pages/LoginPage";
import RegisterPage from "./pages/login_register_pages/RegisterPage";
import ForgotPasswordPage from "./pages/login_register_pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/login_register_pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/login_register_pages/VerifyEmailPage";
import PackagesPage from "./pages/packages_page/PackagesPage";
import RouteFormPage from "./pages/routes_page/RouteFormPage";
import RoutesPage from "./pages/routes_page/RoutesPage";
import PackageFormPage from "./pages/packages_page/PackageFormPage";
import WelcomePage from "./pages/other_pages/WelcomePage";
import SupportPage from "./pages/support_pages/SupportPage";
import ChangePasswordPage from "./pages/profile_pages/ChangePasswordPage";
import ProfilePage from "./pages/profile_pages/ProfilePage";
import AdminDashboard from "./pages/admin_pages/AdminDashboardPage";
import AdminUsers from "./pages/admin_pages/Users-admin/AdminUsersPage";
import EditUserPage from "./pages/admin_pages/Users-admin/AdminEditUserPage";
import NotFound from "./pages/other_pages/NotFoundPage";
import UnauthorizedPage from "./pages/other_pages/UnauthorizedPage"
import NavigationRoute from "./pages/routes_page/NavigationRoute";
import AdminPackages from "./pages/admin_pages/Packages-admin/AdminPackagesPage";
import EditPackagePage from "./pages/admin_pages/Packages-admin/AdminEditPackagePage";
import AdminSupport from "./pages/admin_pages/Support-admin/AdminSupportPage";
import AdminSupportMessage from "./pages/admin_pages/Support-admin/AdminSupportMessagePage";
import AdminRoutesPage from "./pages/admin_pages/Routes-admin/AdminRoutesPage";
import AdminRouteDetailPage from "./pages/admin_pages/Routes-admin/AdminRouteDetailPage";
import { SupportProvider } from "./context/SupportContext";
import { RouteProvider } from "./context/RoutesContext";
import RealTimeNavigation from "./pages/routes_page/RealTimeNavigation";
import CreateCompanyPage from "./pages/owner_pages/CreateCompanyPage"
import MyCompaniesPage from "./pages/owner_pages/MyCompaniesPage";
import CompanyEmployeesPage from "./pages/owner_pages/CompanyEmployeesPage";
import EmployeePackagesPage from "./pages/owner_pages/EmployeePackagesPage";
import EmployeeRoutesPage from "./pages/owner_pages/EmployeeRoutesPage"
import ClockPage from "./pages/clock_pages/ClockPage";
import EmployeeClockHistoryPage from "./pages/owner_pages/EmployeeClockHistoryPage";
import EmployeePackageFormPage from "./pages/owner_pages/EmployeePackageFormPage";
import EmployeeRouteFormPage from "./pages/owner_pages/EmployeeRouteFormPage";
import AdminCompaniesPage from "./pages/admin_pages/Companies-admin/AdminCompaniesPage";
import AdminCompanyEmployeesPage from "./pages/admin_pages/Companies-admin/AdminCompanyEmployeesPage";
import AdminUserPackagesPage from "./pages/admin_pages/Packages-admin/AdminUserPackagesPage";
import AdminEditRoutePage from "./pages/admin_pages/Routes-admin/AdminEditRoutePage";
import AdminUserRoutesPage from "./pages/admin_pages/Routes-admin/AdminUserRoutesPage";
import AdminClockHistoryPage from "./pages/admin_pages/Companies-admin/AdminClockHistoryPage";
import { AdminUserProvider } from "./context/adminContext/AdminUserContext";
import { AdminPackageProvider } from "./context/adminContext/AdminPackageContext";
import { AdminSupportProvider } from "./context/adminContext/AdminSupportContext";
import { AdminRouteProvider } from "./context/adminContext/AdminRouteContext";
import { AdminCompanyProvider } from "./context/adminContext/AdminCompanyContext";
import { OwnerCompanyProvider } from "./context/ownerContext/OwnerCompanyContext";
import { OwnerPackageProvider } from "./context/ownerContext/OwnerPackageContext";
import { OwnerRouteProvider } from "./context/ownerContext/OwnerRouteContext";


function App() {
  const { isAuth, isAdmin, loading, isOwner } = useAuth(); 

  console.log("Auth Status:", { isAuth, isAdmin, loading });

  if (loading) return <h1>Cargando...</h1>;

  return (
    <>
      <Navbar />

      <Container className="py-5">
        <Routes>
          {/* 🔹 Rutas públicas */}
          <Route element={<ProtectedRoute isAllowed={!isAuth} redirectTo="/welcome" />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/verify/:token" element={<VerifyEmailPage />} />
          </Route>

          {/* 🔹 Rutas protegidas (Usuarios autenticados) */}
          <Route element={<ProtectedRoute isAllowed={isAuth} isAdmin={isAdmin} redirectTo="/login" />}>
            <Route element={<PackageProvider><Outlet /></PackageProvider>}>
              <Route path="/packages" element={<PackagesPage />} />
              <Route element={<RouteProvider><Outlet /></RouteProvider>}>
                <Route path="/select-packages" element={<RouteFormPage />} />
                <Route path="/routes/:id/edit" element={<RouteFormPage />} />
                <Route path="/routes" element={<RoutesPage />} />
                <Route path="/navigation/:routeId" element={<NavigationRoute />} />
                <Route path="/navigation-live/:routeId" element={<RealTimeNavigation />} />
              </Route>
              <Route path="/packages/new" element={<PackageFormPage />} />
              <Route path="/packages/:id/edit" element={<PackageFormPage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
            </Route>
            <Route element={<SupportProvider><Outlet /></SupportProvider>}>
              <Route path="/support" element={<SupportPage />} />
            </Route>
            <Route path="/clock" element={<ClockPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
//=================================================================================================
          {/* 🔹 Rutas solo para administradores */}
          <Route element={<ProtectedRoute isAllowed={isAuth} isAdmin={isAdmin} adminOnly={true} redirectTo="/unauthorized" />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            //usuarios
            <Route element={<AdminUserProvider><Outlet /></AdminUserProvider>}>
              <Route path="/admin-dashboard/users" element={<AdminUsers />} />
              <Route path="/admin/users/:id/edit" element={<EditUserPage />} />
            </Route>
            //paquetes
            <Route element={<AdminPackageProvider><Outlet /></AdminPackageProvider>}>
              <Route path="/admin-dashboard/packages" element={<AdminPackages />} />
              <Route path="/admin/packages/:id/edit" element={<EditPackagePage />} />
              <Route path="/admin/user/:userId/packages/new" element={<EditPackagePage />} />
              <Route element={<AdminUserProvider><Outlet /></AdminUserProvider>}>
                <Route path="/admin/user/:userId/packages" element={<AdminUserPackagesPage />} />
              </Route>
            </Route>
            //soporte
            <Route element={<AdminSupportProvider><Outlet /></AdminSupportProvider>}>
              <Route path="/admin-dashboard/support" element={<AdminSupport />} />
              <Route path="/admin/support/:id" element={<AdminSupportMessage />} />
            </Route>
            //rutas
            <Route element={<AdminRouteProvider><Outlet /></AdminRouteProvider>}>
              <Route path="/admin-dashboard/routes" element={<AdminRoutesPage />} />
              <Route path="/admin-dashboard/routes/:id" element={<AdminRouteDetailPage />} />
              <Route element={<AdminUserProvider><Outlet /></AdminUserProvider>}>
                <Route path="/admin/user/:userId/routes" element={<AdminUserRoutesPage />} />
              </Route>
              
              <Route element={<AdminPackageProvider><Outlet /></AdminPackageProvider>}>
                <Route path="/admin/user/:userId/routes/new" element={<AdminEditRoutePage />} />
                <Route path="/admin/user/:userId/routes/:routeId/edit" element={<AdminEditRoutePage />} />
              </Route>
            </Route>
            //compañias
            <Route element={<AdminCompanyProvider><Outlet /></AdminCompanyProvider>}>
              <Route path="/admin-dashboard/companies" element={<AdminCompaniesPage />} />
              <Route path="/admin-dashboard/companies/:companyId/employees" element={<AdminCompanyEmployeesPage />} />
              <Route path="/admin/user/:userId/clock-history" element={<AdminClockHistoryPage />} />
            </Route>
          </Route>
//=================================================================================================

          <Route element={<ProtectedRoute isAllowed={isAuth} isAdmin={isAdmin} isOwner={isOwner} ownerOnly redirectTo="/unauthorized" />} >
            <Route element={<OwnerCompanyProvider><Outlet /></OwnerCompanyProvider>}>
              <Route path="/owner/my-companies" element={<MyCompaniesPage />} />
              <Route path="/owner/company/:companyId/employees" element={<CompanyEmployeesPage />}/>
              <Route path="/create-company" element={<CreateCompanyPage />} />
              <Route path="/owner/company/:companyId/user/:userId/clock-history" element={<EmployeeClockHistoryPage />} />
            </Route>
            <Route element={<OwnerPackageProvider><Outlet /></OwnerPackageProvider>}>
              <Route path="/owner/company/:companyId/user/:userId/packages/:id/edit" element={<EmployeePackageFormPage />}/>
              <Route path="/owner/company/:companyId/user/:userId/packages/new" element={<EmployeePackageFormPage />} />
              <Route element={<OwnerCompanyProvider><Outlet /></OwnerCompanyProvider>}>
                <Route path="/owner/company/:companyId/user/:userId/packages" element={<EmployeePackagesPage />} />
              </Route>
            </Route>
            <Route element={<OwnerRouteProvider><Outlet /></OwnerRouteProvider>}>
              <Route element={<OwnerCompanyProvider><Outlet /></OwnerCompanyProvider>}>
                <Route path="/owner/company/:companyId/user/:userId/routes" element={<EmployeeRoutesPage />} />
              </Route>
              <Route element={<OwnerPackageProvider><Outlet /></OwnerPackageProvider>}>
                <Route path="/owner/company/:companyId/user/:userId/routes/new" element={<EmployeeRouteFormPage />} />
                <Route path="/owner/company/:companyId/user/:userId/routes/:routeId/edit" element={<EmployeeRouteFormPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
