import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const NewsSection = lazy(() => import('./components/NewsSection'));
const Contact = lazy(() => import('./components/Contact'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-950">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
      <p className="text-gray-400">جاري التحميل...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <div className='min-h-screen bg-dark-950 text-white font-cairo'>
            <Navbar />
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
                      <Suspense fallback={<LoadingFallback />}>
                        <Hero />
                        <About />
                        <Skills />
                        <Projects />
                        <NewsSection />
                        <Contact />
                      </Suspense>
                    </motion.div>
                  }
                />
              </Routes>
            </AnimatePresence>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
