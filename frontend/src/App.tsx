import "./App.css";
import ProviderWrapper from "./components/ProviderWrapper";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <ProviderWrapper>
      <MainLayout />
    </ProviderWrapper>
  );
}

export default App;
