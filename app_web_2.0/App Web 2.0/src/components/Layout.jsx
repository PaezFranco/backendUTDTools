import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, LayoutDashboard, Users, Wrench, History, ChevronDown, ChevronUp, FileText, AlertCircle, CornerLeftUp, UserCircle, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Nuevo Préstamo', path: '/new-loan', icon: ArrowRightLeft },
  { name: 'Estudiantes', path: '/students', icon: Users },
  { name: 'Herramientas', path: '/tools', icon: Wrench },
  { name: 'Proceso Devolución', path: '/return-process', icon: CornerLeftUp },
  { name: 'Materiales Vencidos', path: '/overdue-items', icon: AlertCircle },
  { name: 'Reportes', path: '/reports', icon: FileText },
  { name: 'Historial', path: '/history', icon: History },
];

const Layout = ({ children, onLogout, currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  const NavLink = ({ item, mobile = false }) => (
    <Link
      to={item.path}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out
        ${location.pathname === item.path || (item.path === '/students' && location.pathname.startsWith('/students/'))
          ? 'bg-primary/10 text-primary border-l-4 border-primary font-semibold'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }
        ${mobile ? 'text-lg' : 'text-sm'}
      `}
    >
      <item.icon className={`mr-3 h-5 w-5 ${location.pathname === item.path || (item.path === '/students' && location.pathname.startsWith('/students/')) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
      {item.name}
    </Link>
  );

  const adminName = currentUser?.name || "Admin";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-4 space-y-4 fixed h-full shadow-lg">
        <div className="p-4 text-center">
          <img
            src="/utd.png"  // Asegúrate de que la imagen esté en la carpeta `public/`
            alt="Logo UTD Tools"
            className="h-16 mx-auto"
          />
        </div>

        <nav className="flex-grow space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </nav>
        <div className="mt-auto space-y-1">
          <Link
            to="/admin-profile"
            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out text-sm
              ${location.pathname === '/admin-profile'
                ? 'bg-primary/10 text-primary border-l-4 border-primary font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            <UserCircle className={`mr-3 h-5 w-5 ${location.pathname === '/admin-profile' ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
            Mi Perfil
          </Link>
          <Button variant="ghost" onClick={handleLogoutClick} className="w-full justify-start text-muted-foreground hover:text-destructive group">
            <LogOut className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-destructive" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b bg-card border-border shadow-md">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-card p-4 border-r-0 shadow-xl flex flex-col">
              <div className="text-2xl font-bold text-gradient-gold-teal p-4 mb-4 text-center">
                <img
                  src="/utd.png"
                  alt="Logo UTD Tools"
                  className="h-16 mx-auto"
                />
              </div>
              <nav className="space-y-1 flex-grow">
                {navItems.map((item) => (
                  <NavLink key={item.name} item={item} mobile={true} />
                ))}
              </nav>
              <div className="mt-auto space-y-1">
                <Link
                  to="/admin-profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out text-lg
                    ${location.pathname === '/admin-profile'
                      ? 'bg-primary/10 text-primary border-l-4 border-primary font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  <UserCircle className={`mr-3 h-5 w-5 ${location.pathname === '/admin-profile' ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  Mi Perfil
                </Link>
                <Button variant="ghost" onClick={() => { handleLogoutClick(); setIsMobileMenuOpen(false); }} className="w-full justify-start text-muted-foreground hover:text-destructive mt-2 group text-lg">
                  <LogOut className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-destructive" />
                  Cerrar Sesión
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="text-xl font-bold text-gradient-gold-teal">
            <img
              src="/utd.png"
              alt="Logo UTD Tools"
              className="h-10 w-auto mx-auto"
            />
          </Link>
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
              <img
                className="h-8 w-8 rounded-full border-2 border-secondary"
                alt="User Avatar Mobile" src="https://images.unsplash.com/flagged/photo-1608632359963-5828fa3b4141" />
              {isUserMenuOpen ? <ChevronUp className="ml-1 h-4 w-4 text-secondary" /> : <ChevronDown className="ml-1 h-4 w-4 text-secondary" />}
            </Button>
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-50 border border-border"
                >
                  <div className="px-4 py-2 text-sm text-foreground font-medium border-b border-border">
                    {adminName}
                  </div>
                  <Link
                    to="/admin-profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground group"
                  >
                    <UserCircle className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => { handleLogoutClick(); setIsUserMenuOpen(false); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-destructive group"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-destructive" />
                    Cerrar Sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <header className="hidden md:flex sticky top-0 z-30 items-center justify-end h-16 px-6 border-b bg-card border-border shadow-md">
          <div className="relative">
            <Button variant="ghost" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center text-foreground hover:bg-muted group">
              <img
                className="h-8 w-8 rounded-full border-2 border-secondary mr-2"
                alt="User Avatar Desktop" src="https://images.unsplash.com/flagged/photo-1608632359963-5828fa3b4141" />
              {adminName}
              {isUserMenuOpen ? <ChevronUp className="ml-1 h-4 w-4 text-secondary group-hover:text-secondary" /> : <ChevronDown className="ml-1 h-4 w-4 text-secondary group-hover:text-secondary" />}
            </Button>
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-50 border border-border"
                >
                  <div className="px-4 py-2 text-sm text-foreground font-medium border-b border-border">
                    {adminName}
                  </div>
                  <Link
                    to="/admin-profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground group"
                  >
                    <UserCircle className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => { handleLogoutClick(); setIsUserMenuOpen(false); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-destructive group"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-destructive" />
                    Cerrar Sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;