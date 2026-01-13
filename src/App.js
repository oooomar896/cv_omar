import { lazy, Suspense, useEffect } from 'react';
/* ... imports ... */

/* ... LoadingFallback ... */

const AppContent = () => {
  usePageTracking();
  const { pathname } = useLocation();
  const isAdminPath = pathname.startsWith('/admin');

  // Auto-seed data mechanism
  useEffect(() => {
    const seedData = async () => {
      try {
        const { dataService } = await import('./utils/dataService');
        const news = dataService.getNews();

        // Check if Maldia cert exists in current state
        if (!news.some(n => n.title.includes('Maldia') || n.title.includes('Global'))) {
          console.log('Auto-seeding Maldia Certificate...');
          await dataService.addNews({
            title: 'شهادة البحث والتطوير - Maldia Global',
            content: 'الحصول على شهادة R&D Certificate من شركة Maldia Global International Technology كمطور Flutter بعد إتمام المهام البرمجية والوحدات المطلوبة بنجاح وتسليمها.',
            date: '2022-06-15',
            image: '/images/cert/maldia_cert.jpg',
            // Note: fallbackIcon handling is local-logic mostly, but we save it if DB schema allows or it stays in local override
            link: '#'
          });
        }
      } catch (err) {
        // Silent fail
        console.log('Seeding check skipped');
      }
    };

    // Delay to allow app to init
    const timer = setTimeout(seedData, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='min-h-screen bg-dark-950 text-white font-cairo'>
      {!isAdminPath && <Navbar />}
      <AnimatePresence mode='wait'>
        <Routes>
          <Route
            path='/'
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SEO
                  title="عمر العديني | حلول برمجية ذكية"
                  description="مطور برمجيات شامل (Full Stack) ومتخصص في الذكاء الاصطناعي. ابدأ مشروعك التقني اليوم."
                />
                <Suspense fallback={<LoadingFallback />}>
                  <Home />
                </Suspense>
              </motion.div>
            }
          />

          <Route
            path='/request'
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-24 pb-12"
              >
                <SEO
                  title="طلب مشروع جديد | عمر العديني"
                  description="ابدأ رحلة مشروعك التقني معنا. املأ النموذج وسنقوم بتحويل فكرتك إلى واقع."
                />
                <Suspense fallback={<LoadingFallback />}>
                  <RequestService />
                </Suspense>
              </motion.div>
            }
          />

          <Route
            path='/developer'
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SEO
                  title="عمر حميد العديني - مطور تطبيقات محترف"
                  description="خبرة واسعة في Flutter, React Native, Odoo وتطوير الحلول التقنية المخصصة في المملكة العربية السعودية."
                />
                <Suspense fallback={<LoadingFallback />}>
                  <DeveloperProfile />
                </Suspense>
              </motion.div>
            }
          />
          <Route
            path='/builder'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <div className="pt-24 pb-12">
                  <SEO
                    title="باني المشاريع الذكي"
                    description="أداة تفاعلية لبناء هيكل مشروعك البرمجي، توليد الكود، والحصول على خطة تنفيذية فورية."
                  />
                  <ProjectBuilderForm />
                </div>
              </Suspense>
            }
          />

          <Route
            path='/uikit'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SEO title="مكتبة المكونات | عمر العديني" />
                <UIKitLibrary />
              </Suspense>
            }
          />

          <Route
            path='/portal/login'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SEO title="تسجيل الدخول - بوابة العميل" />
                <PortalLogin />
              </Suspense>
            }
          />

          <Route
            path='/portal/dashboard'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SEO title="لوحة التحكم - بوابة العميل" />
                <UserPortal />
              </Suspense>
            }
          />

          {/* Domain Routes */}
          <Route
            path='/domains/search'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SEO
                  title="البحث عن دومين | باكورة أعمال"
                  description="ابحث عن الدومين المثالي لمشروعك واحجزه بأفضل الأسعار"
                />
                <DomainSearch />
              </Suspense>
            }
          />

          <Route
            path='/portal/domains'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SEO title="إدارة الدومينات - بوابة العميل" />
                <ProtectedRoute>
                  <DomainManagement />
                </ProtectedRoute>
              </Suspense>
            }
          />

          <Route
            path='/domains/checkout'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SEO
                  title="إتمام الطلب | باكورة أعمال"
                  description="أكمل عملية شراء الدومينات الخاصة بك"
                />
                <DomainCheckout />
              </Suspense>
            }
          />

          <Route
            path='/domains/dns/:domainId'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SEO
                  title="إدارة DNS | باكورة أعمال"
                  description="إدارة سجلات DNS للدومين الخاص بك"
                />
                <ProtectedRoute>
                  <DNSManager />
                </ProtectedRoute>
              </Suspense>
            }
          />

          {/* Admin Login */}
          <Route
            path='/admin/login'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SEO title="دخول المدير" />
                <AdminLogin />
              </Suspense>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path='/admin/*'
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute>
                  <AdminLayout>
                    <SEO title="لوحة تحكم الإدارة" />
                    <Routes>
                      <Route index element={<DashboardHome />} />
                      <Route path="projects" element={<ManageProjects />} />
                      <Route path="skills" element={<ManageSkills />} />
                      <Route path="news" element={<ManageNews />} />
                      <Route path="requests" element={<ManageRequests />} />
                      <Route path="messages" element={<ManageMessages />} />
                      <Route path="users" element={<ManageUsers />} />
                      <Route path="analytics" element={<AnalyticsDashboard />} />
                      <Route path="settings" element={<ManageSettings />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Routes>
      </AnimatePresence>
      {!isAdminPath && <Footer />}
      <Suspense fallback={null}>
        <AIAssistant />
      </Suspense>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <SEOStructuredData />
          <Toaster
            position="bottom-left"
            toastOptions={{
              className: 'font-cairo',
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
          <AppContent />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
