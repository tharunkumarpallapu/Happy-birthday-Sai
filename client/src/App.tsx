import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useState, useEffect } from "react";
import { BackgroundEffects } from "./components/BackgroundEffects";
import { Welcome } from "./pages/Welcome";
import { Countdown } from "./pages/Countdown";
import { JourneyTimeline } from "./pages/JourneyTimeline";
import { MemoryGallery } from "./pages/MemoryGallery";

type PageType = 'welcome' | 'countdown' | 'timeline' | 'gallery';

function StoryApp() {
  const [currentPage, setCurrentPage] = useState<PageType>('welcome');

  useEffect(() => {
    // Disable body scroll on mount
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return (
          <Welcome
            onNavigate={() => handleNavigate('countdown')}
          />
        );
      case 'countdown':
        return (
          <Countdown
            onNavigate={() => handleNavigate('timeline')}
            onPrevious={() => handleNavigate('welcome')}
          />
        );
      case 'timeline':
        return (
          <JourneyTimeline
            onNavigate={() => handleNavigate('gallery')}
            onPrevious={() => handleNavigate('countdown')}
          />
        );
      case 'gallery':
        return (
          <MemoryGallery
            onPrevious={() => handleNavigate('timeline')}
          />
        );
      default:
        return <Welcome onNavigate={() => handleNavigate('countdown')} />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050010]">
      {/* Background effects */}
      <BackgroundEffects />

      {/* Page content */}
      <div className="relative z-10 w-full h-screen overflow-y-auto">
        {renderPage()}
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={StoryApp} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
