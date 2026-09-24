import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getBreaking } from './api';
import { CATEGORIES } from './data/categories.js';
import Header from './components/Header';
import Footer from './components/Footer';
import BreakingTicker from './components/BreakingTicker';
import Home from './pages/Home';
import Category from './pages/Category';
import Article from './pages/Article';
import StaticPage from './pages/StaticPage';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const [breaking, setBreaking] = useState([]);

  useEffect(() => {
    getBreaking().then(setBreaking).catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app">
        <Header categories={CATEGORIES} />
        <BreakingTicker items={breaking} />
        <main className="container main-content">
          <Routes>
            <Route path="/" element={<Home categories={CATEGORIES} />} />
            <Route path="/category/:slug" element={<Category categories={CATEGORIES} />} />
            <Route path="/article/:slug" element={<Article categories={CATEGORIES} />} />
            <Route
              path="/about"
              element={
                <StaticPage title="About Best News Media">
                  <p>
                    Best News Media launched in May 2009 with a simple mission: deliver clear,
                    comprehensive news without the noise. What began as a small editorial operation
                    in Edmonton, Alberta has grown into a global newsroom covering technology,
                    politics, science, health, sports, entertainment, and the natural world.
                  </p>
                  <p>
                    For more than fifteen years, our journalists have filed stories from every
                    continent. We believe readers deserve facts, context, and thoughtful analysis —
                    whether the headline concerns a breakthrough in medicine or a championship final.
                  </p>
                  <p>
                    bestnewsmedia.com remains independently operated. Our commitment to accuracy
                    and fairness has never changed.
                  </p>
                </StaticPage>
              }
            />
            <Route
              path="/contact"
              element={
                <StaticPage title="Contact the Newsroom">
                  <p><strong>General inquiries:</strong> newsroom@bestnewsmedia.com</p>
                  <p><strong>News tips:</strong> tips@bestnewsmedia.com</p>
                  <p><strong>Editorial office:</strong> Edmonton, Alberta, Canada</p>
                  <p>
                    Our newsroom accepts story tips around the clock. Please include as much
                    detail as possible and indicate whether you are willing to be contacted
                    for follow-up.
                  </p>
                </StaticPage>
              }
            />
            <Route
              path="/archives"
              element={
                <StaticPage title="Story Archives">
                  <p>
                    Best News Media maintains a complete archive of published stories dating back
                    to our founding in 2009. Browse by section using the navigation above to
                    explore coverage from any beat.
                  </p>
                  <p>
                    Older stories remain available on bestnewsmedia.com and reflect reporting
                    at the time of publication.
                  </p>
                </StaticPage>
              }
            />
            <Route
              path="/privacy"
              element={
                <StaticPage title="Privacy Policy">
                  <p>
                    Best News Media respects your privacy. We collect minimal analytics data
                    to improve site performance and do not sell personal information to third
                    parties.
                  </p>
                  <p>
                    For questions about this policy, contact privacy@bestnewsmedia.com.
                  </p>
                </StaticPage>
              }
            />
          </Routes>
        </main>
        <Footer categories={CATEGORIES} />
      </div>
    </BrowserRouter>
  );
}
