import { useWindowSize } from './hooks/useWindowSize';
import { useJobSearch } from './hooks/useJobSearch';
import MobileJobBrowser from './components/features/jobs/MobileJobBrowser';
import DesktopJobBrowser from './components/features/jobs/DesktopJobBrowser';

function App() {
  const { isMobile } = useWindowSize();
  const searchState = useJobSearch({ isMobile });

  if (isMobile) {
    return <MobileJobBrowser state={searchState} />;
  }

  return <DesktopJobBrowser state={searchState} />;
}

export default App;
