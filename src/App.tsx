import React, { useState } from 'react';
import './App.css';

function App() {

  const [key, setKey] = useState("");
  const [sourceUrl, setSourceUrl] = useState("https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/gldn-Content-Card-MicrosoftProductExperts?wid=404&hei=228&fit=crop");
  const [isWorking, setIsWorking] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const removeBackground = async () => {
    setIsWorking(true);

    try {
      setError(undefined);
      var resp = await fetch("https://aifabricvisiontests.cognitiveservices.azure.com/computervision/imageanalysis:segment?api-version=2023-02-01-preview&mode=backgroundRemoval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": key
        },
        body: JSON.stringify({
          url: sourceUrl
        })
      });

      if (resp.status === 200) {
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        console.log(url);
        setResultImageUrl(url);
      } else {
        setError(resp.status + " " + resp.statusText)
        console.log(resp.status + " " + resp.statusText);
      }
    } catch (ex:any) {
      setError(ex.toString());
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="App">
      <p>Azure Subscription Key</p>
      <input type="password" value={key} onChange={e => setKey(e.target.value)}></input>
      <p>Input image URL (web url)</p>
      <input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)}></input>
      <button onClick={removeBackground}>{ isWorking ? "Removing background" : "Remove background"}</button>
      <div style={{marginTop: "12px"}}>
        <img alt="Source image" src={sourceUrl} width="300px" style={{border: "2px solid black"}}/>
        { resultImageUrl && <img alt="Image with background removed" src={resultImageUrl} width="300px" style={{border: "2px solid black"}}/>}
      </div>
      { error && <p>Error: {error}</p>}
    </div>
  );
}

export default App;
