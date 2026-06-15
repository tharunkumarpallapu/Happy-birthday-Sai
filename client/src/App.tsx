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
import { SecretLetters } from "./pages/SecretLetters";
import { MemoryUniverse } from "./pages/MemoryUniverse";
import { StoryInNumbers } from "./pages/StoryInNumbers";
import { BirthdayVault } from "./pages/BirthdayVault";

type PageType = 'welcome' | 'countdown' | 'timeline' | 'gallery' | 'letters' | 'universe' | 'numbers' | 'vault';

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
    window.scrollTo(0, 0);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        switch (currentPage) {
          case 'welcome':
            handleNavigate('countdown');
            break;
          case 'countdown':
            handleNavigate('timeline');
            break;
          case 'timeline':
            handleNavigate('gallery');
            break;
          case 'gallery':
            handleNavigate('letters');
            break;
          case 'letters':
            handleNavigate('universe');
            break;
          case 'universe':
            handleNavigate('numbers');
            break;
          case 'numbers':
            handleNavigate('vault');
            break;
        }
      } else if (e.key === 'ArrowLeft') {
        switch (currentPage) {
          case 'countdown':
            handleNavigate('welcome');
            break;
          case 'timeline':
            handleNavigate('countdown');
            break;
          case 'gallery':
            handleNavigate('timeline');
            break;
          case 'letters':
            handleNavigate('gallery');
            break;
          case 'universe':
            handleNavigate('letters');
            break;
          case 'numbers':
            handleNavigate('universe');
            break;
          case 'vault':
            handleNavigate('numbers');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

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
            onNavigate={() => handleNavigate('letters')}
            onPrevious={() => handleNavigate('timeline')}
          />
        );
      case 'letters':
        return (
          <SecretLetters
            onNavigate={() => handleNavigate('universe')}
            onPrevious={() => handleNavigate('gallery')}
          />
        );
      case 'universe':
        return (
          <MemoryUniverse
            onNavigate={() => handleNavigate('numbers')}
            onPrevious={() => handleNavigate('letters')}
          />
        );
      case 'numbers':
        return (
          <StoryInNumbers
            onNavigate={() => handleNavigate('vault')}
            onPrevious={() => handleNavigate('universe')}
          />
        );
      case 'vault':
        return (
          <BirthdayVault
            onPrevious={() => handleNavigate('numbers')}
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
