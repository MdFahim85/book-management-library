import { pdfjs } from "react-pdf";

import "./App.css";
import ProviderWrapper from "./components/ProviderWrapper";
import MainLayout from "./layouts/MainLayout";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function App() {
  return (
    <ProviderWrapper>
      <MainLayout />
    </ProviderWrapper>
  );
}

export default App;
